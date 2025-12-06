-- Add SELECT policy for creator_tracking so creators can view their own tracking data
CREATE POLICY "Users can view own creator tracking" 
ON public.creator_tracking 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());