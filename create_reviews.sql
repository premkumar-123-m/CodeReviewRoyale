-- Create the reviews table
CREATE TABLE public.reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id uuid REFERENCES public.challenges ON DELETE CASCADE NOT NULL,
  reviewer_id uuid REFERENCES public.profiles(id) NOT NULL,
  text text NOT NULL,
  category text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policies for reviews
CREATE POLICY "Reviews are viewable by everyone." 
  ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert reviews." 
  ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update their own reviews." 
  ON public.reviews FOR UPDATE USING (auth.uid() = reviewer_id);
