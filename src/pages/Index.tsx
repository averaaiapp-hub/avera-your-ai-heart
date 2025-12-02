import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreatorTracking } from '@/hooks/useCreatorTracking';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  
  // Track creator referrals
  useCreatorTracking();

  useEffect(() => {
    const checkAuthAndRoute = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // User is logged in, check if they have an AI partner
          const { data: partner } = await supabase
            .from('ai_partners')
            .select('id')
            .eq('user_id', session.user.id)
            .single();

          if (partner) {
            // User has completed onboarding, go to chat
            navigate('/chat');
          } else {
            // User hasn't completed onboarding
            navigate('/onboarding');
          }
        } else {
          // No session, go to auth page
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        navigate('/auth');
      } finally {
        setChecking(false);
      }
    };

    checkAuthAndRoute();
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-primary text-2xl font-semibold">
            Loading Avera...
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Index;
