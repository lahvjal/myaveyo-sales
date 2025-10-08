-- Enable extensions we rely on
create extension if not exists pgcrypto; -- for gen_random_uuid

-- Job queue for geocoding
create table if not exists public.geocode_jobs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,
  address text not null,
  status text not null,
  attempts int not null default 0,
  created_at timestamptz not null default now(),
  processed_at timestamptz,
  last_error text
);
create index if not exists geocode_jobs_project_id_idx on public.geocode_jobs (project_id);
create index if not exists geocode_jobs_processed_idx on public.geocode_jobs (processed_at);

-- Helper: compute PTO (Complete / Active)
create or replace function public.compute_is_pto(p_status text)
returns boolean language sql immutable as $$
  select lower(coalesce(p_status,'')) in ('complete','active');
$$;

-- Minimal URL encoder for spaces/commas (safe for Mapbox)
create or replace function public.url_encode_basic(p text)
returns text language sql immutable as $$
  select replace(replace(replace(coalesce(p,''),' ','%20'), '#', '%23'), ',', '%2C');
$$;

-- Trigger to enqueue geocoding jobs and keep project_locations in sync without network calls
create or replace function public.trg_enqueue_geocode_jobs()
returns trigger as $$
declare
  v_is_pto boolean;
  v_address text;
begin
  v_is_pto := public.compute_is_pto(new.status);
  v_address := trim(coalesce(new.raw_payload->>'address','') || ', ' || coalesce(new.raw_payload->>'city','') || ', ' || coalesce(new.raw_payload->>'state','') || ' ' || coalesce(new.raw_payload->>'zip',''));

  if v_is_pto then
    -- enqueue job if we have an address
    if v_address is not null and length(v_address) > 5 then
      insert into public.geocode_jobs(project_id, address, status)
      values (new.id, v_address, new.status);
    end if;
  else
    -- not PTO anymore: remove from locations
    delete from public.project_locations where project_id = new.id;
  end if;
  return new;
end;
$$ language plpgsql;

-- Attach trigger to podio_data (read-only on that table; only writes to jobs/locations)
drop trigger if exists trg_podio_enqueue_geocode on public.podio_data;
create trigger trg_podio_enqueue_geocode
after insert or update of status, raw_payload on public.podio_data
for each row execute function public.trg_enqueue_geocode_jobs();
