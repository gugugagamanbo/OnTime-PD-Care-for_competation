
-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'patient' CHECK (role IN ('patient', 'family')),
  diagnosis_time TEXT,
  primary_doctor TEXT,
  main_symptoms TEXT,
  swallowing_difficulty TEXT,
  fall_history TEXT,
  wearable_device TEXT,
  emergency_contact TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Medications table
CREATE TABLE public.medications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  name TEXT NOT NULL,
  dose TEXT NOT NULL,
  strength TEXT,
  instruction_key TEXT DEFAULT 'med.beforeMeal',
  times TEXT[] NOT NULL DEFAULT '{}',
  stock_remaining INTEGER DEFAULT 0,
  stock_days INTEGER DEFAULT 0,
  stock_unit TEXT DEFAULT '片',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own medications" ON public.medications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own medications" ON public.medications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own medications" ON public.medications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own medications" ON public.medications FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON public.medications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Medication logs table
CREATE TABLE public.medication_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  medication_id UUID REFERENCES public.medications(id) ON DELETE SET NULL,
  scheduled_time TEXT NOT NULL,
  actual_time TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('taken', 'late', 'missed', 'pending')),
  late_by TEXT,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own logs" ON public.medication_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own logs" ON public.medication_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own logs" ON public.medication_logs FOR UPDATE USING (auth.uid() = user_id);

-- Symptoms table
CREATE TABLE public.symptoms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symptom TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe')),
  time TEXT,
  note TEXT,
  shared_to TEXT[] DEFAULT '{}',
  logged_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.symptoms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own symptoms" ON public.symptoms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own symptoms" ON public.symptoms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own symptoms" ON public.symptoms FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own symptoms" ON public.symptoms FOR DELETE USING (auth.uid() = user_id);

-- Care contacts table
CREATE TABLE public.care_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('护工', '家属', '医生', '药剂师')),
  status TEXT,
  contact TEXT,
  hospital TEXT,
  department TEXT,
  available_time TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.care_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own contacts" ON public.care_contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own contacts" ON public.care_contacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own contacts" ON public.care_contacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own contacts" ON public.care_contacts FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_care_contacts_updated_at BEFORE UPDATE ON public.care_contacts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Clinical visits table
CREATE TABLE public.clinical_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL,
  doctor_name TEXT,
  hospital TEXT,
  department TEXT,
  notes TEXT,
  symptom_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.clinical_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own visits" ON public.clinical_visits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own visits" ON public.clinical_visits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own visits" ON public.clinical_visits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own visits" ON public.clinical_visits FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_clinical_visits_updated_at BEFORE UPDATE ON public.clinical_visits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('medication_reminder', 'missed_dose', 'stock_low', 'system')),
  title TEXT NOT NULL,
  body TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('attachments', 'attachments', false);

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for attachments
CREATE POLICY "Users can view their own attachments" ON storage.objects FOR SELECT USING (bucket_id = 'attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can upload their own attachments" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
