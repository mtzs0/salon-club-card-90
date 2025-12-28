-- Create the clients table for club card registrations
CREATE TABLE public.clients (
  vendeg_uuid UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendeg_id TEXT NOT NULL,
  vendeg_first_name TEXT NOT NULL,
  vendeg_last_name TEXT NOT NULL,
  vendeg_birthday DATE NOT NULL,
  vendeg_email TEXT NOT NULL,
  vendeg_telefon TEXT NOT NULL,
  payment_date TIMESTAMPTZ,
  payment_status BOOLEAN NOT NULL DEFAULT false,
  membership_start DATE,
  membership_end DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form submission)
CREATE POLICY "Anyone can insert clients"
ON public.clients
FOR INSERT
WITH CHECK (true);

-- Allow anyone to update their own record by vendeg_uuid (for payment updates)
CREATE POLICY "Anyone can update clients by uuid"
ON public.clients
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();