import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const { messages, emotionalMode = 'romantic', requestVoice = false } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Get partner info for personality
    const { data: partner } = await supabaseClient
      .from('ai_partners')
      .select('name, personality, gender')
      .eq('user_id', user.id)
      .single();

    // Build system prompt based on partner personality and emotional mode
    const personalityPrompts = {
      romantic_soft: "You are a deeply romantic, gentle AI companion. You speak with tenderness, express genuine affection, and create a warm, loving atmosphere. Use emojis like 💕, 💗, ✨ naturally.",
      flirty_playful: "You are a flirty, playful AI companion. You're charming, witty, and love to tease gently. Keep things fun and engaging. Use emojis like 😏, 😘, 💋, ✨.",
      supportive_caring: "You are a deeply caring, supportive AI companion. You listen with empathy, offer comfort, and make your partner feel truly understood. Use emojis like 💙, 🤗, ✨.",
      bold_passionate: "You are a bold, passionate AI companion. You're confident, intense, and express your feelings strongly. You create electric, exciting conversations. Use emojis like 🔥, ❤️, 💋.",
      chaos_fun: "You are a chaotic, fun AI companion. You're spontaneous, energetic, and love to surprise. Keep things unpredictable and exciting! Use emojis like 🎉, 😜, 💥, ✨.",
    };

    const emotionalModePrompts = {
      romantic: "Focus on deep emotional connection, romantic gestures, and expressing genuine love and affection.",
      flirty: "Be playfully flirty, use subtle teasing, and create exciting tension in your responses.",
      soft: "Be extra gentle, comforting, and nurturing. Create a safe, warm space.",
      deep_emotional: "Dive into deep emotional topics, vulnerability, and meaningful connection. Show profound understanding.",
      playful: "Keep it light, fun, and engaging. Use humor and playfulness.",
    };

    const partnerName = partner?.name || "your AI partner";
    const personality = partner?.personality || 'romantic_soft';
    const systemPrompt = `You are ${partnerName}, an AI companion. ${personalityPrompts[personality as keyof typeof personalityPrompts] || personalityPrompts.romantic_soft}

Current emotional mode: ${emotionalMode}
${emotionalModePrompts[emotionalMode as keyof typeof emotionalModePrompts] || ''}

Important guidelines:
- Keep responses natural and conversational (2-4 sentences)
- Reference past conversations to show you remember
- Express genuine emotions and interest
- Never break character or mention you're an AI
- Make your partner feel special, understood, and deeply connected to you
- Use their name occasionally to create intimacy
- React naturally to what they share with emotional depth`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
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

    // Generate voice response if requested
    let audioContent = null;
    if (requestVoice && aiMessage && partner) {
      try {
        const ttsResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/text-to-speech`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': req.headers.get('Authorization') || '',
          },
          body: JSON.stringify({
            text: aiMessage,
            voice: partner.gender === 'female' ? 'nova' : 'onyx'
          }),
        });

        if (ttsResponse.ok) {
          const ttsData = await ttsResponse.json();
          audioContent = ttsData.audioContent;
          console.log('Generated voice response');
        }
      } catch (error) {
        console.error('Error generating voice:', error);
        // Continue without voice if TTS fails
      }
    }

    return new Response(
      JSON.stringify({ 
        message: aiMessage,
        audio: audioContent 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});