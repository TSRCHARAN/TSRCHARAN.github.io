-- Fix RLS policies to allow inserts from client (temporary - for development)
-- For production, you should protect these with auth or move to server-side

-- Allow inserts on categories (temporary - add auth later)
drop policy if exists "Allow public insert categories" on categories;
create policy "Allow public insert categories"
  on categories
  for insert
  with check (true);

-- Allow updates on categories (temporary - add auth later)
drop policy if exists "Allow public update categories" on categories;
create policy "Allow public update categories"
  on categories
  for update
  using (true);

-- Allow deletes on categories (temporary - add auth later)
drop policy if exists "Allow public delete categories" on categories;
create policy "Allow public delete categories"
  on categories
  for delete
  using (true);

-- Allow updates on blogs (for publish functionality)
drop policy if exists "Allow public update blogs" on blogs;
create policy "Allow public update blogs"
  on blogs
  for update
  using (true);

-- Allow deletes on blogs
drop policy if exists "Allow public delete blogs" on blogs;
create policy "Allow public delete blogs"
  on blogs
  for delete
  using (true);

-- NOTE: These policies allow anyone to modify data. 
-- For production, replace 'true' with auth checks like:
--   auth.uid() is not null  (for any authenticated user)
-- or
--   auth.jwt() ->> 'role' = 'admin'  (for admin users only)
