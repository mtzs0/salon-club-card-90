-- Add SELECT policy so clients can read their own record by vendeg_uuid
-- This is needed for the payment update flow to check membership_start
CREATE POLICY "Anyone can select clients"
ON public.clients
FOR SELECT
USING (true);