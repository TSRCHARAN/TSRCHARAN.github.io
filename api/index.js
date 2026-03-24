import express from 'express'
import process from 'process'
import { createClient } from '@supabase/supabase-js'
import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'

const app = express()
app.use(express.json({ limit: '10mb' }))

// CORS headers for Vercel serverless
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

const NOTION_TOKEN = process.env.NOTION_TOKEN || ''
const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_KEY = process.env.SUPABASE_KEY || ''
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'blog-media'
const SUPABASE_BLOGS_TABLE = process.env.SUPABASE_BLOGS_TABLE || 'blogs'
const USE_SIGNED_URLS = process.env.USE_SIGNED_URLS === 'true'
const SIGNED_URL_EXPIRES_IN = parseInt(process.env.SIGNED_URL_EXPIRES_IN || '31536000')

if (!NOTION_TOKEN) {
  console.warn('Warning: NOTION_TOKEN not set.')
}
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('Warning: SUPABASE_URL or SUPABASE_KEY not set.')
} else {
  console.log('✅ Supabase configured:', SUPABASE_URL)
}

const supabase = (SUPABASE_URL && SUPABASE_KEY) ? createClient(SUPABASE_URL, SUPABASE_KEY) : null
const notion = new Client({ auth: NOTION_TOKEN })
const n2m = new NotionToMarkdown({ notionClient: notion })

function extractNotionPageId(url) {
  const parts = url.split('/').pop().split('?')[0].split('#')[0]
  const hexMatch = parts.match(/([0-9a-fA-F-]+)$/)
  if (!hexMatch) return null
  const clean = hexMatch[1].replace(/[^0-9a-fA-F]/g, '')
  if (clean.length !== 32) return null
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
    const mdBlocks = await n2m.pageToMarkdown(pageId)
    const mdResult = n2m.toMarkdownString(mdBlocks)
    const mdString = typeof mdResult === 'string' ? mdResult : (mdResult?.parent || '')

    const imageUrls = new Set()
    for (const b of mdBlocks) {
      try {
        if (b && b.type === 'image') {
          const img = b.image
          if (img && img.type === 'external' && img.external && img.external.url) imageUrls.add(img.external.url)
          if (img && img.type === 'file' && img.file && img.file.url) imageUrls.add(img.file.url)
        }
      } catch (e) {
        // ignore
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
            console.warn('Upload error', uploadErr)
            continue
          }
          
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
          console.warn('Failed to upload image', imageUrl, imgErr.message)
        }
      }
    }

    let finalMarkdown = mdString
    for (const [orig, repl] of Object.entries(replacements)) {
      finalMarkdown = finalMarkdown.split(orig).join(repl)
    }

    const titleMatch = finalMarkdown.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1].trim() : `Notion import ${Date.now()}`
    let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const excerpt = finalMarkdown.split('\n').find((l) => l.trim().length > 0) || ''

    let saved = null
    let wasUpdate = false
    let preparedData = null
    
    if (supabase) {
      try {
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
        
        if (category_id) {
          blogData.category_id = category_id
        }

        if (existing) {
          wasUpdate = true
          blogData.slug = existing.slug
          
          const { data: updateData, error: updateErr } = await supabase
            .from(SUPABASE_BLOGS_TABLE)
            .update(blogData)
            .eq('id', existing.id)
            .select()
            .single()
          
          if (updateErr) {
            console.warn('Update error', updateErr)
          } else {
            saved = updateData
          }
        } else {
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

// Local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5179
  app.listen(port, () => console.log(`Server running on port ${port}`))
}

export default app
