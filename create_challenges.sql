-- Create the challenges table
CREATE TABLE public.challenges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id uuid REFERENCES public.profiles(id) NOT NULL,
  title text NOT NULL,
  language text NOT NULL,
  difficulty text NOT NULL,
  points integer NOT NULL DEFAULT 50,
  tags text[] DEFAULT '{}'::text[],
  code_preview text NOT NULL,
  active_reviewers integer DEFAULT 0,
  time_left text DEFAULT '24h',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- Policies for challenges
CREATE POLICY "Challenges are viewable by everyone." 
  ON public.challenges FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert challenges." 
  ON public.challenges FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own challenges." 
  ON public.challenges FOR UPDATE USING (auth.uid() = author_id);
