-- Create a security definer function to increment creator stats
-- This allows unauthenticated visitors to increment stats for creators
CREATE OR REPLACE FUNCTION public.increment_creator_stats(
  p_creator_code text,
  p_visits integer DEFAULT 0,
  p_signups integer DEFAULT 0,
  p_conversions integer DEFAULT 0,
  p_revenue numeric DEFAULT 0
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the user_id for this creator_code
  SELECT user_id INTO v_user_id
  FROM public.referral_codes
  WHERE code = p_creator_code
  LIMIT 1;

  -- If creator code doesn't exist, exit
  IF v_user_id IS NULL THEN
    RETURN;
  END IF;

  -- Insert or update stats
  INSERT INTO public.creator_stats (
    creator_code,
    user_id,
    total_visits,
    total_signups,
    total_conversions,
    total_revenue,
    updated_at
  )
  VALUES (
    p_creator_code,
    v_user_id,
    p_visits,
    p_signups,
    p_conversions,
    p_revenue,
    now()
  )
  ON CONFLICT (creator_code)
  DO UPDATE SET
    total_visits = creator_stats.total_visits + p_visits,
    total_signups = creator_stats.total_signups + p_signups,
    total_conversions = creator_stats.total_conversions + p_conversions,
    total_revenue = creator_stats.total_revenue + p_revenue,
    updated_at = now();
END;
$$;