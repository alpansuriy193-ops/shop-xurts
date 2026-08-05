CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    CASE WHEN lower(NEW.email) = 'alpansuriy193@gmail.com' THEN 'admin' ELSE 'user' END
  );
  RETURN NEW;
END;
$function$;

UPDATE public.profiles p
SET role = 'admin'
FROM auth.users u
WHERE u.id = p.id AND lower(u.email) = 'alpansuriy193@gmail.com';