-- Add skills column to the profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'::jsonb;

-- Update the handle_new_user function to extract skills from raw_user_meta_data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, skills)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(CAST(new.raw_user_meta_data->>'skills' AS jsonb), '[]'::jsonb)
  );
  RETURN new;
END;
$$;
