import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WelcomeScreen } from '@/components/onboarding/WelcomeScreen';
import { PartnerSelection } from '@/components/onboarding/PartnerSelection';
import { PartnerNaming } from '@/components/onboarding/PartnerNaming';
import { PreferencesScreen } from '@/components/onboarding/PreferencesScreen';
import { OnboardingSummary } from '@/components/onboarding/OnboardingSummary';
import { SignUpScreen } from '@/components/onboarding/SignUpScreen';
import { OnboardingChatAssistant } from '@/components/onboarding/OnboardingChatAssistant';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function Onboarding() {
  const { user } = useAuth();
  
  // If user is authenticated, wrap in ProtectedRoute to prevent access after onboarding is complete
  // If not authenticated, allow access for signup flow
  if (user) {
    return (
      <ProtectedRoute requireOnboarding={false}>
        <OnboardingContent />
      </ProtectedRoute>
    );
  }
  
  return <OnboardingContent />;
}

function OnboardingContent() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const [partnerData, setPartnerData] = useState({
    name: '',
    gender: '',
    personality: '',
    preference: '',
  });

  const stepNames = ['welcome', 'selection', 'naming', 'preferences', 'summary', 'signup'] as const;
  const currentStepName = stepNames[step] || 'welcome';

  const goToStep = (newStep: number) => {
    setDirection(newStep > step ? 1 : -1);
    setStep(newStep);
  };

  const getVariants = () => ({
    initial: {
      opacity: 0,
      x: direction * 100,
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
    exit: {
      opacity: 0,
      x: direction * -100,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeIn" as const,
      },
    },
  });

  const renderStep = () => {
    switch (step) {
      case 0:
        return <WelcomeScreen onNext={() => goToStep(1)} />;
      case 1:
        return (
          <PartnerSelection
            onNext={(data) => {
              setPartnerData((prev) => ({ ...prev, ...data }));
              goToStep(2);
            }}
          />
        );
      case 2:
        return (
          <PartnerNaming
            partnerData={partnerData}
            onNext={(name) => {
              setPartnerData((prev) => ({ ...prev, name }));
              goToStep(3);
            }}
          />
        );
      case 3:
        return (
          <PreferencesScreen
            onNext={(preference) => {
              setPartnerData((prev) => ({ ...prev, preference }));
              goToStep(4);
            }}
          />
        );
      case 4:
        return (
          <OnboardingSummary
            partnerData={partnerData}
            onContinue={() => {
              goToStep(5);
              localStorage.removeItem('onboarding_chat_messages');
            }}
            onEdit={() => goToStep(1)}
          />
        );
      case 5:
        return (
          <SignUpScreen
            partnerData={partnerData}
            onComplete={() => (window.location.href = '/chat')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={getVariants()}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
      
      {step < 5 && (
        <OnboardingChatAssistant 
          currentStep={currentStepName as any}
          partnerData={partnerData}
          onNameSuggestion={(name) => {
            setPartnerData((prev) => ({ ...prev, name }));
          }}
        />
      )}
    </div>
  );
}
