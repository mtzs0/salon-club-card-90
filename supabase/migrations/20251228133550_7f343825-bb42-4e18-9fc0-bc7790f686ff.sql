-- Create payments table to track payment history
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client text NOT NULL,
  date timestamp with time zone NOT NULL DEFAULT now(),
  amount integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (matching clients table pattern)
CREATE POLICY "Anyone can insert payments"
ON public.payments
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can select payments"
ON public.payments
FOR SELECT
USING (true);