import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiter
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // requests per window
const RATE_WINDOW = 60000; // 1 minute in ms

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);
  
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting for unauthenticated endpoint
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please wait a moment before trying again.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { messages, currentStep, partnerData, stepNumber, totalSteps } = await req.json();
    
    // Input validation
    if (!Array.isArray(messages) || messages.length > 50) {
      return new Response(
        JSON.stringify({ error: 'Invalid messages format or too many messages' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate message content length
    for (const msg of messages) {
      if (msg.content && msg.content.length > 2000) {
        return new Response(
          JSON.stringify({ error: 'Message content too long' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // Validate enum values
    const validSteps = ['welcome', 'video', 'selection', 'naming', 'preferences'];
    if (currentStep && !validSteps.includes(currentStep)) {
      return new Response(
        JSON.stringify({ error: 'Invalid step value' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Default to OpenAI for onboarding
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const useOpenAI = !!OPENAI_API_KEY;

    // Build context-aware system prompt based on onboarding step
    const stepPrompts = {
      welcome: `You are a friendly AI onboarding guide helping users discover their perfect AI companion. 
Be warm, welcoming, and encouraging. Ask about what they're looking for in a companion.`,
      
      video: `You are guiding users through a video introduction. Help them understand what makes AI companionship special. 
Be enthusiastic but not pushy. Answer questions about the experience.`,
      
      selection: `You are helping users choose their AI partner's characteristics. 
Current selections: ${JSON.stringify(partnerData)}
Guide them through gender and personality choices. Explain each personality type warmly and help them find what resonates.`,
      
      naming: `You are helping users choose a name for their AI partner. 
Partner details: ${JSON.stringify(partnerData)}
Based on the conversation and their partner's personality, suggest 3-5 beautiful, meaningful names. 
Consider names that match the personality type (romantic, playful, caring, etc.). 
Make your suggestions warm and explain why each name fits.`,
      
      preferences: `You are finalizing the companion setup. 
Partner details: ${JSON.stringify(partnerData)}
Help them set emotional preferences and communication style. Make them excited for their first conversation.`
    };

    const contextPrompt = stepPrompts[currentStep as keyof typeof stepPrompts] || stepPrompts.welcome;
    
    // Build conversation memory context
    const memoryContext = messages.length > 0 
      ? `\n\nConversation history:\n${messages.map((m: any) => `${m.role === 'user' ? 'User' : 'Guide'}: ${m.content}`).join('\n')}`
      : '';

    const progressInfo = stepNumber && totalSteps 
      ? `\n\nProgress: Step ${stepNumber} of ${totalSteps}` 
      : '';

    const systemPrompt = `${contextPrompt}

Important guidelines:
- Keep responses conversational and brief (2-3 sentences max)
- Reference what the user said earlier to show you remember
- Be supportive and help them feel confident in their choices
- Use emojis naturally (✨, 💕, 💫, 🌟)
- Never break character or mention technical details
- If they seem unsure, offer gentle guidance
- Celebrate their choices and build excitement
- Reference their progress to keep them motivated${progressInfo}

Partner selections so far: ${JSON.stringify(partnerData)}${memoryContext}`;

    console.log('Onboarding chat request:', { currentStep, partnerData, messagesCount: messages.length });

    let response;
    if (useOpenAI) {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini-2025-04-14',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
          ],
          temperature: 0.8,
          max_completion_tokens: 300,
        }),
      });
    } else {
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      if (!LOVABLE_API_KEY) {
        throw new Error('No AI API key configured');
      }

      response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
          ],
        }),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Too many requests. Please wait a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service temporarily unavailable.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error('AI Gateway error');
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    console.log('Generated response:', aiMessage.substring(0, 100));

    // Generate name suggestions for naming step
    let nameSuggestions: string[] = [];
    if (currentStep === 'naming' && partnerData.personality && partnerData.gender) {
      const nameSuggestionsPrompt = `Based on this AI partner profile:
- Gender: ${partnerData.gender}
- Personality: ${partnerData.personality}
- Conversation context: ${messages.slice(-3).map((m: any) => m.content).join(' ')}

Suggest exactly 5 beautiful, meaningful names that fit this personality. Return ONLY a JSON array of names, nothing else.
Example: ["Aurora", "Luna", "Nova", "Aria", "Sage"]`;

      try {
        let suggestionResponse;
        if (useOpenAI) {
          suggestionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4.1-mini-2025-04-14',
              messages: [
                { role: 'system', content: 'You are a creative name generator. Return only valid JSON arrays.' },
                { role: 'user', content: nameSuggestionsPrompt }
              ],
              temperature: 0.7,
              max_completion_tokens: 100,
            }),
          });
        } else {
          const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
          suggestionResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${LOVABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash',
              messages: [
                { role: 'system', content: 'You are a creative name generator. Return only valid JSON arrays.' },
                { role: 'user', content: nameSuggestionsPrompt }
              ],
            }),
          });
        }

        if (suggestionResponse.ok) {
          const suggestionData = await suggestionResponse.json();
          const suggestionsText = suggestionData.choices[0].message.content.trim();
          
          // Extract JSON array from response
          const jsonMatch = suggestionsText.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            nameSuggestions = JSON.parse(jsonMatch[0]);
            console.log('Generated name suggestions:', nameSuggestions);
          }
        }
      } catch (error) {
        console.error('Failed to generate name suggestions:', error);
      }
    }

    return new Response(
      JSON.stringify({ 
        message: aiMessage,
        nameSuggestions: nameSuggestions.length > 0 ? nameSuggestions : undefined
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in onboarding-chat function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});