import { useState } from 'react';
import { WelcomeScreen } from '@/components/onboarding/WelcomeScreen';
import { VideoIntro } from '@/components/onboarding/VideoIntro';
import { PartnerSelection } from '@/components/onboarding/PartnerSelection';
import { PartnerNaming } from '@/components/onboarding/PartnerNaming';
import { PreferencesScreen } from '@/components/onboarding/PreferencesScreen';
import { SignUpScreen } from '@/components/onboarding/SignUpScreen';
import { OnboardingChatAssistant } from '@/components/onboarding/OnboardingChatAssistant';

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [partnerData, setPartnerData] = useState({
    name: '',
    gender: '',
    personality: '',
    preference: '',
  });

  const stepNames = ['welcome', 'video', 'selection', 'naming', 'preferences', 'signup'] as const;
  const currentStepName = stepNames[step] || 'welcome';

  const steps = [
    <WelcomeScreen onNext={() => setStep(1)} />,
    <VideoIntro onComplete={() => setStep(2)} />,
    <PartnerSelection
      onNext={(data) => {
        setPartnerData((prev) => ({ ...prev, ...data }));
        setStep(3);
      }}
    />,
    <PartnerNaming
      partnerData={partnerData}
      onNext={(name) => {
        setPartnerData((prev) => ({ ...prev, name }));
        setStep(4);
      }}
    />,
    <PreferencesScreen
      onNext={(preference) => {
        setPartnerData((prev) => ({ ...prev, preference }));
        setStep(5);
      }}
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
