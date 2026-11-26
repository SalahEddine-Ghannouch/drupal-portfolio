create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  collection text not null check (
    collection in (
      'projects',
      'expertise',
      'experience',
      'open_source',
      'certifications',
      'testimonials'
    )
  ),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists portfolio_items_collection_order_idx
  on public.portfolio_items (collection, sort_order);

alter table public.portfolio_content
  add column if not exists items_initialized boolean not null default false;

alter table public.portfolio_items enable row level security;

grant select on public.portfolio_items to anon, authenticated;
grant insert, update, delete on public.portfolio_items to authenticated;

create policy "Published portfolio items are public"
  on public.portfolio_items
  for select
  to anon, authenticated
  using (published = true);

create policy "Allowlisted admins can read all portfolio items"
  on public.portfolio_items
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.portfolio_admins
      where user_id = (select auth.uid())
    )
  );

create policy "Allowlisted admins can create portfolio items"
  on public.portfolio_items
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.portfolio_admins
      where user_id = (select auth.uid())
    )
  );

create policy "Allowlisted admins can update portfolio items"
  on public.portfolio_items
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

create policy "Allowlisted admins can delete portfolio items"
  on public.portfolio_items
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.portfolio_admins
      where user_id = (select auth.uid())
    )
  );
