-- Complete RLS policies for development
-- WARNING: These allow public access. Add auth before production!

-- BLOGS TABLE POLICIES
drop policy if exists "Allow public read blogs" on blogs;
create policy "Allow public read blogs"
  on blogs
  for select
  using (true);

drop policy if exists "Allow public insert blogs" on blogs;
create policy "Allow public insert blogs"
  on blogs
  for insert
  with check (true);

drop policy if exists "Allow public update blogs" on blogs;
create policy "Allow public update blogs"
  on blogs
  for update
  using (true)
  with check (true);

drop policy if exists "Allow public delete blogs" on blogs;
create policy "Allow public delete blogs"
  on blogs
  for delete
  using (true);

-- CATEGORIES TABLE POLICIES
drop policy if exists "Allow public read categories" on categories;
create policy "Allow public read categories"
  on categories
  for select
  using (true);

drop policy if exists "Allow public insert categories" on categories;
create policy "Allow public insert categories"
  on categories
  for insert
  with check (true);

drop policy if exists "Allow public update categories" on categories;
create policy "Allow public update categories"
  on categories
  for update
  using (true)
  with check (true);

drop policy if exists "Allow public delete categories" on categories;
create policy "Allow public delete categories"
  on categories
  for delete
  using (true);

-- TAGS TABLE POLICIES
drop policy if exists "Allow public read tags" on tags;
create policy "Allow public read tags"
  on tags
  for select
  using (true);

drop policy if exists "Allow public insert tags" on tags;
create policy "Allow public insert tags"
  on tags
  for insert
  with check (true);

drop policy if exists "Allow public update tags" on tags;
create policy "Allow public update tags"
  on tags
  for update
  using (true)
  with check (true);

drop policy if exists "Allow public delete tags" on tags;
create policy "Allow public delete tags"
  on tags
  for delete
  using (true);

-- BLOG_TAGS TABLE POLICIES
drop policy if exists "Allow public read blog_tags" on blog_tags;
create policy "Allow public read blog_tags"
  on blog_tags
  for select
  using (true);

drop policy if exists "Allow public insert blog_tags" on blog_tags;
create policy "Allow public insert blog_tags"
  on blog_tags
  for insert
  with check (true);

drop policy if exists "Allow public delete blog_tags" on blog_tags;
create policy "Allow public delete blog_tags"
  on blog_tags
  for delete
  using (true);
