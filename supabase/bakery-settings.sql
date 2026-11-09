create table if not exists public.bakery_settings (
  id integer primary key default 1 check (id = 1),
  min_order_days integer not null default 7 check (min_order_days between 1 and 60),
  updated_at timestamptz not null default now()
);

insert into public.bakery_settings (id, min_order_days)
values (1, 7)
on conflict (id) do nothing;

insert into public.service_durations (service, duration_minutes)
values ('Encomenda para festa', 30)
on conflict (service) do update set duration_minutes = excluded.duration_minutes;

alter table public.bakery_settings enable row level security;
revoke all on public.bakery_settings from anon, authenticated;
grant select on public.bakery_settings to anon, authenticated;
grant update on public.bakery_settings to authenticated;

drop policy if exists "Anyone can read bakery order lead time" on public.bakery_settings;
create policy "Anyone can read bakery order lead time"
  on public.bakery_settings for select to anon, authenticated using (true);

drop policy if exists "Admins can update bakery settings" on public.bakery_settings;
create policy "Admins can update bakery settings"
  on public.bakery_settings for update to authenticated
  using (exists (select 1 from public.admins where admins.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admins where admins.user_id = (select auth.uid())));
