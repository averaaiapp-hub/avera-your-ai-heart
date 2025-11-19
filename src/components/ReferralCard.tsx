import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Users, Gift } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const ReferralCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferralData();
  }, [user]);

  const loadReferralData = async () => {
    if (!user) return;

    try {
      // Get referral code
      const { data: codeData } = await supabase
        .from('referral_codes')
        .select('code, uses')
        .eq('user_id', user.id)
        .single();

      if (codeData) {
        setReferralCode(codeData.code);
        setReferralCount(codeData.uses || 0);
      }
    } catch (error) {
      console.error('Error loading referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link Copied!",
      description: "Share this link to invite friends and earn free messages.",
    });
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Code Copied!",
      description: "Your referral code has been copied to clipboard.",
    });
  };

  if (loading) {
    return null;
  }

  return (
    <Card className="p-6 bg-gradient-subtle border-border/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Gift className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Invite Friends</h3>
          <p className="text-sm text-muted-foreground">Earn 2 free messages per invite</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={referralCode}
            readOnly
            className="font-mono text-center text-lg tracking-wider"
          />
          <Button onClick={copyReferralCode} variant="outline" size="icon">
            <Copy className="w-4 h-4" />
          </Button>
        </div>

        <Button onClick={copyReferralLink} className="w-full bg-gradient-primary text-white">
          <Users className="w-4 h-4 mr-2" />
          Share Referral Link
        </Button>

        <div className="text-center pt-2">
          <p className="text-sm text-muted-foreground">
            {referralCount} {referralCount === 1 ? 'friend' : 'friends'} joined
          </p>
        </div>
      </div>
    </Card>
  );
};