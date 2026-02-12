-- Create profiles table
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  gender text,
  age integer,
  activity_level text,
  height numeric,
  weight numeric,
  goal_weight numeric,
  quiz_data jsonb,
  updated_at timestamp with time zone,
  
  primary key (id)
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- Create streaks table
create table public.streaks (
  user_id uuid not null references auth.users on delete cascade,
  streak_days integer not null default 0,
  last_streak_at timestamp with time zone,
  updated_at timestamp with time zone not null default now(),
  primary key (user_id)
);

alter table public.streaks enable row level security;

create policy "Users can read own streak."
  on public.streaks for select
  using ( auth.uid() = user_id );

create policy "Users can upsert own streak."
  on public.streaks for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own streak."
  on public.streaks for update
  using ( auth.uid() = user_id );

-- Create a trigger to sync user creation (optional, but good practice if not handling in app)
-- Note: The app currently handles profile creation on RegisterScreen, so this might not be strictly necessary 
-- but it's good to have the table structure ready.
