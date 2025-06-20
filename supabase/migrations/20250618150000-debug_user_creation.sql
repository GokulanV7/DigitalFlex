-- Add debugging to handle_new_user function to log errors during user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RAISE NOTICE 'Successfully inserted new profile for user %', NEW.email;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error inserting profile for user %: %', NEW.email, SQLERRM;
    -- Continue with the trigger even if profile insert fails
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
