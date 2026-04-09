import express from 'express'
import process from 'process'
import { createClient } from '@supabase/supabase-js'
import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'

const app = express()
app.use(express.json({ limit: '10mb' }))

const NOTION_TOKEN = process.env.NOTION_TOKEN || ''
const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_KEY = process.env.SUPABASE_KEY || ''
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'blog-media'
const SUPABASE_BLOGS_TABLE = process.env.SUPABASE_BLOGS_TABLE || 'blogs'
const USE_SIGNED_URLS = process.env.USE_SIGNED_URLS === 'true' // 'true' for private buckets
const SIGNED_URL_EXPIRES_IN = parseInt(process.env.SIGNED_URL_EXPIRES_IN || '31536000') // 1 year default

if (!NOTION_TOKEN) {
  console.warn('Warning: NOTION_TOKEN not set. Endpoint will fail without it.')
}
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('Warning: SUPABASE_URL or SUPABASE_KEY not set. Image upload / DB save will be skipped.')
}

const supabase = (SUPABASE_URL && SUPABASE_KEY) ? createClient(SUPABASE_URL, SUPABASE_KEY) : null
const notion = new Client({ auth: NOTION_TOKEN })
const n2m = new NotionToMarkdown({ notionClient: notion })

function extractNotionPageId(url) {
  // Extract any sequence of 32+ hex characters (with or without dashes)
  // Notion URLs can have various formats
  const parts = url.split('/').pop().split('?')[0].split('#')[0]
  
  // Try to find hex characters and dashes
  const hexMatch = parts.match(/([0-9a-fA-F-]+)$/)
  if (!hexMatch) return null
  
  // Remove all dashes and non-hex characters
  const clean = hexMatch[1].replace(/[^0-9a-fA-F]/g, '')
  
  // Must be exactly 32 hex characters
  if (clean.length !== 32) return null
  
  // Format as proper UUID: 8-4-4-4-12
  return `${clean.slice(0, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}-${clean.slice(16, 20)}-${clean.slice(20, 32)}`
}

async function downloadToBuffer(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  const arrayBuffer = await res.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const contentType = res.headers.get('content-type') || 'application/octet-stream'
  return { buffer, contentType }
}

function extFromContentType(ct) {
  if (!ct) return ''
  if (ct.includes('jpeg') || ct.includes('jpg')) return 'jpg'
  if (ct.includes('png')) return 'png'
  if (ct.includes('gif')) return 'gif'
  if (ct.includes('webp')) return 'webp'
  return ''
}

app.post('/api/import/notion', async (req, res) => {
  const { url, category_id } = req.body || {}
  if (!url) return res.status(400).json({ error: 'Missing url in request body' })

  const pageId = extractNotionPageId(url)
  if (!pageId) return res.status(400).json({ error: 'Could not extract Notion page id from URL' })

  try {
    // Convert Notion page to markdown blocks
    const mdBlocks = await n2m.pageToMarkdown(pageId)
    const mdResult = n2m.toMarkdownString(mdBlocks)
    
    // toMarkdownString returns an object with 'parent' property in newer versions
    const mdString = typeof mdResult === 'string' ? mdResult : (mdResult?.parent || '')

    // Find image URLs in the blocks (naive search)
    const imageUrls = new Set()
    for (const b of mdBlocks) {
      try {
        if (b && b.type === 'image') {
          const img = b.image
          if (img && img.type === 'external' && img.external && img.external.url) imageUrls.add(img.external.url)
          if (img && img.type === 'file' && img.file && img.file.url) imageUrls.add(img.file.url)
        }
      } catch (e) {
        // ignore parsing errors for a block
      }
    }

    const replacements = {}

    if (supabase && imageUrls.size > 0) {
      for (const imageUrl of imageUrls) {
        try {
          const { buffer, contentType } = await downloadToBuffer(imageUrl)
          const ext = extFromContentType(contentType) || 'bin'
          const filename = `notion/${pageId}/${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`
          const { data, error: uploadErr } = await supabase.storage.from(SUPABASE_BUCKET).upload(filename, buffer, {
            contentType,
            upsert: false
          })
          if (uploadErr) {
            console.warn('Supabase upload error', uploadErr)
            continue
          }
          
          // Get URL: use signed URL for private buckets, public URL for public buckets
          let finalUrl = null
          if (USE_SIGNED_URLS) {
            const { data: signedData, error: signedErr } = await supabase.storage
              .from(SUPABASE_BUCKET)
              .createSignedUrl(filename, SIGNED_URL_EXPIRES_IN)
            if (signedErr) {
              console.warn('Signed URL error', signedErr)
            } else if (signedData && signedData.signedUrl) {
              finalUrl = signedData.signedUrl
            }
          } else {
            const { data: pub } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(filename)
            if (pub && pub.publicUrl) {
              finalUrl = pub.publicUrl
            }
          }
          
          if (finalUrl) {
            replacements[imageUrl] = finalUrl
          }
        } catch (imgErr) {
          console.warn('Failed to download/upload image', imageUrl, imgErr.message)
        }
      }
    }

    let finalMarkdown = mdString
    for (const [orig, repl] of Object.entries(replacements)) {
      finalMarkdown = finalMarkdown.split(orig).join(repl)
    }

    // Derive a title & slug (very simple): first heading or page id
    const titleMatch = finalMarkdown.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1].trim() : `Notion import ${Date.now()}`
    let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const excerpt = finalMarkdown.split('\n').find((l) => l.trim().length > 0) || ''

    let saved = null
    let wasUpdate = false
    let preparedData = null
    
    if (supabase) {
      try {
        // Check if blog with this Notion page ID already exists
        const { data: existing } = await supabase
          .from(SUPABASE_BLOGS_TABLE)
          .select('id, slug, title, status, notion_page_id, category_id')
          .eq('notion_page_id', pageId)
          .single()

        const blogData = {
          title,
          slug,
          excerpt: excerpt.slice(0, 240),
          content_md: finalMarkdown,
          source: 'notion',
          notion_page_id: pageId
        }
        
        // Add category_id if provided
        if (category_id) {
          blogData.category_id = category_id
        }

        if (existing) {
          // Update existing blog - keep existing slug and update content
          wasUpdate = true
          blogData.slug = existing.slug // Keep the original slug
          
          const { data: updateData, error: updateErr } = await supabase
            .from(SUPABASE_BLOGS_TABLE)
            .update(blogData)
            .eq('id', existing.id)
            .select()
            .single()
          
          if (updateErr) {
            console.warn('Supabase update error', updateErr)
          } else {
            saved = updateData
          }
        } else {
          // NEW import - don't save yet, return prepared data for client to review
          preparedData = {
            ...blogData,
            status: 'draft'
          }
        }
      } catch (dbErr) {
        console.warn('DB operation failed', dbErr.message)
      }
    }

    return res.json({ 
      success: true, 
      message: wasUpdate ? 'Content updated from Notion' : 'Notion page converted', 
      saved: wasUpdate ? saved : null,
      preparedData: preparedData,
      isUpdate: wasUpdate
    })
  } catch (err) {
    console.error('Import failed', err)
    return res.status(500).json({ error: err.message || 'Import failed' })
  }
})

const port = process.env.PORT || 5179
app.listen(port, () => console.log(`Notion import server listening on http://localhost:${port}`))
