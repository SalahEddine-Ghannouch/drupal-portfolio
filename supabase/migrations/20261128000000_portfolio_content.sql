create table if not exists public.portfolio_content (
  id text primary key check (id = 'main'),
  translations jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.portfolio_content enable row level security;

grant select on public.portfolio_content to anon, authenticated;
grant insert, update on public.portfolio_content to authenticated;

create policy "Portfolio translations are public"
  on public.portfolio_content
  for select
  to anon, authenticated
  using (true);

create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table public.portfolio_admins enable row level security;
grant select on public.portfolio_admins to authenticated;

create policy "Admins can read their own allowlist entry"
  on public.portfolio_admins
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Allowlisted admins can create portfolio content"
  on public.portfolio_content
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.portfolio_admins
      where user_id = (select auth.uid())
    )
  );

create policy "Allowlisted admins can update portfolio content"
  on public.portfolio_content
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.portfolio_admins
      where user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.portfolio_admins
      where user_id = (select auth.uid())
    )
  );
