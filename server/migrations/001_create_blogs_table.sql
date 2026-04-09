-- Migration: Create blogs table for storing imported Notion/Word blog posts
-- Run this in your Supabase SQL Editor

-- Enable UUID generation (if not already enabled)
create extension if not exists "pgcrypto";

-- Create blogs table
create table if not exists blogs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  content_md text,
  content_html text,
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  source text,  -- 'notion', 'word', 'manual', etc.
  notion_page_id text,
  category_id uuid,  -- optional: reference to categories table (add later)
  cover_image_url text,
  author_id uuid,  -- optional: reference to auth.users or custom users table
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index on slug for fast lookups
create index if not exists idx_blogs_slug on blogs(slug);

-- Create index on status for filtering published posts
create index if not exists idx_blogs_status on blogs(status);

-- Enable Row Level Security
alter table blogs enable row level security;

-- Policy: Allow public read access to published blogs
create policy "Allow public select published blogs"
  on blogs
  for select
  using (status = 'published');

-- Policy: Allow service role full access (for server-side operations)
-- Note: The service role key bypasses RLS, so this policy is for clarity/documentation
-- If you want to allow authenticated users to manage their own drafts, add policies here

-- Optional: Create updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on blogs
  for each row
  execute function update_updated_at_column();

-- Optional: Create categories table (for blog organization)
create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  icon text,  -- emoji or icon name
  created_at timestamptz default now()
);

create index if not exists idx_categories_slug on categories(slug);

-- Enable RLS on categories
alter table categories enable row level security;

-- Policy: Allow public read access to categories
create policy "Allow public select categories"
  on categories
  for select
  using (true);

-- Optional: Create tags table and junction table for many-to-many relationship
create table if not exists tags (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  slug text unique not null,
  created_at timestamptz default now()
);

create table if not exists blog_tags (
  blog_id uuid references blogs(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (blog_id, tag_id)
);

-- Enable RLS on tags
alter table tags enable row level security;

create policy "Allow public select tags"
  on tags
  for select
  using (true);

-- Enable RLS on blog_tags
alter table blog_tags enable row level security;

create policy "Allow public select blog_tags"
  on blog_tags
  for select
  using (true);

-- Success message
do $$
begin
  raise notice 'Migration complete: blogs, categories, tags tables created with RLS policies.';
end $$;
