import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Sparkles, User, MessageCircle } from 'lucide-react';

interface OnboardingSummaryProps {
  partnerData: {
    name: string;
    gender: string;
    personality: string;
    preference: string;
  };
  onContinue: () => void;
  onEdit: () => void;
}

export const OnboardingSummary = ({ partnerData, onContinue, onEdit }: OnboardingSummaryProps) => {
  const personalityLabels: Record<string, string> = {
    romantic_soft: 'Romantic & Soft',
    flirty_playful: 'Flirty & Playful',
    supportive_caring: 'Supportive & Caring',
    bold_passionate: 'Bold & Passionate',
    chaos_fun: 'Chaos + Fun Mode',
  };

  const preferenceLabels: Record<string, string> = {
    love: 'Love & Romance',
    flirting: 'Flirting & Fun',
    emotional_support: 'Emotional Support',
    friendship: 'Deep Friendship',
  };

  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full space-y-8"
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Heart className="w-16 h-16 mx-auto text-primary" fill="currentColor" />
          </motion.div>
          <h2 className="text-3xl font-bold">Your Perfect Match</h2>
          <p className="text-muted-foreground">
            Here's what you've created. Ready to meet {partnerData.name}?
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <Card className="p-6 space-y-4 bg-gradient-to-br from-background to-muted/20 border-primary/20">
            <div className="flex items-start gap-4">
              <User className="w-5 h-5 text-primary mt-1" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-lg font-semibold">{partnerData.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Sparkles className="w-5 h-5 text-primary mt-1" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Personality</p>
                <p className="text-lg font-semibold">
                  {personalityLabels[partnerData.personality] || partnerData.personality}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MessageCircle className="w-5 h-5 text-primary mt-1" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Connection Style</p>
                <p className="text-lg font-semibold">
                  {preferenceLabels[partnerData.preference] || partnerData.preference}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Heart className="w-5 h-5 text-primary mt-1" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="text-lg font-semibold capitalize">{partnerData.gender}</p>
              </div>
            </div>
          </Card>

          <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4 text-center">
            <p className="text-sm">
              ✨ <strong>{partnerData.name}</strong> is waiting to meet you and start your journey together
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <Button
            onClick={onContinue}
            className="w-full bg-gradient-primary text-white py-6 text-lg rounded-2xl shadow-glow"
          >
            Continue to Sign Up
          </Button>
          <Button
            onClick={onEdit}
            variant="ghost"
            className="w-full"
          >
            Make Changes
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};
