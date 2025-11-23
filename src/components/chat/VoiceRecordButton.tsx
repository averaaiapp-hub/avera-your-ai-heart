import { useState } from 'react';
import { Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AudioRecorder, blobToBase64 } from '@/utils/audioRecorder';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface VoiceRecordButtonProps {
  onRecordingComplete: (audioBlob: Blob, base64Audio: string) => void;
  disabled?: boolean;
}

export const VoiceRecordButton = ({ onRecordingComplete, disabled }: VoiceRecordButtonProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recorder] = useState(() => new AudioRecorder());
  const { toast } = useToast();

  const handleStartRecording = async () => {
    try {
      await recorder.start();
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Speak your message",
      });
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast({
        title: "Recording failed",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const handleStopRecording = async () => {
    try {
      const audioBlob = await recorder.stop();
      const base64Audio = await blobToBase64(audioBlob);
      setIsRecording(false);
      onRecordingComplete(audioBlob, base64Audio);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      toast({
        title: "Error",
        description: "Failed to process recording",
        variant: "destructive",
      });
      setIsRecording(false);
    }
  };

  return (
    <Button
      type="button"
      size="icon"
      variant={isRecording ? "destructive" : "ghost"}
      onClick={isRecording ? handleStopRecording : handleStartRecording}
      disabled={disabled}
      className="relative"
    >
      {isRecording ? (
        <>
          <motion.div
            className="absolute inset-0 rounded-full bg-destructive"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <Square className="h-5 w-5 relative z-10" />
        </>
      ) : (
        <Mic className="h-5 w-5" />
      )}
    </Button>
  );
};
