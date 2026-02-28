
-- Create room_rates table
CREATE TABLE public.room_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_name TEXT NOT NULL UNIQUE,
  base_price NUMERIC NOT NULL DEFAULT 0,
  season_price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (public read, no write from client)
ALTER TABLE public.room_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read room rates"
  ON public.room_rates FOR SELECT
  USING (true);

-- Insert default room data
INSERT INTO public.room_rates (room_name, base_price, season_price) VALUES
  ('Standard Room', 3000, 4500),
  ('Deluxe Room with Bathtub', 5000, 7500),
  ('Owner Suite (2 Bedrooms)', 8000, 12000),
  ('Royal Suite (4 Bedrooms)', 15000, 22000);
