import { motion } from 'framer-motion';

const orbs = [
  { size: 300, color: 'rgba(155, 77, 202, 0.3)', top: '10%', left: '10%', duration: 8 },
  { size: 400, color: 'rgba(255, 90, 60, 0.2)', top: '50%', right: '5%', duration: 10 },
  { size: 250, color: 'rgba(255, 178, 195, 0.25)', bottom: '10%', left: '20%', duration: 7 },
  { size: 200, color: 'rgba(107, 44, 145, 0.3)', top: '30%', left: '60%', duration: 9 },
  { size: 350, color: 'rgba(255, 139, 123, 0.2)', bottom: '30%', right: '15%', duration: 11 },
];

export function GlowingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            bottom: orb.bottom,
            filter: 'blur(40px)',
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}
