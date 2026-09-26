-- Haru: contas de aluno e progresso sincronizado.
-- Regra de ouro: cada pessoa só lê e escreve as PRÓPRIAS linhas (RLS).

-- 1. Perfil (1 por conta)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) between 1 and 60),
  level text check (level in ('zero', 'basico', 'intermedio', 'avancado')),
  age_confirmed boolean not null default false,
  privacy_accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Estações do percurso concluídas
create table public.station_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  station_id text not null check (char_length(station_id) between 1 and 64),
  completed_at timestamptz not null,
  correct integer not null check (correct >= 0),
  total integer not null check (total >= 0 and correct <= total),
  attempts integer not null default 1 check (attempts >= 1),
  updated_at timestamptz not null default now(),
  primary key (user_id, station_id)
);

-- 3. Palavras marcadas como aprendidas
create table public.learned_words (
  user_id uuid not null references auth.users (id) on delete cascade,
  word_id text not null check (char_length(word_id) between 1 and 64),
  learned_at timestamptz not null default now(),
  primary key (user_id, word_id)
);

-- Permissões: visitantes sem conta (anon) não tocam em nada.
revoke all on public.profiles, public.station_progress, public.learned_words from anon;
grant select, insert, update, delete on public.profiles, public.station_progress, public.learned_words to authenticated;

-- RLS em todas as tabelas
alter table public.profiles enable row level security;
alter table public.station_progress enable row level security;
alter table public.learned_words enable row level security;

create policy "Perfil: ver o próprio" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "Perfil: criar o próprio" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);
create policy "Perfil: editar o próprio" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "Progresso: ver o próprio" on public.station_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Progresso: criar o próprio" on public.station_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Progresso: editar o próprio" on public.station_progress
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Progresso: apagar o próprio" on public.station_progress
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Palavras: ver as próprias" on public.learned_words
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Palavras: criar as próprias" on public.learned_words
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Palavras: apagar as próprias" on public.learned_words
  for delete to authenticated using ((select auth.uid()) = user_id);

-- updated_at automático
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger station_progress_updated_at before update on public.station_progress
  for each row execute function public.set_updated_at();

-- Cria o perfil quando alguém se regista (dados vindos do formulário de registo).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, age_confirmed, privacy_accepted_at)
  values (
    new.id,
    nullif(left(trim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), 60), ''),
    coalesce(new.raw_user_meta_data ->> 'age_confirmed', '') = 'true',
    case when coalesce(new.raw_user_meta_data ->> 'privacy_accepted', '') = 'true' then now() end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Apagar a própria conta (RGPD art. 17 / LGPD art. 18).
-- Apaga o utilizador em auth.users; o "on delete cascade" leva o resto.
create function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'É preciso estar com sessão iniciada.';
  end if;
  delete from auth.users where id = uid;
end;
$$;

revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
