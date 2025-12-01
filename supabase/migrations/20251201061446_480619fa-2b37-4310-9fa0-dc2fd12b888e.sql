-- Add gift_id column to messages table
ALTER TABLE public.messages ADD COLUMN gift_id UUID REFERENCES public.gift_types(id);