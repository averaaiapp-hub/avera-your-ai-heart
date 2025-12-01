import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, MessageCircle, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface OnboardingChatAssistantProps {
  currentStep: 'welcome' | 'video' | 'selection' | 'naming' | 'preferences';
  partnerData: {
    name?: string;
    gender?: string;
    personality?: string;
    preference?: string;
  };
}

export const OnboardingChatAssistant = ({ currentStep, partnerData }: OnboardingChatAssistantProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Send welcome message when step changes
    if (isOpen && messages.length === 0) {
      sendInitialMessage();
    }
  }, [currentStep, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendInitialMessage = async () => {
    setIsTyping(true);
    try {
      const { data, error } = await supabase.functions.invoke('onboarding-chat', {
        body: {
          messages: [{ role: 'user', content: 'Hi!' }],
          currentStep,
          partnerData,
        }
      });

      if (error) throw error;

      setMessages([{
        role: 'assistant',
        content: data.message,
      }]);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Connection issue",
        description: "Unable to reach the guide. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const sendMessage = async () => {
    const messageText = input.trim();
    if (!messageText || loading) return;

    setInput('');
    setLoading(true);

    const userMessage: Message = { role: 'user', content: messageText };
    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke('onboarding-chat', {
        body: {
          messages: [...messages, userMessage],
          currentStep,
          partnerData,
        }
      });

      if (error) throw error;

      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: data.message,
      }]);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Connection issue",
        description: "Unable to reach the guide. Please try again.",
        variant: "destructive",
      });
      // Remove the user message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsTyping(false);
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full bg-gradient-primary text-white shadow-elegant hover:shadow-glow transition-all"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </Button>
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-card border border-border rounded-2xl shadow-elegant z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-primary text-white p-4 rounded-t-2xl">
              <h3 className="font-semibold">Your Onboarding Guide ✨</h3>
              <p className="text-sm opacity-90">I'm here to help you get started!</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
              {messages.map((message, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-muted rounded-2xl px-4 py-2">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border bg-card p-4">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask me anything..."
                  disabled={loading}
                  className="flex-1 rounded-full bg-background"
                />
                <Button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="bg-gradient-primary text-white rounded-full px-4"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};