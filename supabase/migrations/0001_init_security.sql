-- Cova — initial security migration
--
-- This migration closes the two biggest data-exposure gaps:
--   1. Creates a `staff` table so admin/handler portals can verify roles,
--      instead of trusting hardcoded credentials in client-side JS.
--   2. Enables Row-Level-Security on `policies` (and `staff`) so the public
--      anon key — which is intentionally embedded in the browser — cannot be
--      used to read other users' rows.
--
-- APPLY THIS MIGRATION to your live project:
--   Either:  supabase db push
--   Or:      paste into the Supabase Dashboard → SQL Editor → Run.
--
-- After applying, create your staff account(s):
--   1. Dashboard → Authentication → Users → Add user (e.g. admin@getcova.ng)
--   2. Copy that user's `id` (a uuid) and run:
--        insert into staff (user_id, role) values ('<user-uuid>', 'admin');
--      (repeat with role 'handler' for handler accounts)

-- ---------------------------------------------------------------------------
-- staff table: maps an auth.users account to a staff role
-- ---------------------------------------------------------------------------
create table if not exists public.staff (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  role       text not null check (role in ('admin', 'handler')),
  created_at timestamptz not null default now()
);

alter table public.staff enable row level security;

-- A staff member may read their own role row (the client guard needs this).
-- Admins may read all staff rows.
drop policy if exists "staff_read_self_or_admin" on public.staff;
create policy "staff_read_self_or_admin"
  on public.staff
  for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.staff s
      where s.user_id = auth.uid() and s.role = 'admin'
    )
  );

-- Only admins may insert/update/delete staff rows.
drop policy if exists "staff_write_admin" on public.staff;
create policy "staff_write_admin"
  on public.staff
  for all
  using (
    exists (
      select 1 from public.staff s
      where s.user_id = auth.uid() and s.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.staff s
      where s.user_id = auth.uid() and s.role = 'admin'
    )
  );

-- ---------------------------------------------------------------------------
-- policies table: enable RLS so users can only see their own policies.
-- The client previously relied on `.eq('user_id', ...)` which is trivially
-- bypassed. This makes the database enforce it.
-- ---------------------------------------------------------------------------
-- NOTE: `policies` is assumed to already exist (created by the app). If the
-- table or its `user_id` column has a different name, adjust below.

-- Only enable RLS if the table exists, to avoid breaking a fresh project.
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'policies') then
    alter table public.policies enable row level security;

    -- Owners can read their own rows.
    drop policy if exists "policies_select_own" on public.policies;
    create policy "policies_select_own"
      on public.policies
      for select
      using (user_id = auth.uid());

    -- Owners can insert rows where they are the user.
    drop policy if exists "policies_insert_own" on public.policies;
    create policy "policies_insert_own"
      on public.policies
      for insert
      with check (user_id = auth.uid());

    -- Owners can update only their own rows.
    drop policy if exists "policies_update_own" on public.policies;
    create policy "policies_update_own"
      on public.policies
      for update
      using (user_id = auth.uid())
      with check (user_id = auth.uid());

    -- Owners can delete only their own rows.
    drop policy if exists "policies_delete_own" on public.policies;
    create policy "policies_delete_own"
      on public.policies
      for delete
      using (user_id = auth.uid());
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Staff (admins) need to read ALL policies to run the admin dashboard.
-- Add read access scoped to the admin role.
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'policies') then
    drop policy if exists "policies_select_staff" on public.policies;
    create policy "policies_select_staff"
      on public.policies
      for select
      using (
        exists (
          select 1 from public.staff s
          where s.user_id = auth.uid() and s.role in ('admin', 'handler')
        )
      );
  end if;
end $$;
