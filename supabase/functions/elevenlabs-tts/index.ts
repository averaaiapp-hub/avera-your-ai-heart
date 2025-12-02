import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Voice mapping based on personality and gender
const voiceMapping = {
  female: {
    romantic_soft: '9BWtsMINqrJLrRacOk9x', // Aria - warm and gentle
    flirty_playful: 'EXAVITQu4vr4xnSDxMaL', // Sarah - playful and charming
    supportive_caring: 'pFZP5JQG7iQjIQuC4Bku', // Lily - caring and soft
    bold_passionate: 'cgSgspJ2msm6clMCkdW9', // Jessica - confident and passionate
    chaos_fun: 'XB0fDUnXU5powFXDhCwa', // Charlotte - energetic and fun
  },
  male: {
    romantic_soft: 'TX3LPaxmHKxFdv7VOQHJ', // Liam - warm and romantic
    flirty_playful: 'CwhRBWXzGAHq8TQ4Fs17', // Roger - charming and playful
    supportive_caring: 'onwK4e9ZLuTAKqWW03F9', // Daniel - supportive and calm
    bold_passionate: 'pqHfZKP75CvOlQylNhV4', // Bill - bold and intense
    chaos_fun: 'IKne3meq5aSn9XLyUdCD', // Charlie - fun and spontaneous
  },
  non_binary: {
    romantic_soft: 'SAz9YHcvj6GT2YYXdXww', // River - gentle and romantic
    flirty_playful: 'N2lVS1w4EtoT3dr4eOWO', // Callum - playful
    supportive_caring: 'JBFqnCBsd6RMkjVDRZzb', // George - caring
    bold_passionate: 'bIHbv24MWmeRgasZH58o', // Will - passionate
    chaos_fun: 'nPczCjzI2devNBz1zQrb', // Brian - energetic
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text, personality = 'romantic_soft', gender = 'female' } = await req.json();

    // Input validation
    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (text.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Text too long (max 5000 characters)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate personality and gender enums
    const validPersonalities = ['romantic_soft', 'flirty_playful', 'supportive_caring', 'bold_passionate', 'chaos_fun'];
    const validGenders = ['female', 'male', 'non_binary'];
    
    if (personality && !validPersonalities.includes(personality)) {
      return new Response(
        JSON.stringify({ error: 'Invalid personality type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (gender && !validGenders.includes(gender)) {
      return new Response(
        JSON.stringify({ error: 'Invalid gender type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY not configured');
    }

    // Select voice based on personality and gender
    const voiceId = voiceMapping[gender as keyof typeof voiceMapping]?.[personality as keyof typeof voiceMapping.female] 
      || voiceMapping.female.romantic_soft;

    console.log(`Generating ElevenLabs TTS - Voice: ${voiceId}, Personality: ${personality}, Gender: ${gender}`);

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true
        }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('ElevenLabs API error:', response.status, error);
      throw new Error(error || 'Failed to generate speech');
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );

    console.log('ElevenLabs speech generation successful');

    return new Response(
      JSON.stringify({ audioContent: base64Audio }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in elevenlabs-tts:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
