CREATE POLICY "Users can select their own items"
ON public.items
FOR SELECT
USING (auth.uid() = uuid);

CREATE POLICY "Users can insert their own items"
ON public.items
FOR INSERT
WITH CHECK (auth.uid() = uuid);

CREATE POLICY "Users can update their own items"
ON public.items
FOR UPDATE
WITH CHECK (auth.uid() = uuid);

CREATE POLICY "Users can delete their own items"
ON public.items
FOR DELETE
USING (auth.uid() = uuid);