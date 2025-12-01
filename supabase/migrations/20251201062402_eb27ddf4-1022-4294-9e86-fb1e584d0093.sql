-- Step 1: Add user_id column to creator_stats (nullable initially for existing data)
ALTER TABLE public.creator_stats 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 2: Populate user_id by linking creator_code to referral_codes
UPDATE public.creator_stats
SET user_id = (
  SELECT user_id 
  FROM public.referral_codes 
  WHERE referral_codes.code = creator_stats.creator_code
  LIMIT 1
);

-- Step 3: Make user_id NOT NULL now that it's populated
ALTER TABLE public.creator_stats 
ALTER COLUMN user_id SET NOT NULL;

-- Step 4: Drop the insecure public SELECT policy
DROP POLICY IF EXISTS "Anyone can view creator stats" ON public.creator_stats;

-- Step 5: Create secure owner-only policies
CREATE POLICY "Users can view own creator stats"
ON public.creator_stats
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own creator stats"
ON public.creator_stats
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own creator stats"
ON public.creator_stats
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Step 6: Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_creator_stats_user_id ON public.creator_stats(user_id);