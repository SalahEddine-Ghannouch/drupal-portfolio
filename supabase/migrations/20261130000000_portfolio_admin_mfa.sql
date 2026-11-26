create policy "Portfolio administrators require MFA for content"
  on public.portfolio_content
  as restrictive
  for all
  to authenticated
  using (
    not exists (
      select 1
      from public.portfolio_admins
      where user_id = (select auth.uid())
    )
    or (select auth.jwt() ->> 'aal') = 'aal2'
  )
  with check (
    not exists (
      select 1
      from public.portfolio_admins
      where user_id = (select auth.uid())
    )
    or (select auth.jwt() ->> 'aal') = 'aal2'
  );

create policy "Portfolio administrators require MFA for entries"
  on public.portfolio_items
  as restrictive
  for all
  to authenticated
  using (
    not exists (
      select 1
      from public.portfolio_admins
      where user_id = (select auth.uid())
    )
    or (select auth.jwt() ->> 'aal') = 'aal2'
  )
  with check (
    not exists (
      select 1
      from public.portfolio_admins
      where user_id = (select auth.uid())
    )
    or (select auth.jwt() ->> 'aal') = 'aal2'
  );
