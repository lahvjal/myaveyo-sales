-- Cache table for geocoded project addresses
create table if not exists public.project_locations (
  project_id uuid not null,
  address_hash text not null,
  lat double precision not null,
  lng double precision not null,
  updated_at timestamptz not null default now(),
  primary key (project_id, address_hash)
);

-- Helpful index for spatial queries (simple B-Tree on lat/lng for now)
create index if not exists project_locations_lat_idx on public.project_locations (lat);
create index if not exists project_locations_lng_idx on public.project_locations (lng);
