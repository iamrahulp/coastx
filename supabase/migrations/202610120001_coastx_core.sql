create extension if not exists pgcrypto;

create type public.user_role as enum ('customer', 'partner', 'admin');
create type public.partner_status as enum ('pending', 'approved', 'rejected', 'suspended');
create type public.experience_status as enum ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'paused');
create type public.booking_status as enum ('pending_payment', 'confirmed', 'checked_in', 'completed', 'cancelled', 'cancelled_weather', 'refunded');
create type public.payment_status as enum ('created', 'authorized', 'captured', 'failed', 'refunded');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'customer',
  full_name text not null default '',
  phone text,
  avatar_url text,
  locale text not null default 'en-IN',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete restrict,
  business_name text not null,
  public_name text not null,
  description text not null default '',
  contact_email text not null,
  contact_phone text,
  status public.partner_status not null default 'pending',
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id),
  demo_record boolean not null default false,
  created_at timestamptz not null default now(),
  unique(owner_id)
);

create table public.partner_documents (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners(id) on delete cascade,
  document_type text not null,
  storage_path text not null,
  status text not null default 'submitted' check (status in ('submitted', 'approved', 'rejected')),
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  district text not null default 'Dakshina Kannada',
  state text not null default 'Karnataka',
  country_code char(2) not null default 'IN',
  latitude numeric(9,6),
  longitude numeric(9,6),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text not null default '',
  icon_key text,
  sort_order smallint not null default 0,
  active boolean not null default true
);

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners(id) on delete restrict,
  location_id uuid not null references public.locations(id) on delete restrict,
  category_id uuid not null references public.categories(id) on delete restrict,
  title text not null,
  slug text not null unique,
  short_description text not null default '',
  description text not null default '',
  highlights jsonb not null default '[]'::jsonb,
  inclusions jsonb not null default '[]'::jsonb,
  exclusions jsonb not null default '[]'::jsonb,
  what_to_bring jsonb not null default '[]'::jsonb,
  safety_information text not null default '',
  cancellation_policy text not null default '',
  weather_policy text not null default '',
  meeting_point text not null default '',
  latitude numeric(9,6),
  longitude numeric(9,6),
  duration_minutes integer not null check (duration_minutes > 0),
  price_adult_paise integer not null check (price_adult_paise >= 0),
  price_child_paise integer check (price_child_paise >= 0),
  minimum_age smallint not null default 0 check (minimum_age >= 0),
  difficulty text not null default 'easy' check (difficulty in ('easy', 'moderate', 'challenging')),
  languages text[] not null default array['English'],
  group_min smallint not null default 1 check (group_min > 0),
  group_max smallint not null default 10 check (group_max >= group_min),
  indoor_outdoor text not null default 'outdoor',
  instant_confirmation boolean not null default false,
  coastx_original boolean not null default false,
  featured boolean not null default false,
  status public.experience_status not null default 'draft',
  rating numeric(2,1) not null default 0 check (rating between 0 and 5),
  review_count integer not null default 0 check (review_count >= 0),
  booking_count integer not null default 0 check (booking_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.experience_images (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences(id) on delete cascade,
  storage_path text not null,
  alt_text text not null,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now()
);

create table public.experience_schedules (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences(id) on delete cascade,
  weekday smallint check (weekday between 0 and 6),
  start_time time not null,
  end_time time,
  active boolean not null default true,
  unique(experience_id, weekday, start_time)
);

create table public.experience_time_slots (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity integer not null check (capacity > 0),
  reserved integer not null default 0 check (reserved >= 0 and reserved <= capacity),
  blocked boolean not null default false,
  created_at timestamptz not null default now(),
  unique(experience_id, starts_at),
  check(ends_at > starts_at)
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_code text not null unique default ('CX-' || upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 8))),
  customer_id uuid not null references public.profiles(id) on delete restrict,
  experience_id uuid not null references public.experiences(id) on delete restrict,
  time_slot_id uuid not null references public.experience_time_slots(id) on delete restrict,
  status public.booking_status not null default 'pending_payment',
  guest_name text not null,
  guest_email text not null,
  guest_phone text not null,
  adults smallint not null check (adults > 0),
  children smallint not null default 0 check (children >= 0),
  currency char(3) not null default 'INR',
  subtotal_paise integer not null check (subtotal_paise >= 0),
  tax_paise integer not null default 0 check (tax_paise >= 0),
  service_fee_paise integer not null default 0 check (service_fee_paise >= 0),
  discount_paise integer not null default 0 check (discount_paise >= 0),
  total_paise integer not null check (total_paise >= 0),
  promo_code_id uuid,
  guest_note text,
  cancelled_reason text,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check(adults + children between 1 and 10)
);

create table public.booking_participants (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  participant_type text not null check (participant_type in ('adult', 'child')),
  quantity smallint not null check (quantity > 0),
  unit_price_paise integer not null check (unit_price_paise >= 0)
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete restrict,
  provider text not null default 'razorpay',
  provider_order_id text unique,
  provider_payment_id text unique,
  amount_paise integer not null check (amount_paise >= 0),
  currency char(3) not null default 'INR',
  status public.payment_status not null default 'created',
  signature_verified_at timestamptz,
  captured_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.refunds (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments(id) on delete restrict,
  provider_refund_id text unique,
  amount_paise integer not null check (amount_paise > 0),
  status text not null default 'requested' check (status in ('requested', 'processed', 'failed')),
  reason text not null,
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete restrict,
  customer_id uuid not null references public.profiles(id) on delete restrict,
  experience_id uuid not null references public.experiences(id) on delete restrict,
  rating smallint not null check (rating between 1 and 5),
  title text,
  body text not null,
  status text not null default 'published' check (status in ('published', 'hidden', 'flagged')),
  experienced_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.review_images (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews(id) on delete cascade,
  storage_path text not null,
  alt_text text not null default ''
);

create table public.wishlists (
  customer_id uuid not null references public.profiles(id) on delete cascade,
  experience_id uuid not null references public.experiences(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(customer_id, experience_id)
);

create table public.itineraries (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'A day on the coast',
  plan_date date,
  starting_location_id uuid references public.locations(id),
  interests text[] not null default '{}',
  budget_paise integer,
  shared_code text unique,
  created_at timestamptz not null default now()
);

create table public.itinerary_items (
  id uuid primary key default gen_random_uuid(),
  itinerary_id uuid not null references public.itineraries(id) on delete cascade,
  experience_id uuid references public.experiences(id) on delete set null,
  sort_order smallint not null default 0,
  starts_at timestamptz,
  notes text not null default ''
);

create table public.passport_achievements (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text not null,
  experience_threshold integer,
  created_at timestamptz not null default now()
);

create table public.user_achievements (
  customer_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id uuid not null references public.passport_achievements(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key(customer_id, achievement_id)
);

create table public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value integer not null check (discount_value > 0),
  minimum_subtotal_paise integer not null default 0,
  maximum_discount_paise integer,
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  usage_limit integer,
  usage_count integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.bookings add constraint bookings_promo_code_fk foreign key (promo_code_id) references public.promo_codes(id) on delete set null;

create table public.promo_code_usage (
  promo_code_id uuid not null references public.promo_codes(id) on delete restrict,
  customer_id uuid not null references public.profiles(id) on delete restrict,
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  used_at timestamptz not null default now(),
  primary key(promo_code_id, customer_id, booking_id)
);

create table public.verification_badges (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references public.partners(id) on delete cascade,
  experience_id uuid references public.experiences(id) on delete cascade,
  badge_type text not null check (badge_type in ('coastx_verified', 'safety_verified', 'guide_verified')),
  awarded_by uuid not null references public.profiles(id),
  awarded_at timestamptz not null default now(),
  check ((partner_id is not null)::integer + (experience_id is not null)::integer = 1)
);

create table public.partner_payouts (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners(id) on delete restrict,
  period_start date not null,
  period_end date not null,
  gross_paise bigint not null default 0,
  platform_fee_paise bigint not null default 0,
  refund_paise bigint not null default 0,
  net_paise bigint not null default 0,
  status text not null default 'pending' check (status in ('pending', 'processing', 'paid', 'failed')),
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  check(period_end >= period_start)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null,
  title text not null,
  body text not null,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.support_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid references public.profiles(id) on delete set null,
  booking_id uuid references public.bookings(id) on delete set null,
  subject text not null,
  message text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz not null default now()
);

create table public.weather_cache (
  location_id uuid not null references public.locations(id) on delete cascade,
  forecast_date date not null,
  provider text not null,
  data jsonb not null,
  fetched_at timestamptz not null default now(),
  expires_at timestamptz not null,
  primary key(location_id, forecast_date, provider)
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index experiences_discovery_idx on public.experiences(status, location_id, category_id, price_adult_paise);
create index experiences_partner_idx on public.experiences(partner_id, status);
create index experiences_search_idx on public.experiences using gin (to_tsvector('simple', title || ' ' || short_description));
create index slots_experience_date_idx on public.experience_time_slots(experience_id, starts_at) where not blocked;
create index bookings_customer_date_idx on public.bookings(customer_id, created_at desc);
create index bookings_slot_status_idx on public.bookings(time_slot_id, status);
create index reviews_experience_created_idx on public.reviews(experience_id, created_at desc) where status = 'published';
create index notifications_unread_idx on public.notifications(recipient_id, created_at desc) where read_at is null;

create or replace function public.current_user_role()
returns public.user_role language sql stable security definer set search_path = public
as $$ select role from public.profiles where id = auth.uid() $$;

create or replace function public.is_coastx_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select coalesce(public.current_user_role() = 'admin', false) $$;

create or replace function public.reserve_experience_slot(
  p_customer_id uuid,
  p_slot_id uuid,
  p_adults smallint,
  p_children smallint,
  p_guest_name text,
  p_guest_email text,
  p_guest_phone text,
  p_promo_code text default null
)
returns uuid language plpgsql security definer set search_path = public
as $$
declare
  v_slot public.experience_time_slots%rowtype;
  v_experience public.experiences%rowtype;
  v_subtotal integer;
  v_fee integer := 4900;
  v_tax integer;
  v_discount integer := 0;
  v_booking_id uuid;
begin
  if p_customer_id is distinct from auth.uid() and not public.is_coastx_admin() then
    raise exception 'Not authorized';
  end if;
  if p_adults < 1 or p_children < 0 or p_adults + p_children > 10 then
    raise exception 'Guest count must be between 1 and 10';
  end if;
  select * into v_slot from public.experience_time_slots where id = p_slot_id for update;
  if not found or v_slot.blocked or v_slot.starts_at <= now() then
    raise exception 'This time is no longer available';
  end if;
  if v_slot.reserved + p_adults + p_children > v_slot.capacity then
    raise exception 'Not enough seats remain';
  end if;
  select * into v_experience from public.experiences where id = v_slot.experience_id and status = 'approved';
  if not found then raise exception 'Experience is not available'; end if;
  v_subtotal := p_adults * v_experience.price_adult_paise + p_children * coalesce(v_experience.price_child_paise, v_experience.price_adult_paise);
  if p_promo_code is not null then
    select case when discount_type = 'percentage' then least((v_subtotal * discount_value) / 100, coalesce(maximum_discount_paise, v_subtotal)) else least(discount_value, coalesce(maximum_discount_paise, discount_value)) end
      into v_discount from public.promo_codes where code = upper(p_promo_code) and active and starts_at <= now() and (expires_at is null or expires_at > now()) and v_subtotal >= minimum_subtotal_paise and (usage_limit is null or usage_count < usage_limit) for update;
    v_discount := coalesce(v_discount, 0);
  end if;
  v_tax := round(((v_subtotal + v_fee - v_discount) * 0.05)::numeric);
  insert into public.bookings(customer_id, experience_id, time_slot_id, guest_name, guest_email, guest_phone, adults, children, subtotal_paise, tax_paise, service_fee_paise, discount_paise, total_paise, status, confirmed_at)
    values (p_customer_id, v_experience.id, p_slot_id, p_guest_name, p_guest_email, p_guest_phone, p_adults, p_children, v_subtotal, v_tax, v_fee, v_discount, v_subtotal + v_tax + v_fee - v_discount, 'pending_payment', null) returning id into v_booking_id;
  update public.experience_time_slots set reserved = reserved + p_adults + p_children where id = p_slot_id;
  update public.experiences set booking_count = booking_count + 1 where id = v_experience.id;
  if p_promo_code is not null and v_discount > 0 then
    update public.promo_codes set usage_count = usage_count + 1 where code = upper(p_promo_code);
    insert into public.promo_code_usage(promo_code_id, customer_id, booking_id) select id, p_customer_id, v_booking_id from public.promo_codes where code = upper(p_promo_code);
  end if;
  insert into public.booking_participants(booking_id, participant_type, quantity, unit_price_paise) values (v_booking_id, 'adult', p_adults, v_experience.price_adult_paise);
  if p_children > 0 then
    insert into public.booking_participants(booking_id, participant_type, quantity, unit_price_paise) values (v_booking_id, 'child', p_children, coalesce(v_experience.price_child_paise, v_experience.price_adult_paise));
  end if;
  return v_booking_id;
end;
$$;

alter table public.profiles enable row level security;
alter table public.partners enable row level security;
alter table public.partner_documents enable row level security;
alter table public.locations enable row level security;
alter table public.categories enable row level security;
alter table public.experiences enable row level security;
alter table public.experience_images enable row level security;
alter table public.experience_schedules enable row level security;
alter table public.experience_time_slots enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_participants enable row level security;
alter table public.payments enable row level security;
alter table public.refunds enable row level security;
alter table public.reviews enable row level security;
alter table public.review_images enable row level security;
alter table public.wishlists enable row level security;
alter table public.itineraries enable row level security;
alter table public.itinerary_items enable row level security;
alter table public.passport_achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.promo_codes enable row level security;
alter table public.promo_code_usage enable row level security;
alter table public.verification_badges enable row level security;
alter table public.partner_payouts enable row level security;
alter table public.notifications enable row level security;
alter table public.support_requests enable row level security;
alter table public.weather_cache enable row level security;
alter table public.audit_logs enable row level security;

create policy "Profiles visible to owner and admin" on public.profiles for select using (id = auth.uid() or public.is_coastx_admin());
create policy "Profiles insert by owner" on public.profiles for insert with check (id = auth.uid() and role = 'customer');
create policy "Profiles update by owner" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid() and role = public.current_user_role());
create policy "Admins manage profiles" on public.profiles for all using (public.is_coastx_admin()) with check (public.is_coastx_admin());
create policy "Locations publicly readable" on public.locations for select using (active or public.is_coastx_admin());
create policy "Categories publicly readable" on public.categories for select using (active or public.is_coastx_admin());
create policy "Partners read own application" on public.partners for select using (owner_id = auth.uid() or public.is_coastx_admin());
create policy "Users submit partner applications" on public.partners for insert with check (owner_id = auth.uid() and status = 'pending');
create policy "Partners read own documents" on public.partner_documents for select using (partner_id in (select id from public.partners where owner_id = auth.uid()) or public.is_coastx_admin());
create policy "Partners submit own documents" on public.partner_documents for insert with check (status = 'submitted' and partner_id in (select id from public.partners where owner_id = auth.uid()));
create policy "Approved experiences publicly readable" on public.experiences for select using (status = 'approved' or public.is_coastx_admin() or partner_id in (select id from public.partners where owner_id = auth.uid()));
create policy "Partners manage own experiences" on public.experiences for insert with check (partner_id in (select id from public.partners where owner_id = auth.uid() and status = 'approved'));
create policy "Partners update own draft experiences" on public.experiences for update using (partner_id in (select id from public.partners where owner_id = auth.uid())) with check (partner_id in (select id from public.partners where owner_id = auth.uid()) and status in ('draft', 'submitted', 'paused'));
create policy "Experience images follow experience visibility" on public.experience_images for select using (experience_id in (select id from public.experiences where status = 'approved' or partner_id in (select id from public.partners where owner_id = auth.uid())) or public.is_coastx_admin());
create policy "Experience schedules publicly readable" on public.experience_schedules for select using (experience_id in (select id from public.experiences where status = 'approved') or public.is_coastx_admin());
create policy "Partners manage own schedules" on public.experience_schedules for all using (experience_id in (select e.id from public.experiences e join public.partners p on p.id = e.partner_id where p.owner_id = auth.uid())) with check (experience_id in (select e.id from public.experiences e join public.partners p on p.id = e.partner_id where p.owner_id = auth.uid()));
create policy "Available slots publicly readable" on public.experience_time_slots for select using (not blocked or public.is_coastx_admin());
create policy "Partners manage own availability" on public.experience_time_slots for all using (experience_id in (select e.id from public.experiences e join public.partners p on p.id = e.partner_id where p.owner_id = auth.uid())) with check (experience_id in (select e.id from public.experiences e join public.partners p on p.id = e.partner_id where p.owner_id = auth.uid()));
create policy "Customers see own bookings" on public.bookings for select using (customer_id = auth.uid() or public.is_coastx_admin() or experience_id in (select e.id from public.experiences e join public.partners p on p.id = e.partner_id where p.owner_id = auth.uid()));
create policy "Customers see own participants" on public.booking_participants for select using (booking_id in (select id from public.bookings where customer_id = auth.uid()) or public.is_coastx_admin());
create policy "Customers see own payment status" on public.payments for select using (booking_id in (select id from public.bookings where customer_id = auth.uid()) or public.is_coastx_admin());
create policy "Published reviews public" on public.reviews for select using (status = 'published' or customer_id = auth.uid() or public.is_coastx_admin());
create policy "Customers add reviews for completed bookings" on public.reviews for insert with check (customer_id = auth.uid() and exists (select 1 from public.bookings b where b.id = booking_id and b.customer_id = auth.uid() and b.status = 'completed' and b.experience_id = experience_id));
create policy "Review images follow review visibility" on public.review_images for select using (review_id in (select id from public.reviews where status = 'published' or customer_id = auth.uid()) or public.is_coastx_admin());
create policy "Users manage own wishlist" on public.wishlists for all using (customer_id = auth.uid()) with check (customer_id = auth.uid());
create policy "Users manage own itineraries" on public.itineraries for all using (customer_id = auth.uid()) with check (customer_id = auth.uid());
create policy "Items belong to own itinerary" on public.itinerary_items for all using (itinerary_id in (select id from public.itineraries where customer_id = auth.uid())) with check (itinerary_id in (select id from public.itineraries where customer_id = auth.uid()));
create policy "Passport catalogue public" on public.passport_achievements for select using (true);
create policy "Users see own stamps" on public.user_achievements for select using (customer_id = auth.uid() or public.is_coastx_admin());
create policy "Active promo codes readable" on public.promo_codes for select using (active or public.is_coastx_admin());
create policy "Users see own promo usage" on public.promo_code_usage for select using (customer_id = auth.uid() or public.is_coastx_admin());
create policy "Verification badges public" on public.verification_badges for select using (true);
create policy "Partners see own payouts" on public.partner_payouts for select using (partner_id in (select id from public.partners where owner_id = auth.uid()) or public.is_coastx_admin());
create policy "Users see own notifications" on public.notifications for select using (recipient_id = auth.uid());
create policy "Users update own notifications" on public.notifications for update using (recipient_id = auth.uid()) with check (recipient_id = auth.uid());
create policy "Users create own support requests" on public.support_requests for insert with check (requester_id = auth.uid());
create policy "Users see own support requests" on public.support_requests for select using (requester_id = auth.uid() or public.is_coastx_admin());
create policy "Weather cache readable" on public.weather_cache for select using (expires_at > now() or public.is_coastx_admin());
create policy "Audit logs admin only" on public.audit_logs for select using (public.is_coastx_admin());
create policy "Admins manage partners" on public.partners for all using (public.is_coastx_admin()) with check (public.is_coastx_admin());
create policy "Admins manage partner documents" on public.partner_documents for all using (public.is_coastx_admin()) with check (public.is_coastx_admin());
create policy "Admins manage locations" on public.locations for all using (public.is_coastx_admin()) with check (public.is_coastx_admin());
create policy "Admins manage categories" on public.categories for all using (public.is_coastx_admin()) with check (public.is_coastx_admin());
create policy "Admins manage experiences" on public.experiences for all using (public.is_coastx_admin()) with check (public.is_coastx_admin());
create policy "Admins manage experience images" on public.experience_images for all using (public.is_coastx_admin()) with check (public.is_coastx_admin());
create policy "Admins manage experience schedules" on public.experience_schedules for all using (public.is_coastx_admin()) with check (public.is_coastx_admin());
create policy "Admins manage experience slots" on public.experience_time_slots for all using (public.is_coastx_admin()) with check (public.is_coastx_admin());
create policy "Admins manage reviews" on public.reviews for all using (public.is_coastx_admin()) with check (public.is_coastx_admin());
create policy "Admins manage review images" on public.review_images for all using (public.is_coastx_admin()) with check (public.is_coastx_admin());
create policy "Admins manage promo codes" on public.promo_codes for all using (public.is_coastx_admin()) with check (public.is_coastx_admin());
create policy "Admins manage verification badges" on public.verification_badges for all using (public.is_coastx_admin()) with check (public.is_coastx_admin());
create policy "Admins manage payouts" on public.partner_payouts for all using (public.is_coastx_admin()) with check (public.is_coastx_admin());
create policy "Admins manage support requests" on public.support_requests for all using (public.is_coastx_admin()) with check (public.is_coastx_admin());
create policy "Admins insert audit logs" on public.audit_logs for insert with check (public.is_coastx_admin());

create or replace function public.partner_transition_booking(p_booking_id uuid, p_next_status public.booking_status)
returns void language plpgsql security definer set search_path = public
as $$
declare
  v_current_status public.booking_status;
begin
  if p_next_status not in ('checked_in', 'completed', 'cancelled') then
    raise exception 'This booking status transition is not allowed';
  end if;
  select b.status into v_current_status
    from public.bookings b
    join public.experiences e on e.id = b.experience_id
    join public.partners p on p.id = e.partner_id
    where b.id = p_booking_id and p.owner_id = auth.uid()
    for update of b;
  if not found then raise exception 'Booking not found for this partner'; end if;
  if not ((v_current_status = 'confirmed' and p_next_status in ('checked_in', 'cancelled')) or (v_current_status = 'checked_in' and p_next_status in ('completed', 'cancelled'))) then
    raise exception 'This booking status transition is not allowed';
  end if;
  update public.bookings set status = p_next_status, updated_at = now() where id = p_booking_id;
end;
$$;

revoke all on function public.reserve_experience_slot(uuid, uuid, smallint, smallint, text, text, text, text) from public, anon;
grant execute on function public.reserve_experience_slot(uuid, uuid, smallint, smallint, text, text, text, text) to authenticated;
revoke all on function public.partner_transition_booking(uuid, public.booking_status) from public, anon;
grant execute on function public.partner_transition_booking(uuid, public.booking_status) to authenticated;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$ begin insert into public.profiles(id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', '')); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();