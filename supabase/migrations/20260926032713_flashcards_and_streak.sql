-- Haru: flashcards (repetição espaçada) e dias de estudo (streak).
-- Mesmo padrão da migração anterior: RLS, só "authenticated", cada um só vê o seu.

-- 1. Meta diária de estudo (minutos) no perfil
alter table public.profiles
  add column daily_goal smallint check (daily_goal in (5, 10, 15, 30));

-- 2. Estado de cada flashcard (algoritmo SM-2, ver public/js/lib/srs.js)
create table public.card_states (
  user_id uuid not null references auth.users (id) on delete cascade,
  card_id text not null check (char_length(card_id) between 1 and 100),
  reps integer not null default 0 check (reps >= 0),
  interval_days integer not null check (interval_days between 0 and 3650),
  ease numeric(4, 2) not null check (ease between 1.3 and 5),
  due_on date not null,
  lapses integer not null default 0 check (lapses >= 0),
  added_on date not null,
  reviewed_at timestamptz not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, card_id)
);

-- 3. Um registro por dia em que a pessoa estudou (para o streak e a meta diária)
create table public.study_days (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  minutes numeric(6, 2) not null default 0 check (minutes between 0 and 1440),
  cards integer not null default 0 check (cards >= 0),
  lessons integer not null default 0 check (lessons >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

revoke all on public.card_states, public.study_days from anon;
grant select, insert, update, delete on public.card_states, public.study_days to authenticated;

alter table public.card_states enable row level security;
alter table public.study_days enable row level security;

create policy "Cartões: ver os próprios" on public.card_states
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Cartões: criar os próprios" on public.card_states
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Cartões: editar os próprios" on public.card_states
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Cartões: apagar os próprios" on public.card_states
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Dias: ver os próprios" on public.study_days
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Dias: criar os próprios" on public.study_days
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Dias: editar os próprios" on public.study_days
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Dias: apagar os próprios" on public.study_days
  for delete to authenticated using ((select auth.uid()) = user_id);

create trigger card_states_updated_at before update on public.card_states
  for each row execute function public.set_updated_at();
create trigger study_days_updated_at before update on public.study_days
  for each row execute function public.set_updated_at();
