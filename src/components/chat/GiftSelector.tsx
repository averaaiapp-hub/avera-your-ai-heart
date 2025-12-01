import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface GiftType {
  id: string;
  name: string;
  icon: string;
  cost_credits: number;
  description: string;
}

interface GiftSelectorProps {
  onSendGift: (giftId: string) => void;
  disabled?: boolean;
}

export const GiftSelector = ({ onSendGift, disabled }: GiftSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [gifts, setGifts] = useState<GiftType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGifts();
  }, []);

  const loadGifts = async () => {
    const { data, error } = await supabase
      .from('gift_types')
      .select('*')
      .order('cost_credits', { ascending: true });

    if (error) {
      console.error('Error loading gifts:', error);
      return;
    }

    setGifts(data || []);
  };

  const handleSendGift = async (giftId: string) => {
    setLoading(true);
    try {
      await onSendGift(giftId);
      setIsOpen(false);
      toast.success('Gift sent! 🎁');
    } catch (error) {
      console.error('Error sending gift:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="hover:bg-muted"
      >
        <Gift className="w-5 h-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-full right-0 mb-2 bg-card border border-border rounded-2xl shadow-xl p-4 z-50 w-80"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Send a Gift</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {gifts.map((gift) => (
                  <motion.button
                    key={gift.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSendGift(gift.id)}
                    disabled={loading}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50"
                  >
                    <span className="text-4xl">{gift.icon}</span>
                    <span className="text-xs font-medium text-foreground">{gift.name}</span>
                    <span className="text-xs text-muted-foreground">{gift.cost_credits} credits</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
