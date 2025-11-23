-- Add audio_url column to messages table
ALTER TABLE public.messages ADD COLUMN audio_url TEXT;

-- Create storage bucket for voice messages
INSERT INTO storage.buckets (id, name, public)
VALUES ('voice-messages', 'voice-messages', false);

-- Policy: Users can upload their own voice messages
CREATE POLICY "Users can upload voice messages"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'voice-messages' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can view their own voice messages
CREATE POLICY "Users can view their own voice messages"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'voice-messages' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can delete their own voice messages
CREATE POLICY "Users can delete their own voice messages"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'voice-messages' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);