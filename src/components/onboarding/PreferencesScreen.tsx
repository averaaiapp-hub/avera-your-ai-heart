import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Users, Smile } from 'lucide-react';
import onboardingPreferences from '@/assets/onboarding-preferences.png';

interface PreferencesScreenProps {
  onNext: (preference: string) => void;
}

const preferences = [
  { value: 'love', label: 'Love & Romance', icon: Heart },
  { value: 'flirting', label: 'Flirting & Fun', icon: Smile },
  { value: 'emotional_support', label: 'Emotional Support', icon: MessageCircle },
  { value: 'friendship', label: 'Deep Friendship', icon: Users },
];

export const PreferencesScreen = ({ onNext }: PreferencesScreenProps) => {
  const [selected, setSelected] = useState('');

  const handleSubmit = () => {
    if (selected) {
      onNext(selected);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:p-6 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 overflow-y-auto">
      {/* Character image - visible on all screens */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative flex-shrink-0"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl rounded-full scale-110" />
        <img
          src={onboardingPreferences}
          alt="AI companion caring"
          className="relative w-32 h-40 sm:w-48 sm:h-60 lg:w-64 lg:h-80 object-cover rounded-2xl sm:rounded-3xl shadow-xl"
        />
        <motion.div
          className="absolute -bottom-2 -right-2 text-xl sm:text-2xl"
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          💝
        </motion.div>
      </motion.div>

      {/* Preferences form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full space-y-5 sm:space-y-8"
      >
        <div className="text-center space-y-2 sm:space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold">What Do You Seek?</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Help us understand what you are looking for in this connection
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {preferences.map((pref) => {
            const Icon = pref.icon;
            return (
              <Card
                key={pref.value}
                className={`p-4 sm:p-8 cursor-pointer transition-smooth active:scale-95 ${
                  selected === pref.value
                    ? 'border-primary border-2 shadow-glow'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setSelected(pref.value)}
              >
                <div className="flex flex-col items-center gap-2 sm:gap-4 text-center">
                  <Icon className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
                  <p className="font-semibold text-sm sm:text-lg">{pref.label}</p>
                </div>
              </Card>
            );
          })}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!selected}
          className="w-full bg-gradient-primary text-white py-5 sm:py-6 text-base sm:text-lg rounded-2xl shadow-glow active:scale-98"
        >
          Continue
        </Button>
      </motion.div>
    </div>
  );
};
