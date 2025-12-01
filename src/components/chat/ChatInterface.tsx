import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { EmotionalModeSelector } from './EmotionalModeSelector';
import { VoiceRecordButton } from './VoiceRecordButton';
import { GiftSelector } from './GiftSelector';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  audio_url?: string | null;
  gift_id?: string | null;
}

interface ChatInterfaceProps {
  onCreditsExhausted: () => void;
}

export const ChatInterface = ({ onCreditsExhausted }: ChatInterfaceProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [emotionalMode, setEmotionalMode] = useState<string>('romantic');
  const [freeMessages, setFreeMessages] = useState(3);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [loadingPartner, setLoadingPartner] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadConversation();
      checkCredits();
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const checkCredits = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('message_credits')
      .select('free_messages_remaining')
      .eq('user_id', user.id)
      .single();

    if (data) {
      // DEV MODE: Always show unlimited credits
      setFreeMessages(999999);
    }
  };

  const loadConversation = async () => {
    if (!user) return;
    
    setLoadingPartner(true);

    // Get AI partner
    const { data: partner, error: partnerError } = await supabase
      .from('ai_partners')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!partner || partnerError) {
      console.error('No AI partner found:', partnerError);
      toast({
        title: "Setup Incomplete",
        description: "Please complete onboarding first.",
        variant: "destructive",
      });
      setLoadingPartner(false);
      navigate('/onboarding');
      return;
    }
    
    setLoadingPartner(false);

    // Get or create conversation
    let { data: conversation } = await supabase
      .from('conversations')
      .select('id')
      .eq('user_id', user.id)
      .eq('partner_id', partner.id)
      .single();

    if (!conversation) {
      const { data: newConv } = await supabase
        .from('conversations')
        .insert({ user_id: user.id, partner_id: partner.id })
        .select('id')
        .single();
      conversation = newConv;
    }

    if (conversation) {
      setConversationId(conversation.id);
      
      // Load messages
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true });

      if (msgs) {
        setMessages(msgs as Message[]);
      }

      // If no messages, send welcome message
      if (!msgs || msgs.length === 0) {
        sendWelcomeMessage(conversation.id);
      }
    }
  };

  const sendWelcomeMessage = async (convId: string) => {
    const welcomeMsg = "Hi! I'm so happy you're here. I can't wait to get to know you better. What's on your mind today? 💕";
    
    await supabase.from('messages').insert([{
      conversation_id: convId,
      role: 'assistant' as const,
      content: welcomeMsg,
      emotional_mode: emotionalMode as any,
    }]);

    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: welcomeMsg,
      created_at: new Date().toISOString(),
    }]);
  };

  const sendMessage = async (messageText?: string, audioBlob?: Blob) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || !conversationId || !user) return;

    // DEV MODE: Skip credit checks
    // await checkCredits();
    // if (freeMessages <= 0) {
    //   onCreditsExhausted();
    //   return;
    // }

    if (!messageText) setInput('');
    setLoading(true);

    try {
      // Upload audio if provided
      let audioUrl = null;
      if (audioBlob) {
        const fileName = `${user.id}/${Date.now()}.webm`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('voice-messages')
          .upload(fileName, audioBlob);

        if (uploadError) {
          console.error('Error uploading audio:', uploadError);
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('voice-messages')
            .getPublicUrl(uploadData.path);
          audioUrl = publicUrl;
        }
      }

      // Add user message
      const { data: userMsg } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          role: 'user' as const,
          content: textToSend,
          audio_url: audioUrl,
        }])
        .select()
        .single();

      if (userMsg) {
        setMessages((prev) => [...prev, userMsg as Message]);
      }

      // Decrement credits
      const { data: credits } = await supabase
        .from('message_credits')
        .select('total_messages_sent')
        .eq('user_id', user.id)
        .single();

      await supabase
        .from('message_credits')
        .update({
          free_messages_remaining: freeMessages - 1,
          total_messages_sent: (credits?.total_messages_sent || 0) + 1,
        })
        .eq('user_id', user.id);

      setFreeMessages(prev => prev - 1);

      // Get AI response
      setIsTyping(true);
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('chat', {
        body: {
          messages: [...conversationHistory, { role: 'user', content: textToSend }],
          emotionalMode,
          requestVoice: true,
        }
      });

      if (aiError) throw aiError;

      const aiMessage = aiResponse.message;
      const aiAudioBase64 = aiResponse.audio;

      // Upload AI audio if provided
      let aiAudioUrl = null;
      if (aiAudioBase64) {
        const binaryString = atob(aiAudioBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const aiAudioBlob = new Blob([bytes], { type: 'audio/mpeg' });
        
        const aiFileName = `${user.id}/ai_${Date.now()}.mp3`;
        const { data: aiUploadData, error: aiUploadError } = await supabase.storage
          .from('voice-messages')
          .upload(aiFileName, aiAudioBlob);

        if (!aiUploadError && aiUploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('voice-messages')
            .getPublicUrl(aiUploadData.path);
          aiAudioUrl = publicUrl;
        }
      }

      const { data: aiMsg } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          role: 'assistant' as const,
          content: aiMessage,
          emotional_mode: emotionalMode as any,
          audio_url: aiAudioUrl,
        }])
        .select()
        .single();

      if (aiMsg) {
        setMessages((prev) => [...prev, aiMsg as Message]);
      }
    } catch (error) {
      console.error('AI Error:', error);
      toast({
        title: "Connection Issue",
        description: "I'm having trouble responding right now. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
      setLoading(false);
    }
  };

  const handleVoiceRecording = async (audioBlob: Blob, base64Audio: string) => {
    setIsProcessingVoice(true);
    try {
      const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('voice-to-text', {
        body: { audio: base64Audio }
      });

      if (transcriptionError) throw transcriptionError;

      const transcribedText = transcriptionData.text;
      
      toast({
        title: "Voice message received",
        description: `"${transcribedText.substring(0, 50)}..."`,
      });

      await sendMessage(transcribedText, audioBlob);
    } catch (error: any) {
      toast({
        title: "Error processing voice",
        description: error.message,
        variant: "destructive",
      });
      console.error('Error processing voice:', error);
    } finally {
      setIsProcessingVoice(false);
    }
  };

  const sendGift = async (giftId: string) => {
    if (!user || !conversationId) return;

    try {
      setLoading(true);

      // DEV MODE: Skip credit checks
      // if (freeMessages <= 0) {
      //   onCreditsExhausted();
      //   return;
      // }

      // Get gift details
      const { data: gift } = await supabase
        .from('gift_types')
        .select('*')
        .eq('id', giftId)
        .single();

      if (!gift) throw new Error('Gift not found');

      // Record gift sent
      await supabase
        .from('gifts_sent')
        .insert([{
          sender_id: user.id,
          conversation_id: conversationId,
          gift_type_id: giftId,
        }]);

      // Create message for the gift
      const { data: giftMessage } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          role: 'user' as const,
          content: `Sent a ${gift.name}`,
          gift_id: giftId,
        }])
        .select()
        .single();

      if (giftMessage) {
        setMessages((prev) => [...prev, giftMessage as Message]);
      }

      // Update credits
      const { data: credits } = await supabase
        .from('message_credits')
        .select('*')
        .eq('user_id', user.id)
        .single();

      await supabase
        .from('message_credits')
        .update({
          free_messages_remaining: freeMessages - gift.cost_credits,
          total_messages_sent: (credits?.total_messages_sent || 0) + 1,
        })
        .eq('user_id', user.id);

      setFreeMessages(prev => prev - gift.cost_credits);

      // Get AI response to gift
      setIsTyping(true);
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('chat', {
        body: {
          messages: [{ role: 'user', content: `I sent you a ${gift.name} ${gift.icon}` }],
          emotionalMode,
          requestVoice: true,
        }
      });

      if (aiError) throw aiError;

      const aiMessage = aiResponse.message;
      const aiAudioBase64 = aiResponse.audio;

      // Upload AI audio if provided
      let aiAudioUrl = null;
      if (aiAudioBase64) {
        const binaryString = atob(aiAudioBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const aiAudioBlob = new Blob([bytes], { type: 'audio/mpeg' });
        
        const aiFileName = `${user.id}/ai_${Date.now()}.mp3`;
        const { data: aiUploadData, error: aiUploadError } = await supabase.storage
          .from('voice-messages')
          .upload(aiFileName, aiAudioBlob);

        if (!aiUploadError && aiUploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('voice-messages')
            .getPublicUrl(aiUploadData.path);
          aiAudioUrl = publicUrl;
        }
      }

      const { data: aiMsg } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          role: 'assistant' as const,
          content: aiMessage,
          emotional_mode: emotionalMode as any,
          audio_url: aiAudioUrl,
        }])
        .select()
        .single();

      if (aiMsg) {
        setMessages((prev) => [...prev, aiMsg as Message]);
      }

      setIsTyping(false);
    } catch (error: any) {
      toast({
        title: "Error sending gift",
        description: error.message,
        variant: "destructive",
      });
      console.error('Error sending gift:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {loadingPartner ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="border-b border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Your AI Partner</h2>
                <p className="text-sm text-muted-foreground">
                  Development Mode - Unlimited Messages
                </p>
              </div>
              <div className="flex items-center gap-2">
                <EmotionalModeSelector value={emotionalMode} onChange={setEmotionalMode} />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/settings')}
                  className="rounded-full"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border bg-card p-4">
            <div className="flex gap-2">
              <VoiceRecordButton 
                onRecordingComplete={handleVoiceRecording}
                disabled={loading || isProcessingVoice}
              />
              <GiftSelector 
                onSendGift={sendGift}
                disabled={loading || isProcessingVoice}
              />
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                disabled={loading || isProcessingVoice}
                className="flex-1 rounded-2xl"
              />
              <Button
                onClick={() => sendMessage()}
                disabled={loading || isProcessingVoice || !input.trim()}
                className="bg-gradient-primary text-white rounded-2xl px-6"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
