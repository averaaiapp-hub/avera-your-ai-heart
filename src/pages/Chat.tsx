import { useState } from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { PaywallModal } from '@/components/PaywallModal';
import { ReferralCard } from '@/components/ReferralCard';

export default function Chat() {
  const [showPaywall, setShowPaywall] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-hidden">
        <ChatInterface onCreditsExhausted={() => setShowPaywall(true)} />
      </div>
      <div className="p-4 border-t border-border bg-card">
        <ReferralCard />
      </div>
      <PaywallModal open={showPaywall} onOpenChange={setShowPaywall} />
    </div>
  );
}
