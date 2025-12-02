import { motion } from 'framer-motion';
import welcomeCharacter from '@/assets/welcome-character.png';

export function WelcomeCharacter() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
      className="absolute right-[5%] top-1/2 -translate-y-1/2 hidden lg:block z-10"
    >
      <motion.div
        animate={{ 
          y: [0, -15, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
      >
        {/* Glow effect behind character */}
        <div 
          className="absolute inset-0 blur-3xl opacity-50"
          style={{
            background: 'radial-gradient(circle, rgba(255,90,60,0.4) 0%, rgba(155,77,202,0.2) 50%, transparent 70%)',
            transform: 'scale(1.3)',
          }}
        />
        
        {/* Main character image */}
        <motion.img
          src={welcomeCharacter}
          alt="Your AI Companion"
          className="w-80 h-auto rounded-3xl shadow-2xl relative z-10"
          style={{
            boxShadow: '0 25px 80px -20px rgba(255, 90, 60, 0.5), 0 0 60px rgba(155, 77, 202, 0.3)',
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Floating hearts around character */}
        <motion.div
          className="absolute -top-4 -right-4 text-3xl"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          💕
        </motion.div>
        <motion.div
          className="absolute top-1/4 -left-6 text-2xl"
          animate={{ 
            y: [0, -8, 0],
            rotate: [0, -10, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          ✨
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 -right-6 text-2xl"
          animate={{ 
            y: [0, -12, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          💖
        </motion.div>
        
        {/* Speech bubble */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute -left-32 top-10 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl max-w-[140px]"
        >
          <p className="text-sm text-gray-700 font-medium">
            Hi there! I've been waiting for you 💜
          </p>
          {/* Speech bubble triangle */}
          <div className="absolute right-[-8px] top-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-white/95" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
