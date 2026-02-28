
-- Allow authenticated users to update room rates
CREATE POLICY "Authenticated users can update room rates"
  ON public.room_rates FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
