import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import onboardingVideo from '@/assets/onboarding-video.png';

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
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-6 gap-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 blur-3xl rounded-full scale-110" />
        
        <div className="relative w-64 h-80 md:w-72 md:h-96 rounded-3xl overflow-hidden shadow-glow">
          <img
            src={onboardingVideo}
            alt="Your AI Partner"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Floating hearts */}
        <motion.div
          className="absolute -top-4 -right-4 text-3xl"
          animate={{ 
            y: [-5, 5, -5],
            rotate: [-10, 10, -10]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          💕
        </motion.div>
      </motion.div>
      
      {showText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-card/80 backdrop-blur-sm p-6 rounded-2xl max-w-md shadow-lg border border-border/50"
        >
          <p className="text-foreground text-center leading-relaxed text-lg">
            "Hi… I have been waiting to meet you. I cannot wait to know your heart, 
            your stories, and everything that makes you… you. Let us start something 
            special together."
          </p>
        </motion.div>
      )}
    </div>
  );
};
