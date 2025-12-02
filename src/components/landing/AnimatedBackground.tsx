import { motion } from 'framer-motion';

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a1e] via-[#2d1f3d] to-[#0f0a1a]" />
      
      {/* Aurora layer 1 - Primary warm tones */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(255,90,60,0.3) 0%, transparent 50%)',
            'radial-gradient(ellipse 80% 50% at 80% 60%, rgba(255,90,60,0.3) 0%, transparent 50%)',
            'radial-gradient(ellipse 80% 50% at 40% 80%, rgba(255,90,60,0.3) 0%, transparent 50%)',
            'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(255,90,60,0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Aurora layer 2 - Secondary pink tones */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(ellipse 60% 40% at 70% 30%, rgba(255,139,123,0.25) 0%, transparent 50%)',
            'radial-gradient(ellipse 60% 40% at 30% 70%, rgba(255,139,123,0.25) 0%, transparent 50%)',
            'radial-gradient(ellipse 60% 40% at 60% 50%, rgba(255,139,123,0.25) 0%, transparent 50%)',
            'radial-gradient(ellipse 60% 40% at 70% 30%, rgba(255,139,123,0.25) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Aurora layer 3 - Purple accent */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(155,77,202,0.2) 0%, transparent 50%)',
            'radial-gradient(ellipse 70% 60% at 20% 30%, rgba(155,77,202,0.2) 0%, transparent 50%)',
            'radial-gradient(ellipse 70% 60% at 80% 70%, rgba(155,77,202,0.2) 0%, transparent 50%)',
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(155,77,202,0.2) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
      />

      {/* Floating light orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,90,60,0.4) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          x: ['-10%', '60%', '30%', '-10%'],
          y: ['20%', '50%', '10%', '20%'],
          scale: [1, 1.3, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute w-80 h-80 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,178,195,0.35) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{
          x: ['80%', '20%', '50%', '80%'],
          y: ['60%', '20%', '70%', '60%'],
          scale: [1.2, 0.8, 1.1, 1.2],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
      />

      <motion.div
        className="absolute w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(155,77,202,0.3) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          x: ['40%', '70%', '10%', '40%'],
          y: ['10%', '60%', '40%', '10%'],
          scale: [0.9, 1.2, 1, 0.9],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 6,
        }}
      />

      {/* Shooting star effects */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-[2px]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
            top: `${20 + i * 25}%`,
            left: '-10%',
            rotate: '-15deg',
          }}
          animate={{
            x: ['0%', '150vw'],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 8 + 2,
            ease: 'easeOut',
            repeatDelay: 10,
          }}
        />
      ))}

      {/* Twinkling stars */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute w-1 h-1 rounded-full bg-white/60"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Gradient mesh overlay for depth */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(at 40% 20%, rgba(255,90,60,0.15) 0px, transparent 50%),
            radial-gradient(at 80% 0%, rgba(255,139,123,0.1) 0px, transparent 50%),
            radial-gradient(at 0% 50%, rgba(155,77,202,0.1) 0px, transparent 50%),
            radial-gradient(at 80% 50%, rgba(255,90,60,0.1) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(255,178,195,0.15) 0px, transparent 50%),
            radial-gradient(at 80% 100%, rgba(155,77,202,0.1) 0px, transparent 50%)
          `,
        }}
      />

      {/* Subtle noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </div>
  );
}
