import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock } from 'lucide-react';
import { z } from 'zod';
import averaLogo from '@/assets/avera-logo.png';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Za-z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has a valid session from the reset link
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setValidToken(true);
      } else {
        toast({
          title: "Invalid or Expired Link",
          description: "Please request a new password reset link",
          variant: "destructive",
        });
        navigate('/auth');
      }
    });
  }, [navigate, toast]);

  const handleResetPassword = async () => {
    const result = resetPasswordSchema.safeParse({ password, confirmPassword });
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
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      toast({
        title: "Password Reset Successful",
        description: "You can now sign in with your new password",
      });
      
      // Sign out and redirect to login
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center space-y-4">
          <img 
            src={averaLogo} 
            alt="Avera" 
            className="h-16 mx-auto"
          />
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Reset Password
          </h1>
          <p className="text-muted-foreground">
            Choose a new secure password
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12 rounded-2xl"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleResetPassword()}
              className="pl-10 h-12 rounded-2xl"
            />
          </div>

          <ul className="text-sm text-muted-foreground space-y-1 pl-4">
            <li>• At least 8 characters</li>
            <li>• At least one letter</li>
            <li>• At least one number</li>
          </ul>

          <Button
            onClick={handleResetPassword}
            disabled={loading}
            className="w-full bg-gradient-primary text-white py-6 text-lg rounded-2xl shadow-glow"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
