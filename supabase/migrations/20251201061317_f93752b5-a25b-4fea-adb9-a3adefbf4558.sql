-- Create gift types table
CREATE TABLE public.gift_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  cost_credits INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default gift types
INSERT INTO public.gift_types (name, icon, cost_credits, description) VALUES
  ('Rose', '🌹', 1, 'A beautiful rose'),
  ('Heart', '❤️', 2, 'Show your love'),
  ('Diamond', '💎', 5, 'Something precious'),
  ('Crown', '👑', 10, 'Royal treatment'),
  ('Champagne', '🍾', 8, 'Celebrate together'),
  ('Teddy Bear', '🧸', 3, 'Cute and cuddly');

-- Create gifts_sent table to track gifts
CREATE TABLE public.gifts_sent (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  conversation_id UUID NOT NULL,
  gift_type_id UUID NOT NULL REFERENCES public.gift_types(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gift_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gifts_sent ENABLE ROW LEVEL SECURITY;

-- RLS policies for gift_types
CREATE POLICY "Anyone can view gift types"
  ON public.gift_types
  FOR SELECT
  USING (true);

-- RLS policies for gifts_sent
CREATE POLICY "Users can view gifts in their conversations"
  ON public.gifts_sent
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = gifts_sent.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send gifts"
  ON public.gifts_sent
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);