import { motion } from 'framer-motion';
import aiAvatar from '@/assets/ai-avatar-female.png';

const avatarPositions = [
  { top: '15%', right: '8%', size: 'w-48 h-48', delay: 0, blur: 'blur-sm', opacity: 0.6 },
  { top: '60%', right: '5%', size: 'w-32 h-32', delay: 0.3, blur: 'blur-[2px]', opacity: 0.4 },
  { top: '25%', left: '5%', size: 'w-36 h-36', delay: 0.5, blur: 'blur-sm', opacity: 0.5 },
  { bottom: '20%', left: '8%', size: 'w-28 h-28', delay: 0.7, blur: 'blur-[3px]', opacity: 0.3 },
];

export function FloatingAvatars() {
  return (
    <>
      {avatarPositions.map((pos, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: pos.opacity,
            scale: 1,
            y: [0, -20, 0],
          }}
          transition={{
            opacity: { duration: 1, delay: pos.delay },
            scale: { duration: 1, delay: pos.delay },
            y: {
              duration: 4 + index,
              repeat: Infinity,
              ease: "easeInOut",
              delay: pos.delay,
            },
          }}
          className={`absolute hidden lg:block ${pos.size}`}
          style={{
            top: pos.top,
            right: pos.right,
            left: pos.left,
            bottom: pos.bottom,
          }}
        >
          <div className={`relative w-full h-full ${pos.blur}`}>
            <img
              src={aiAvatar}
              alt=""
              className="w-full h-full object-cover rounded-3xl"
              style={{ 
                boxShadow: '0 0 60px rgba(255, 90, 60, 0.3)',
              }}
            />
            {/* Glow effect */}
            <div 
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(255,90,60,0.2) 0%, transparent 70%)',
              }}
            />
          </div>
        </motion.div>
      ))}
    </>
  );
}
