create table if not exists api_tokens (
  id bigint primary key generated always as identity,
  uuid uuid not null,
  title text not null,
  token text not null unique,
  created timestamptz default now()
);

CREATE POLICY "Users can select their own api tokens"
ON public.api_tokens
FOR SELECT
USING (auth.uid() = uuid);

CREATE POLICY "Users can insert their own api tokens"
ON public.api_tokens
FOR INSERT
WITH CHECK (auth.uid() = uuid);

CREATE POLICY "Users can update their own api tokens"
ON public.api_tokens
FOR UPDATE
WITH CHECK (auth.uid() = uuid);

CREATE POLICY "Users can delete their own api tokens"
ON public.api_tokens
FOR DELETE
USING (auth.uid() = uuid);