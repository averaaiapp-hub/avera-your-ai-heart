import { useState } from 'react';
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
  const [partnerData, setPartnerData] = useState({
    name: '',
    gender: '',
    personality: '',
    preference: '',
  });

  const stepNames = ['welcome', 'selection', 'naming', 'preferences', 'summary', 'signup'] as const;
  const currentStepName = stepNames[step] || 'welcome';

  const steps = [
    <WelcomeScreen onNext={() => setStep(1)} />,
    <PartnerSelection
      onNext={(data) => {
        setPartnerData((prev) => ({ ...prev, ...data }));
        setStep(2);
      }}
    />,
    <PartnerNaming
      partnerData={partnerData}
      onNext={(name) => {
        setPartnerData((prev) => ({ ...prev, name }));
        setStep(3);
      }}
    />,
    <PreferencesScreen
      onNext={(preference) => {
        setPartnerData((prev) => ({ ...prev, preference }));
        setStep(4);
      }}
    />,
    <OnboardingSummary
      partnerData={partnerData}
      onContinue={() => {
        setStep(5);
        localStorage.removeItem('onboarding_chat_messages'); // Clear chat history
      }}
      onEdit={() => setStep(1)} // Go back to selection
    />,
    <SignUpScreen
      partnerData={partnerData}
      onComplete={() => (window.location.href = '/chat')}
    />,
  ];

  return (
    <>
      {steps[step]}
      {step < 5 && (
        <OnboardingChatAssistant 
          currentStep={currentStepName as any}
          partnerData={partnerData}
          onNameSuggestion={(name) => {
            setPartnerData((prev) => ({ ...prev, name }));
          }}
        />
      )}
    </>
  );
}
