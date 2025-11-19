import { useState } from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { PaywallModal } from '@/components/PaywallModal';

export default function Chat() {
  const [showPaywall, setShowPaywall] = useState(false);

  return (
    <>
      <ChatInterface onCreditsExhausted={() => setShowPaywall(true)} />
      <PaywallModal open={showPaywall} onOpenChange={setShowPaywall} />
    </>
  );
}
