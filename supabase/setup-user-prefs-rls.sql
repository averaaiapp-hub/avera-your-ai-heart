-- RLS Policies for user_preferences table
-- Run this SQL in Backend -> Database -> SQL Editor

CREATE POLICY select_own_prefs ON public.user_preferences
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY insert_own_prefs ON public.user_preferences
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY update_own_prefs ON public.user_preferences
FOR UPDATE TO authenticated
USING (auth.uid() = user_id);
