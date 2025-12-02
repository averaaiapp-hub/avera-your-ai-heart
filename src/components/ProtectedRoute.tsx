import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export const ProtectedRoute = ({ children, requireOnboarding = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (loading) return;

      if (!user) {
        // Not authenticated, redirect to auth
        navigate('/auth');
        return;
      }

      if (requireOnboarding) {
        // For routes that require completed onboarding, check if user has AI partner
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: partner } = await supabase
          .from('ai_partners')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!partner) {
          // User hasn't completed onboarding
          navigate('/onboarding');
          return;
        }
      }

      setChecking(false);
    };

    checkAccess();
  }, [user, loading, navigate, requireOnboarding]);

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};
