import { ChatInterface } from '@/components/chat/ChatInterface';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Chat() {
  return (
    <ProtectedRoute requireOnboarding={true}>
      <div className="h-screen flex flex-col">
        <div className="flex-1 overflow-hidden">
          <ChatInterface onCreditsExhausted={() => {}} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
