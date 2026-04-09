-- Migration: Update RLS policies for tags and blog_tags tables
-- This allows INSERT, UPDATE, DELETE operations on tags and blog_tags
-- Run this in your Supabase SQL Editor

-- Drop ALL existing policies for tags
drop policy if exists "Allow public select tags" on tags;
drop policy if exists "Allow public read tags" on tags;
drop policy if exists "Allow public insert tags" on tags;
drop policy if exists "Allow public update tags" on tags;
drop policy if exists "Allow public delete tags" on tags;

-- Drop ALL existing policies for blog_tags
drop policy if exists "Allow public select blog_tags" on blog_tags;
drop policy if exists "Allow public read blog_tags" on blog_tags;
drop policy if exists "Allow public insert blog_tags" on blog_tags;
drop policy if exists "Allow public update blog_tags" on blog_tags;
drop policy if exists "Allow public delete blog_tags" on blog_tags;

-- Drop ALL existing policies for blogs
drop policy if exists "Allow public select published blogs" on blogs;
drop policy if exists "Allow public read blogs" on blogs;
drop policy if exists "Allow public insert blogs" on blogs;
drop policy if exists "Allow public update blogs" on blogs;
drop policy if exists "Allow public delete blogs" on blogs;

-- Drop ALL existing policies for categories
drop policy if exists "Allow public select categories" on categories;
drop policy if exists "Allow public read categories" on categories;
drop policy if exists "Allow public insert categories" on categories;
drop policy if exists "Allow public update categories" on categories;
drop policy if exists "Allow public delete categories" on categories;

-- Create comprehensive policies for tags table
create policy "Allow public read tags"
  on tags
  for select
  using (true);

create policy "Allow public insert tags"
  on tags
  for insert
  with check (true);

create policy "Allow public update tags"
  on tags
  for update
  using (true);

create policy "Allow public delete tags"
  on tags
  for delete
  using (true);

-- Create comprehensive policies for blog_tags table
create policy "Allow public read blog_tags"
  on blog_tags
  for select
  using (true);

create policy "Allow public insert blog_tags"
  on blog_tags
  for insert
  with check (true);

create policy "Allow public update blog_tags"
  on blog_tags
  for update
  using (true);

create policy "Allow public delete blog_tags"
  on blog_tags
  for delete
  using (true);

-- Create comprehensive policies for blogs table
create policy "Allow public read blogs"
  on blogs
  for select
  using (true);

create policy "Allow public insert blogs"
  on blogs
  for insert
  with check (true);

create policy "Allow public update blogs"
  on blogs
  for update
  using (true);

create policy "Allow public delete blogs"
  on blogs
  for delete
  using (true);

-- Create comprehensive policies for categories table
create policy "Allow public read categories"
  on categories
  for select
  using (true);

create policy "Allow public insert categories"
  on categories
  for insert
  with check (true);

create policy "Allow public update categories"
  on categories
  for update
  using (true);

create policy "Allow public delete categories"
  on categories
  for delete
  using (true);

-- Success message
do $$
begin
  raise notice 'Migration complete: RLS policies updated for full CRUD access on all tables.';
  raise notice 'WARNING: These policies allow public access - replace with proper auth policies in production!';
end $$;
