import { motion } from 'framer-motion';

export const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-gradient-primary text-white rounded-2xl px-4 py-3 shadow-soft">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-white rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
