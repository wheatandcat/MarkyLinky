create table if not exists items (
  id bigint primary key generated always as identity,
  uuid uuid not null,
  title text not null,
  url text not null,
  favIconUrl text,
  created timestamptz default now()
);