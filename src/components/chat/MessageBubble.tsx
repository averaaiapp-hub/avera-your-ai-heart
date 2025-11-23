import { motion } from 'framer-motion';
import { AudioMessage } from './AudioMessage';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  audio_url?: string | null;
}

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-muted text-foreground'
            : 'bg-gradient-primary text-white shadow-soft'
        }`}
      >
        {message.audio_url ? (
          <AudioMessage audioUrl={message.audio_url} />
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        )}
      </div>
    </motion.div>
  );
};
