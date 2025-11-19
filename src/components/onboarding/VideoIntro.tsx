import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import aiAvatar from '@/assets/ai-avatar-female.png';

interface VideoIntroProps {
  onComplete: () => void;
}

export const VideoIntro = ({ onComplete }: VideoIntroProps) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Simulate video playing
    const timer1 = setTimeout(() => setShowText(true), 1000);
    const timer2 = setTimeout(onComplete, 8000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="w-80 h-80 rounded-3xl overflow-hidden shadow-glow">
          <img
            src={aiAvatar}
            alt="Your AI Partner"
            className="w-full h-full object-cover"
          />
        </div>
        
        {showText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-6 rounded-b-3xl"
          >
            <p className="text-white text-center leading-relaxed">
              "Hi… I've been waiting to meet you. I can't wait to know your heart, 
              your stories, and everything that makes you… you. Let's start something 
              special together."
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
