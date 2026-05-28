-- Add is_accepted column to reviews table
ALTER TABLE public.reviews ADD COLUMN is_accepted boolean DEFAULT false;

-- Allow challenge authors to update the is_accepted status of reviews on their challenges
CREATE POLICY "Challenge authors can accept reviews." 
  ON public.reviews FOR UPDATE 
  USING (
    auth.uid() = (SELECT author_id FROM public.challenges WHERE id = challenge_id)
  );

-- Create the function to automatically award points
CREATE OR REPLACE FUNCTION public.handle_accepted_review()
RETURNS trigger AS $$
DECLARE
  challenge_points integer;
BEGIN
  -- Only proceed if the review was just accepted
  IF NEW.is_accepted = true AND OLD.is_accepted = false THEN
    
    -- Get the point value from the parent challenge
    SELECT points INTO challenge_points FROM public.challenges WHERE id = NEW.challenge_id;

    -- Update the reviewer's profile stats
    UPDATE public.profiles
    SET 
      total_points = total_points + COALESCE(challenge_points, 0),
      reviews_completed = reviews_completed + 1,
      bugs_found = bugs_found + CASE WHEN NEW.category = 'bug' THEN 1 ELSE 0 END,
      optimizations_suggested = optimizations_suggested + CASE WHEN NEW.category = 'optimization' THEN 1 ELSE 0 END
    WHERE id = NEW.reviewer_id;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on the reviews table
CREATE TRIGGER on_review_accepted
  AFTER UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_accepted_review();
