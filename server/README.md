# Server — Notion Import API

This folder contains a small Express server that provides a Notion import endpoint for the portfolio admin UI.

## Features
- POST `/api/import/notion` — converts a Notion page to Markdown, downloads images, uploads to Supabase Storage, and saves a draft blog post to the database.
- Uses `@notionhq/client` + `notion-to-md` for conversion.
- Uses `@supabase/supabase-js` for storage + database operations.

## Setup

### 1. Install dependencies
From the project root:
```bash
npm install
```

### 2. Create Supabase project and resources
1. Go to https://app.supabase.com and create a new project.
2. In **Settings → API**, copy:
   - Project URL (for `SUPABASE_URL`)
   - Service Role key (for `SUPABASE_KEY` — keep secret, server-side only)
3. In **Storage**, create a bucket named `blog-media` (or your preferred name).
   - Set to public if you want direct URL access, or private and use signed URLs (recommended for production).
4. In **SQL Editor**, run the migration script:
   ```
   server/migrations/001_create_blogs_table.sql
   ```
   This creates the `blogs`, `categories`, `tags`, and `blog_tags` tables with RLS policies.

### 3. Create a Notion integration
1. Go to https://www.notion.so/my-integrations and create a new integration.
2. Copy the **Internal Integration Token** (for `NOTION_TOKEN`).
3. Share the Notion pages you want to import with your integration:
   - Open the page in Notion → click "..." → Add connections → select your integration.

### 4. Set environment variables
Create a `.env` file in the project root (copy from `.env.example`):
```bash
NOTION_TOKEN=secret_your_notion_integration_token
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your_service_role_key
SUPABASE_BUCKET=blog-media
SUPABASE_BLOGS_TABLE=blogs
PORT=5179
```

**Important:** Never commit `.env` to version control. The `.env.example` is safe to commit.

### 5. Run the server
Option A — set env vars in shell (PowerShell):
```powershell
$env:NOTION_TOKEN = "your_token"
$env:SUPABASE_URL = "https://your-project.supabase.co"
$env:SUPABASE_KEY = "your_key"
npm run start:server
```

Option B — use dotenv (recommended):
```bash
npm install dotenv --save
node -r dotenv/config server/index.js
```

Or add to `package.json` scripts:
```json
"scripts": {
  "start:server": "node -r dotenv/config server/index.js"
}
```

The server starts on port 5179 (or `PORT` from env).

### 6. Run the frontend (in another terminal)
```bash
npm run dev
```
Vite proxies `/api/*` to `http://localhost:5179` (see `vite.config.js`).

### 7. Test the import
- Open http://localhost:5174/admin
- Paste a Notion page URL (ensure the page is shared with your integration).
- Click "Import".
- The server converts the page, uploads images to Supabase, and inserts a draft row into the `blogs` table.

## API Reference

### POST /api/import/notion
**Request body:**
```json
{
  "url": "https://www.notion.so/your-workspace/Page-Title-UUID"
}
```

**Response (success):**
```json
{
  "success": true,
  "message": "Imported Notion page",
  "saved": {
    "id": "uuid",
    "title": "Page Title",
    "slug": "page-title",
    "excerpt": "...",
    "content_md": "...",
    "status": "draft",
    "source": "notion",
    "notion_page_id": "UUID",
    "created_at": "2025-11-08T..."
  }
}
```

**Response (error):**
```json
{
  "error": "Error message"
}
```

## Security Notes
- Use the **service role key** only on the server. Never expose it in the browser.
- For production, prefer:
  - Supabase Edge Functions (serverless, secrets managed by Supabase)
  - or deploy Express behind a secure host (Vercel, Fly, Render) with env secrets
- Enable HTTPS and restrict CORS if deploying publicly.
- Use signed URLs for private storage buckets (see code comments in `server/index.js`).

## File Structure
```
server/
├── index.js                    # Express server with /api/import/notion endpoint
├── migrations/
│   └── 001_create_blogs_table.sql  # Supabase migration to create tables
└── README.md                   # This file
```

## Troubleshooting
- **"NOTION_TOKEN not set"**: Ensure env var is set before running the server.
- **"Could not extract Notion page id from URL"**: Check the URL format and ensure it's a valid Notion page link.
- **Supabase upload error**: Verify bucket exists and the service key has storage permissions. Check bucket privacy settings.
- **DB insert error**: Ensure the `blogs` table exists (run migration) and the service key has insert permissions.
- **Images not appearing**: If using a private bucket, switch to signed URLs (see code comments).

## Next Steps
- Add Word (.docx) import endpoint (mammoth.js + turndown).
- Implement Notion OAuth for multi-user access.
- Add auth middleware to protect `/api/import/*` endpoints.
- Deploy as Supabase Edge Function or serverless endpoint.

---

For questions or issues, check the main project README or open an issue in the repo.
