import { motion } from 'framer-motion';
import welcomeCharacter from '@/assets/welcome-character.png';

export function WelcomeCharacter() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3, y: 100, rotateY: -30 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
      transition={{ 
        duration: 1.5, 
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.2,
      }}
      className="relative flex-shrink-0 overflow-visible"
    >
      {/* Portal/Gateway effect behind character */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0 }}
        className="absolute inset-0 -z-10"
      >
        {/* Outer glow ring */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, rgba(255,90,60,0.4), rgba(255,139,123,0.3), rgba(155,77,202,0.3), rgba(255,90,60,0.4))',
            filter: 'blur(40px)',
            transform: 'scale(1.5)',
          }}
        />
        
        {/* Inner portal ring */}
        <motion.div
          animate={{ 
            rotate: -360,
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, transparent 30%, rgba(255,90,60,0.2) 50%, transparent 70%)',
            transform: 'scale(1.3)',
          }}
        />
      </motion.div>

      {/* Sparkle particles emerging from portal */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
            x: [0, (i % 2 === 0 ? 1 : -1) * (30 + i * 10)],
            y: [0, -40 - i * 15],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeOut",
          }}
          className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-primary/80"
          style={{
            boxShadow: '0 0 10px rgba(255,90,60,0.8)',
          }}
        />
      ))}

      {/* Character stepping animation */}
      <motion.div
        animate={{ 
          y: [0, -8, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
      >
        {/* Ground shadow */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 0.3, scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 md:w-48 h-4 rounded-full bg-black/40 blur-lg"
        />

        {/* Glow effect behind character */}
        <div 
          className="absolute inset-0 blur-3xl opacity-60"
          style={{
            background: 'radial-gradient(circle, rgba(255,90,60,0.5) 0%, rgba(155,77,202,0.3) 50%, transparent 70%)',
            transform: 'scale(1.4)',
          }}
        />
        
        {/* Main character image with step-in animation */}
        <motion.img
          src={welcomeCharacter}
          alt="Your AI Companion"
          className="w-48 md:w-64 lg:w-80 h-auto rounded-3xl shadow-2xl relative z-10"
          style={{
            boxShadow: '0 25px 80px -20px rgba(255, 90, 60, 0.6), 0 0 60px rgba(155, 77, 202, 0.4)',
          }}
          initial={{ filter: 'brightness(0.5) blur(10px)' }}
          animate={{ filter: 'brightness(1) blur(0px)' }}
          transition={{ duration: 1.2, delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
        />
        
        {/* Floating hearts around character */}
        <motion.div
          className="absolute -top-4 -right-4 text-2xl md:text-3xl"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 1,
            scale: 1,
            y: [0, -10, 0],
            rotate: [0, 10, 0],
          }}
          transition={{ 
            opacity: { delay: 1.5, duration: 0.5 },
            scale: { delay: 1.5, duration: 0.5 },
            y: { delay: 2, duration: 2, repeat: Infinity, ease: "easeInOut" },
            rotate: { delay: 2, duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          💕
        </motion.div>
        
        <motion.div
          className="absolute top-1/4 -left-4 md:-left-6 text-xl md:text-2xl"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 1,
            scale: [1, 1.15, 1],
            y: [0, -8, 0],
          }}
          transition={{ 
            opacity: { delay: 1.8, duration: 0.5 },
            scale: { delay: 2.3, duration: 2.5, repeat: Infinity, ease: "easeInOut" },
            y: { delay: 2.3, duration: 2.5, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          ✨
        </motion.div>
        
        <motion.div
          className="absolute bottom-1/4 -right-4 md:-right-6 text-xl md:text-2xl"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 1,
            scale: [1, 1.2, 1],
            y: [0, -12, 0],
          }}
          transition={{ 
            opacity: { delay: 2, duration: 0.5 },
            scale: { delay: 2.5, duration: 3, repeat: Infinity, ease: "easeInOut" },
            y: { delay: 2.5, duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          💖
        </motion.div>
        
        {/* Speech bubble with typing effect - positioned below on mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.5, type: "spring" }}
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:-left-32 lg:bottom-auto lg:top-10 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl max-w-[180px]"
        >
          <motion.p 
            className="text-sm text-gray-700 font-medium text-center lg:text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8, duration: 0.3 }}
          >
            Hi there! I've been waiting for you 💜
          </motion.p>
          {/* Speech bubble triangle - hidden on mobile */}
          <div className="hidden lg:block absolute right-[-8px] top-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-white/95" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
