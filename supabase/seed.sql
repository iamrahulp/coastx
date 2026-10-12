insert into public.locations(name, slug) values
('Mangaluru', 'mangaluru'), ('Sasihithlu', 'sasihithlu'), ('Mulki', 'mulki'), ('Surathkal', 'surathkal'), ('Moodbidri', 'moodbidri'), ('Bantwal', 'bantwal'), ('Ullal', 'ullal')
on conflict (slug) do nothing;

insert into public.categories(name, slug, sort_order) values
('Water', 'water', 1), ('Adventure', 'adventure', 2), ('Nature', 'nature', 3), ('Food', 'food', 4), ('Culture', 'culture', 5), ('Local life', 'local-life', 6), ('Wellness', 'wellness', 7), ('Creative', 'creative', 8), ('Romantic', 'romantic', 9), ('Family', 'family', 10), ('Night experiences', 'night-experiences', 11), ('CoastX Originals', 'coastx-originals', 12)
on conflict (slug) do nothing;

insert into public.promo_codes(code, discount_type, discount_value, minimum_subtotal_paise, maximum_discount_paise, usage_limit)
values ('WELCOME20', 'percentage', 20, 100000, 50000, 500), ('WEEKEND10', 'percentage', 10, 120000, 30000, 500), ('SURF15', 'percentage', 15, 100000, 40000, 250)
on conflict (code) do nothing;

insert into public.passport_achievements(name, slug, description, experience_threshold) values
('Coast Explorer', 'coast-explorer', 'Complete five coastal experiences.', 5),
('Coast Adventurer', 'coast-adventurer', 'Complete ten coastal experiences.', 10),
('Coast Legend', 'coast-legend', 'Complete twenty-five coastal experiences.', 25)
on conflict (slug) do nothing;

-- Sample operator identities, demo customers, bookings, reviews and full experience content are local app fixtures.
-- They are explicitly fictional and are not inserted into production Supabase by default.
-- Create real partner and customer accounts through Supabase Auth and the reviewed onboarding flow.