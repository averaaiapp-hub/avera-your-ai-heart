import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, MessageCircle, X, Sparkles, PartyPopper } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceRecordButton } from '@/components/chat/VoiceRecordButton';
import { blobToBase64 } from '@/utils/audioRecorder';
import { Progress } from '@/components/ui/progress';

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
  onNameSuggestion?: (name: string) => void;
}

export const OnboardingChatAssistant = ({ currentStep, partnerData, onNameSuggestion }: OnboardingChatAssistantProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [nameSuggestions, setNameSuggestions] = useState<string[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [prevStep, setPrevStep] = useState(currentStep);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('onboarding_chat_messages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Failed to load chat history:', e);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('onboarding_chat_messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Detect step changes and celebrate progress
  useEffect(() => {
    if (prevStep !== currentStep && prevStep !== currentStep) {
      setPrevStep(currentStep);
      if (messages.length > 0) {
        // Add a system message about progress
        const stepMessage: Message = {
          role: 'assistant',
          content: `✨ Great progress! You're now on "${stepLabels[currentStep]}". Let me know if you need any help!`
        };
        setMessages(prev => [...prev, stepMessage]);
        
        // Trigger celebration
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 3000);
      }
    }
  }, [currentStep]);

  const stepLabels = {
    welcome: 'Getting Started',
    video: 'Introduction',
    selection: 'Choose Your Partner',
    naming: 'Name Your Partner',
    preferences: 'Set Preferences',
  };

  const stepNumbers = {
    welcome: 1,
    video: 2,
    selection: 3,
    naming: 4,
    preferences: 5,
  };

  const currentStepNumber = stepNumbers[currentStep];
  const totalSteps = 5;
  const progressPercentage = (currentStepNumber / totalSteps) * 100;

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
          stepNumber: currentStepNumber,
          totalSteps,
        }
      });

      if (error) throw error;

      setMessages([{
        role: 'assistant',
        content: data.message,
      }]);

      if (data.nameSuggestions && Array.isArray(data.nameSuggestions)) {
        setNameSuggestions(data.nameSuggestions);
      }
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

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || loading) return;

    setInput('');
    setLoading(true);

    const userMessage: Message = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke('onboarding-chat', {
        body: {
          messages: [...messages, userMessage],
          currentStep,
          partnerData,
          stepNumber: currentStepNumber,
          totalSteps,
        }
      });

      if (error) throw error;

      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: data.message,
      }]);

      if (data.nameSuggestions && Array.isArray(data.nameSuggestions)) {
        setNameSuggestions(data.nameSuggestions);
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Connection issue",
        description: "Unable to reach the guide. Please try again.",
        variant: "destructive",
      });
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsTyping(false);
      setLoading(false);
    }
  };

  const handleVoiceRecording = async (audioBlob: Blob, base64Audio: string) => {
    setIsTranscribing(true);
    try {
      const { data, error } = await supabase.functions.invoke('voice-to-text', {
        body: { audio: base64Audio }
      });

      if (error) throw error;

      if (data.text) {
        await sendMessage(data.text);
      }
    } catch (error: any) {
      console.error('Transcription error:', error);
      toast({
        title: "Transcription failed",
        description: "Could not convert voice to text",
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <>
      {/* Celebration Confetti */}
      <AnimatePresence>
        {celebrate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 0,
                  rotate: 0 
                }}
                animate={{ 
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 400,
                  scale: [0, 1, 0],
                  rotate: Math.random() * 360
                }}
                transition={{ 
                  duration: 2,
                  delay: Math.random() * 0.3,
                  ease: "easeOut"
                }}
                className="absolute"
              >
                <PartyPopper 
                  className="w-6 h-6" 
                  style={{ 
                    color: ['#FF5A3C', '#FF8B7B', '#FFB2C3', '#FFD700'][Math.floor(Math.random() * 4)]
                  }} 
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full bg-gradient-primary text-white shadow-elegant hover:shadow-glow transition-all relative"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          {celebrate && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: 3, duration: 0.5 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full"
            />
          )}
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
            <div className="bg-gradient-primary text-white p-4 rounded-t-2xl space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Your Onboarding Guide ✨</h3>
                <span className="text-xs opacity-80">Step {currentStepNumber}/{totalSteps}</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs opacity-90">{stepLabels[currentStep]}</p>
                <Progress value={progressPercentage} className="h-1 bg-white/20" />
              </div>
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
              
              {/* Name Suggestions */}
              {nameSuggestions.length > 0 && currentStep === 'naming' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 text-xs text-muted-foreground px-2">
                    <Sparkles className="w-3 h-3" />
                    <span>Suggested names based on your preferences:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {nameSuggestions.map((name, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onNameSuggestion?.(name);
                          toast({
                            title: "Name selected",
                            description: `"${name}" sounds perfect! 💫`,
                          });
                        }}
                        className="rounded-full text-xs"
                      >
                        {name}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border bg-card p-4">
              <div className="flex gap-2">
                <VoiceRecordButton
                  onRecordingComplete={handleVoiceRecording}
                  disabled={loading || isTranscribing}
                />
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
                  placeholder={isTranscribing ? "Transcribing..." : "Ask me anything..."}
                  disabled={loading || isTranscribing}
                  className="flex-1 rounded-full bg-background"
                />
                <Button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim() || isTranscribing}
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