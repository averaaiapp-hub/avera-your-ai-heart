import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreatorTracking } from '@/hooks/useCreatorTracking';

const Index = () => {
  const navigate = useNavigate();
  
  // Track creator referrals
  useCreatorTracking();

  useEffect(() => {
    // Always redirect to onboarding flow
    navigate('/onboarding');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse text-primary text-2xl font-semibold">
          Loading Avera...
        </div>
      </div>
    </div>
  );
};

export default Index;
