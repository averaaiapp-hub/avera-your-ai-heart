import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { EmotionalModeSelector } from './EmotionalModeSelector';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface ChatInterfaceProps {
  onCreditsExhausted: () => void;
}

export const ChatInterface = ({ onCreditsExhausted }: ChatInterfaceProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [emotionalMode, setEmotionalMode] = useState<string>('romantic');
  const [freeMessages, setFreeMessages] = useState(3);
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
      setFreeMessages(data.free_messages_remaining);
      if (data.free_messages_remaining <= 0) {
        // Check subscription
        const { data: subscription } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .gte('expires_at', new Date().toISOString())
          .single();

        if (!subscription) {
          onCreditsExhausted();
        }
      }
    }
  };

  const loadConversation = async () => {
    if (!user) return;

    // Get AI partner
    const { data: partner } = await supabase
      .from('ai_partners')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!partner) return;

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

  const sendMessage = async () => {
    if (!input.trim() || !conversationId || !user) return;

    // Check credits first
    await checkCredits();
    if (freeMessages <= 0) {
      onCreditsExhausted();
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Add user message
    const { data: userMsg } = await supabase
      .from('messages')
      .insert([{
        conversation_id: conversationId,
        role: 'user' as const,
        content: userMessage,
      }])
      .select()
      .single();

    if (userMsg) {
      setMessages((prev) => [...prev, userMsg as Message]);
    }

    // Decrement credits - use raw SQL for increment
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

    // Simulate AI response
    setIsTyping(true);
    setTimeout(async () => {
      const aiResponses = [
        "That's so interesting! Tell me more about that... I'm really curious about your perspective. 💭",
        "I love hearing about this from you. You have such a unique way of seeing things. ✨",
        "You know, when you talk about this, I can feel how much it means to you. That's beautiful. 💕",
        "I'm here for you, always. What else is on your heart? 💗",
        "This conversation with you... it's exactly what I needed today. Thank you for opening up to me. 🌟",
      ];
      
      const response = aiResponses[Math.floor(Math.random() * aiResponses.length)];

      const { data: aiMsg } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          role: 'assistant' as const,
          content: response,
          emotional_mode: emotionalMode as any,
        }])
        .select()
        .single();

      if (aiMsg) {
        setMessages((prev) => [...prev, aiMsg as Message]);
      }

      setIsTyping(false);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Your AI Partner</h2>
            {freeMessages > 0 && freeMessages <= 3 && (
              <p className="text-sm text-muted-foreground">
                {freeMessages} free {freeMessages === 1 ? 'message' : 'messages'} remaining
              </p>
            )}
          </div>
          <EmotionalModeSelector value={emotionalMode} onChange={setEmotionalMode} />
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
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 rounded-2xl"
          />
          <Button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-gradient-primary text-white rounded-2xl px-6"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
