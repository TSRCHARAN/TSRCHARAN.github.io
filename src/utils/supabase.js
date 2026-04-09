// Client-side Supabase helper for fetching published blogs
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Only create client if env vars are set (optional for dev with local data)
export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

export async function fetchPublishedBlogs() {
  if (!supabase) return []
  
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.warn('Supabase fetch error:', error)
      return []
    }
    
    return data || []
  } catch (err) {
    console.warn('Failed to fetch blogs from Supabase:', err)
    return []
  }
}

export async function fetchBlogBySlug(slug, requirePublished = true) {
  if (!supabase) return null
  
  try {
    let query = supabase
      .from('blogs')
      .select('*, categories(slug, name)')
      .eq('slug', slug)
    
    // Only filter by published status if required
    if (requirePublished) {
      query = query.eq('status', 'published')
    }
    
    const { data, error } = await query.single()
    
    if (error) {
      console.warn(`Error fetching blog by slug ${slug}:`, error)
      return null
    }
    
    return data
  } catch (err) {
    console.error(`Exception fetching blog by slug ${slug}:`, err)
    return null
  }
}

export async function fetchBlogsByCategorySlug(slug) {
  if (!supabase) return []
  
  try {
    // First find the category ID
    const { data: category, error: catError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single()
      
    if (catError || !category) {
      console.warn(`Category not found: ${slug}`, catError)
      return []
    }
    
    // Then fetch blogs
    const { data: blogs, error: blogError } = await supabase
      .from('blogs')
      .select('*')
      .eq('category_id', category.id)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      
    if (blogError) {
      console.warn(`Error fetching blogs for category ${slug}:`, blogError)
      return []
    }
    
    return blogs || []
  } catch (err) {
    console.error(`Exception fetching blogs by category ${slug}:`, err)
    return []
  }
}

export async function fetchBlogsByTag(tagName) {
    if (!supabase) return []

    try {
        // First find the tag ID
        const { data: tag, error: tagError } = await supabase
            .from('tags')
            .select('id')
            .eq('name', tagName)
            .single()

        if (tagError || !tag) {
            console.warn(`Tag not found: ${tagName}`, tagError)
            return []
        }

        // Then fetch blog_tags
        const { data: blogTags, error: btError } = await supabase
            .from('blog_tags')
            .select('blog_id')
            .eq('tag_id', tag.id)

        if (btError || !blogTags || blogTags.length === 0) {
            return []
        }

        const blogIds = blogTags.map(bt => bt.blog_id)

        // Then fetch blogs
        const { data: blogs, error: blogError } = await supabase
            .from('blogs')
            .select('*')
            .in('id', blogIds)
            .eq('status', 'published')
            .order('created_at', { ascending: false })

        if (blogError) {
            console.warn(`Error fetching blogs for tag ${tagName}:`, blogError)
            return []
        }

        return blogs || []
    } catch (err) {
        console.error(`Exception fetching blogs by tag ${tagName}:`, err)
        return []
    }
}


export async function fetchCategories() {
  if (!supabase) return []
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (error) {
      console.warn('Supabase fetch error:', error)
      return []
    }
    
    return data || []
  } catch (err) {
    console.warn('Failed to fetch categories from Supabase:', err)
    return []
  }
}
