-- Separate photo for driver cards (home page and Team page).
-- Falls back to image_url when empty, so existing drivers are unaffected.
alter table public.drivers add column if not exists card_image_url text;
