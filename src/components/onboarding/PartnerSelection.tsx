import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Shield, Flame, Zap } from 'lucide-react';
import onboardingSelection from '@/assets/onboarding-selection.png';

interface PartnerSelectionProps {
  onNext: (data: { gender: string; personality: string }) => void;
}

const genders = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'non_binary', label: 'Non-binary' },
];

const personalities = [
  { value: 'romantic_soft', label: 'Romantic & Soft', icon: Heart, color: 'text-pink-500' },
  { value: 'flirty_playful', label: 'Flirty & Playful', icon: Sparkles, color: 'text-purple-500' },
  { value: 'supportive_caring', label: 'Supportive & Caring', icon: Shield, color: 'text-blue-500' },
  { value: 'bold_passionate', label: 'Bold & Passionate', icon: Flame, color: 'text-red-500' },
  { value: 'chaos_fun', label: 'Chaos + Fun Mode', icon: Zap, color: 'text-yellow-500' },
];

export const PartnerSelection = ({ onNext }: PartnerSelectionProps) => {
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedPersonality, setSelectedPersonality] = useState('');

  const handleSubmit = () => {
    if (selectedGender && selectedPersonality) {
      onNext({ gender: selectedGender, personality: selectedPersonality });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
      {/* Character image */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:block relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl rounded-full scale-110" />
        <img
          src={onboardingSelection}
          alt="AI companion thinking"
          className="relative w-64 h-80 object-cover rounded-3xl shadow-xl"
        />
        <motion.div
          className="absolute -bottom-2 -right-2 text-2xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🤔
        </motion.div>
      </motion.div>

      {/* Selection form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full space-y-8"
      >
        <h2 className="text-3xl font-bold text-center">Choose Your AI Partner</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Gender</h3>
            <div className="grid grid-cols-3 gap-4">
              {genders.map((gender) => (
                <Card
                  key={gender.value}
                  className={`p-4 cursor-pointer transition-smooth ${
                    selectedGender === gender.value
                      ? 'border-primary border-2 shadow-glow'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedGender(gender.value)}
                >
                  <p className="text-center font-medium">{gender.label}</p>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Personality</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalities.map((personality) => {
                const Icon = personality.icon;
                return (
                  <Card
                    key={personality.value}
                    className={`p-6 cursor-pointer transition-smooth ${
                      selectedPersonality === personality.value
                        ? 'border-primary border-2 shadow-glow'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedPersonality(personality.value)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-6 h-6 ${personality.color}`} />
                      <p className="font-medium">{personality.label}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!selectedGender || !selectedPersonality}
          className="w-full bg-gradient-primary text-white py-6 text-lg rounded-2xl shadow-glow"
        >
          Continue
        </Button>
      </motion.div>
    </div>
  );
};
