import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GiftMessageProps {
  giftId: string;
}

export const GiftMessage = ({ giftId }: GiftMessageProps) => {
  const [gift, setGift] = useState<{ icon: string; name: string } | null>(null);

  useEffect(() => {
    loadGift();
  }, [giftId]);

  const loadGift = async () => {
    const { data, error } = await supabase
      .from('gift_types')
      .select('icon, name')
      .eq('id', giftId)
      .single();

    if (!error && data) {
      setGift(data);
    }
  };

  if (!gift) return null;

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', duration: 0.6 }}
      className="flex flex-col items-center gap-2 py-2"
    >
      <motion.span
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
        }}
        className="text-6xl"
      >
        {gift.icon}
      </motion.span>
      <span className="text-sm font-medium text-foreground">Sent a {gift.name}</span>
    </motion.div>
  );
};
