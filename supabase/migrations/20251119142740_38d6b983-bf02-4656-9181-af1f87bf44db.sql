-- Fix security warning: add search_path to generate_referral_code function
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    code := upper(substr(md5(random()::text), 1, 8));
    SELECT EXISTS(SELECT 1 FROM public.referral_codes WHERE referral_codes.code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$;