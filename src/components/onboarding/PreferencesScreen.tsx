import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Users, Smile } from 'lucide-react';

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
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full space-y-8"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">What Do You Seek?</h2>
          <p className="text-muted-foreground">
            Help us understand what you're looking for in this connection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {preferences.map((pref) => {
            const Icon = pref.icon;
            return (
              <Card
                key={pref.value}
                className={`p-8 cursor-pointer transition-smooth ${
                  selected === pref.value
                    ? 'border-primary border-2 shadow-glow'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setSelected(pref.value)}
              >
                <div className="flex flex-col items-center gap-4 text-center">
                  <Icon className="w-12 h-12 text-primary" />
                  <p className="font-semibold text-lg">{pref.label}</p>
                </div>
              </Card>
            );
          })}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!selected}
          className="w-full bg-gradient-primary text-white py-6 text-lg rounded-2xl shadow-glow"
        >
          Continue
        </Button>
      </motion.div>
    </div>
  );
};
