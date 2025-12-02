import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { trackSignup } from '@/hooks/useCreatorTracking';
import { z } from 'zod';

interface SignUpScreenProps {
  onComplete: () => void;
  partnerData: {
    name: string;
    gender: string;
    personality: string;
    preference: string;
  };
}

export const SignUpScreen = ({ onComplete, partnerData }: SignUpScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const detectCountry = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return data.country_code || 'US';
    } catch {
      return 'US';
    }
  };

  const signupSchema = z.object({
    email: z.string().trim().email('Please enter a valid email address'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Za-z]/, 'Password must contain at least one letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
  });

  const handleSignUp = async () => {
    // Validate input with zod
    const result = signupSchema.safeParse({ email, password });
    if (!result.success) {
      toast({
        title: "Invalid Input",
        description: result.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const country = await detectCountry();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      if (data.user) {
        // Track signup for creator/referral
        await trackSignup(data.user.id);

        // Check for referral code
        const referralCode = localStorage.getItem('referral_code');
        if (referralCode) {
          try {
            // Record the referral
            const { data: referrerData } = await supabase
              .from('referral_codes')
              .select('user_id')
              .eq('code', referralCode)
              .single();

            if (referrerData) {
              await supabase.from('referrals').insert([{
                referrer_id: referrerData.user_id,
                referred_id: data.user.id,
                referral_code: referralCode,
              }]);

              // Update referral code uses
              const { data: codeData } = await supabase
                .from('referral_codes')
                .select('uses')
                .eq('code', referralCode)
                .single();

              await supabase
                .from('referral_codes')
                .update({ uses: (codeData?.uses || 0) + 1 })
                .eq('code', referralCode);

              // Give referrer bonus credits
              const { data: creditData } = await supabase
                .from('message_credits')
                .select('free_messages_remaining')
                .eq('user_id', referrerData.user_id)
                .single();

              await supabase
                .from('message_credits')
                .update({ free_messages_remaining: (creditData?.free_messages_remaining || 0) + 2 })
                .eq('user_id', referrerData.user_id);
            }
          } catch (refError) {
            console.error('Referral error:', refError);
          }
        }

        // Update profile with country
        await supabase
          .from('profiles')
          .update({ country })
          .eq('id', data.user.id);

        // Create AI partner
        const { error: partnerError } = await supabase.from('ai_partners').insert([{
          user_id: data.user.id,
          name: partnerData.name,
          gender: partnerData.gender as any,
          personality: partnerData.personality as any,
        }]);

        if (partnerError) {
          console.error('Partner creation error:', partnerError);
          throw new Error('Failed to create AI partner. Please try again.');
        }

        toast({
          title: "Welcome to Avera!",
          description: "Your account has been created.",
        });

        // Small delay to ensure data is committed
        await new Promise(resolve => setTimeout(resolve, 500));
        
        onComplete();
      }
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Create Your Account</h2>
          <p className="text-muted-foreground">
            Almost there! Just a few more details...
          </p>
        </div>

        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-2xl"
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-2xl"
          />

          <Button
            onClick={handleSignUp}
            disabled={loading}
            className="w-full bg-gradient-primary text-white py-6 text-lg rounded-2xl shadow-glow"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
