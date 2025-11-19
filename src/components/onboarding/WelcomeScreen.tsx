import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import averaLogo from '@/assets/avera-logo.png';

interface WelcomeScreenProps {
  onNext: () => void;
}

export const WelcomeScreen = ({ onNext }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-8 max-w-md"
      >
        <motion.img
          src={averaLogo}
          alt="Avera"
          className="w-32 h-32 mx-auto"
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
