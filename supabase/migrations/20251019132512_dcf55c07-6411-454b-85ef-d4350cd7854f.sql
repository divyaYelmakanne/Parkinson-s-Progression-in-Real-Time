-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  date_of_birth DATE,
  diagnosis_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create typing test results table
CREATE TABLE public.typing_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  test_date TIMESTAMPTZ DEFAULT NOW(),
  wpm DECIMAL(5,2),
  accuracy DECIMAL(5,2),
  avg_dwell_time DECIMAL(10,2),
  avg_flight_time DECIMAL(10,2),
  rhythm_variability DECIMAL(10,2),
  motor_control_score DECIMAL(5,2),
  pd_progression_index DECIMAL(5,2),
  detected_symptoms TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.typing_test_results ENABLE ROW LEVEL SECURITY;

-- Create sensor data table for tracking tremors and movement
CREATE TABLE public.sensor_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  sensor_type TEXT NOT NULL, -- 'accelerometer', 'gyroscope', 'typing', 'voice'
  tremor_frequency DECIMAL(10,2),
  tremor_amplitude DECIMAL(10,2),
  movement_speed DECIMAL(10,2),
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sensor_data ENABLE ROW LEVEL SECURITY;

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  alert_type TEXT NOT NULL, -- 'mild_change', 'progressing', 'stable'
  severity TEXT NOT NULL, -- 'info', 'warning', 'critical'
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Create daily summaries table
CREATE TABLE public.daily_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  summary_date DATE NOT NULL,
  avg_pd_index DECIMAL(5,2),
  avg_tremor_frequency DECIMAL(10,2),
  status TEXT, -- 'stable', 'mild_change', 'progressing'
  recommendations TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, summary_date)
);

ALTER TABLE public.daily_summaries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for typing_test_results
CREATE POLICY "Users can view own test results"
  ON public.typing_test_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own test results"
  ON public.typing_test_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for sensor_data
CREATE POLICY "Users can view own sensor data"
  ON public.sensor_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sensor data"
  ON public.sensor_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for alerts
CREATE POLICY "Users can view own alerts"
  ON public.alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
  ON public.alerts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alerts"
  ON public.alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for daily_summaries
CREATE POLICY "Users can view own summaries"
  ON public.daily_summaries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own summaries"
  ON public.daily_summaries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();