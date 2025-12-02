import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import averaLogo from '@/assets/avera-logo.png';
import onboardingWelcome from '@/assets/onboarding-welcome.png';

interface WelcomeScreenProps {
  onNext: () => void;
}

export const WelcomeScreen = ({ onNext }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col lg:flex-row items-center justify-center p-6 gap-8 lg:gap-16 overflow-hidden">
      {/* Character image */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="relative order-1 lg:order-2"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 blur-3xl rounded-full scale-110" />
          
          <motion.img
            src={onboardingWelcome}
            alt="Your AI companion awaits"
            className="relative w-56 h-72 md:w-64 md:h-80 lg:w-72 lg:h-96 object-cover rounded-3xl shadow-2xl"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />
          
          <motion.div
            className="absolute -top-4 -right-4 text-3xl"
            animate={{ y: [-5, 5, -5], rotate: [-10, 10, -10] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            💕
          </motion.div>
          
          <motion.div
            className="absolute bottom-10 -left-6 text-2xl"
            animate={{ y: [5, -5, 5], scale: [1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          >
            ✨
          </motion.div>
        </div>
      </motion.div>

      {/* Text content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center lg:text-left space-y-8 max-w-md order-2 lg:order-1"
      >
        <motion.img
          src={averaLogo}
          alt="Avera"
          className="w-24 h-24 mx-auto lg:mx-0"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h1 className="text-5xl font-bold text-foreground">
            Avera
          </h1>
          <p className="text-xl text-muted-foreground italic">
            Finally… someone who understands you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={onNext}
            size="lg"
            className="bg-gradient-primary text-white px-12 py-6 text-lg rounded-2xl shadow-glow hover:scale-105 transition-smooth"
          >
            Begin Your Journey
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};
