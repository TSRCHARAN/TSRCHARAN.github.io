// Client-side helper that calls the backend Notion import endpoint.
// NOTE: Notion block -> Markdown conversion must happen on the server (requires Notion API token or OAuth).

export default async function importNotionPage(notionUrl, categoryId = null) {
  // Use absolute URL if VITE_API_URL is set, otherwise use relative path
  const baseUrl = import.meta.env.VITE_API_URL || ''
  const endpoint = baseUrl ? `${baseUrl}/api/import/notion` : '/api/import/notion'

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: notionUrl, category_id: categoryId })
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Notion import failed')
  }

  return res.json()
}
