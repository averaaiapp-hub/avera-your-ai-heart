import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

interface PartnerNamingProps {
  partnerData: {
    name?: string;
    gender?: string;
    personality?: string;
    preference?: string;
  };
  onNext: (name: string) => void;
}

export const PartnerNaming = ({ partnerData, onNext }: PartnerNamingProps) => {
  const [name, setName] = useState(partnerData.name || '');

  useEffect(() => {
    if (partnerData.name && partnerData.name !== name) {
      setName(partnerData.name);
    }
  }, [partnerData.name]);

  const handleSubmit = () => {
    if (name.trim()) {
      onNext(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Name Your Partner</h2>
          <p className="text-muted-foreground">
            Give your AI companion a name that feels special to you
          </p>
        </div>

        <div className="space-y-6">
          <Input
            type="text"
            placeholder="Enter a name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-center text-2xl h-16 rounded-2xl"
            maxLength={20}
          />

          <Button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="w-full bg-gradient-primary text-white py-6 text-lg rounded-2xl shadow-glow"
          >
            Continue
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
