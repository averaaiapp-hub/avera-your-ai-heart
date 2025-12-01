import { ChatInterface } from '@/components/chat/ChatInterface';

export default function Chat() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-hidden">
        <ChatInterface onCreditsExhausted={() => {}} />
      </div>
    </div>
  );
}
