create extension if not exists pgcrypto;

create table if not exists users (
    id uuid primary key default gen_random_uuid(),
    username text not null unique,
    email text not null unique,
    password_hash text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists game_saves (
    user_id uuid primary key references users(id) on delete cascade,
    save_data jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists player_stats (
    user_id uuid primary key references users(id) on delete cascade,
    high_score integer not null default 0,
    total_kills integer not null default 0,
    best_level integer not null default 1,
    runs_played integer not null default 0,
    updated_at timestamptz not null default now()
);

create table if not exists public_player_stats (
    username text primary key,
    high_score integer not null default 0,
    total_kills integer not null default 0,
    best_level integer not null default 1,
    runs_played integer not null default 0,
    updated_at timestamptz not null default now()
);

create index if not exists idx_users_email on users (lower(email));
create index if not exists idx_users_username on users (lower(username));
create index if not exists idx_player_stats_high_score on player_stats (high_score desc);
create index if not exists idx_player_stats_total_kills on player_stats (total_kills desc);
create index if not exists idx_public_player_stats_high_score on public_player_stats (high_score desc);
create index if not exists idx_public_player_stats_total_kills on public_player_stats (total_kills desc);

create or replace function set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists users_set_updated_at on users;
create trigger users_set_updated_at
before update on users
for each row execute function set_updated_at();

drop trigger if exists game_saves_set_updated_at on game_saves;
create trigger game_saves_set_updated_at
before update on game_saves
for each row execute function set_updated_at();

drop trigger if exists player_stats_set_updated_at on player_stats;
create trigger player_stats_set_updated_at
before update on player_stats
for each row execute function set_updated_at();

drop trigger if exists public_player_stats_set_updated_at on public_player_stats;
create trigger public_player_stats_set_updated_at
before update on public_player_stats
for each row execute function set_updated_at();
