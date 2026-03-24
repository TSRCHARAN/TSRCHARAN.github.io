import { useState, useEffect } from 'react'
import importNotionPage from '../utils/notionImport'
import { supabase } from '../utils/supabase'
import Modal from '../components/Modal'

export default function Admin() {
  const [activeTab, setActiveTab] = useState('import') // import, blogs, categories
  const [loading, setLoading] = useState(false)
  
  // Modal state
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info', onConfirm: null, showConfirm: false })
  
  // Import form state - now includes title and slug upfront
  const [importForm, setImportForm] = useState({
    notionUrl: '',
    title: '',
    slug: '',
    category_id: '',
    tags: []
  })
  
  // Categories state
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '', icon: '📝' })
  const [editingCategory, setEditingCategory] = useState(null)
  const [editCategoryForm, setEditCategoryForm] = useState({ name: '', slug: '', description: '', icon: '' })
  
  // Blogs state
  const [blogs, setBlogs] = useState([])
  const [blogsLoading, setBlogsLoading] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', slug: '', excerpt: '', content_md: '', category_id: '', tags: [] })
  const [tagInput, setTagInput] = useState('')

  // Load categories on mount
  useEffect(() => {
    loadCategories()
  }, [])

  // Load blogs when switching to blogs tab
  useEffect(() => {
    if (activeTab === 'blogs') {
      loadBlogs()
    }
  }, [activeTab])

  const showModal = (title, message, type = 'info', onConfirm = null, showConfirm = false) => {
    setModal({ isOpen: true, title, message, type, onConfirm, showConfirm })
  }

  const closeModal = () => {
    setModal({ isOpen: false, title: '', message: '', type: 'info', onConfirm: null, showConfirm: false })
  }

  async function loadCategories() {
    if (!supabase) return
    const { data, error } = await supabase.from('categories').select('*').order('name')
    if (!error && data) setCategories(data)
  }

  async function loadBlogs() {
    if (!supabase) {
      console.warn('Supabase client not initialized')
      showModal('Configuration Error', 'Supabase not configured. Check .env.local', 'error')
      return
    }
    setBlogsLoading(true)
    const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false })
    if (error) {
      console.error('Error loading blogs:', error)
      showModal('Load Error', `Failed to load blogs: ${error.message}`, 'error')
    } else {
      console.log('Loaded blogs:', data)
      console.log('Blog statuses:', data?.map(b => ({ title: b.title, status: b.status })))
      
      // Load tags for each blog
      const blogsWithTags = await Promise.all(
        (data || []).map(async (blog) => {
          const tags = await loadBlogTags(blog.id)
          return { ...blog, tags }
        })
      )
      
      setBlogs(blogsWithTags)
    }
    setBlogsLoading(false)
  }

  async function loadBlogTags(blogId) {
    const { data, error } = await supabase
      .from('blog_tags')
      .select('tag_id, tags(name)')
      .eq('blog_id', blogId)
    
    if (error) {
      console.error('Error loading tags:', error)
      return []
    }
    
    return data?.map(item => item.tags.name) || []
  }

  async function saveBlogTags(blogId, tagNames) {
    try {
      // First, delete existing tags for this blog
      await supabase
        .from('blog_tags')
        .delete()
        .eq('blog_id', blogId)

      if (tagNames.length === 0) return

      // Get or create tags
      const tagIds = await Promise.all(
        tagNames.map(async (tagName) => {
          const slug = tagName.toLowerCase().replace(/\s+/g, '-')
          
          // Try to find existing tag
          let { data: existingTag } = await supabase
            .from('tags')
            .select('id')
            .eq('name', tagName)
            .single()

          if (existingTag) {
            return existingTag.id
          }

          // Create new tag
          const { data: newTag, error } = await supabase
            .from('tags')
            .insert({ name: tagName, slug })
            .select('id')
            .single()

          if (error) throw error
          return newTag.id
        })
      )

      // Create blog_tags relationships
      const blogTagsData = tagIds.map(tagId => ({
        blog_id: blogId,
        tag_id: tagId
      }))

      const { error } = await supabase
        .from('blog_tags')
        .insert(blogTagsData)

      if (error) throw error
    } catch (err) {
      console.error('Error saving tags:', err)
      throw err
    }
  }

  function handleAddTag() {
    const tag = tagInput.trim()
    if (!tag) return
    
    // If editing a blog
    if (editingBlog && !editForm.tags.includes(tag)) {
      setEditForm({ ...editForm, tags: [...editForm.tags, tag] })
      setTagInput('')
    }
    // If in import form
    else if (!editingBlog) {
      const currentTags = importForm.tags || []
      if (!currentTags.includes(tag)) {
        setImportForm({ ...importForm, tags: [...currentTags, tag] })
        setTagInput('')
      }
    }
  }

  function handleRemoveTag(tagToRemove) {
    setEditForm({ ...editForm, tags: editForm.tags.filter(tag => tag !== tagToRemove) })
  }

  function handleTagInputKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  async function handleNotionImport(e) {
    e.preventDefault()
    
    // Validate form
    if (!importForm.notionUrl) {
      showModal('Validation Error', 'Please enter a Notion page URL.', 'error')
      return
    }
    if (!importForm.title.trim()) {
      showModal('Validation Error', 'Please enter a title for the blog.', 'error')
      return
    }
    if (!importForm.slug.trim()) {
      showModal('Validation Error', 'Please enter a URL slug.', 'error')
      return
    }
    
    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(importForm.slug)) {
      showModal('Validation Error', 'Slug can only contain lowercase letters, numbers, and hyphens.', 'error')
      return
    }
    
    if (importForm.slug.startsWith('-') || importForm.slug.endsWith('-')) {
      showModal('Validation Error', 'Slug cannot start or end with a hyphen.', 'error')
      return
    }
    
    setLoading(true)
    try {
      // Extract Notion page ID from URL to check if this page was already imported
      const pageIdMatch = importForm.notionUrl.match(/([a-f0-9]{32})|([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/)
      const notionPageId = pageIdMatch ? pageIdMatch[0].replace(/-/g, '') : null
      
      if (notionPageId) {
        // Check if this Notion page was already imported
        const { data: existingBlog } = await supabase
          .from('blogs')
          .select('id, title, slug, status')
          .eq('notion_page_id', notionPageId)
          .single()
        
        if (existingBlog) {
          // This is an UPDATE - show confirmation and proceed
          showModal(
            'Update Existing Blog',
            `This Notion page is already imported:\n\nTitle: "${existingBlog.title}"\nSlug: ${existingBlog.slug}\nStatus: ${existingBlog.status}\n\nContent will be refreshed from Notion. Continue?`,
            'warning',
            () => performImport(),
            true
          )
          setLoading(false)
          return
        }
      }
      
      // NEW IMPORT - Check for duplicate slug
      const { data: existingSlug } = await supabase
        .from('blogs')
        .select('id, title')
        .eq('slug', importForm.slug)
        .single()
      
      if (existingSlug) {
        showModal('Duplicate Slug', `Slug "${importForm.slug}" is already used by blog: "${existingSlug.title}".\n\nPlease choose a different one.`, 'error')
        setLoading(false)
        return
      }
      
      // Check for duplicate title (warning only)
      const { data: existingTitle } = await supabase
        .from('blogs')
        .select('id, slug')
        .eq('title', importForm.title)
        .single()
      
      if (existingTitle) {
        showModal(
          'Duplicate Title Warning',
          `A blog with title "${importForm.title}" already exists (slug: ${existingTitle.slug}).\n\nDo you want to continue anyway?`,
          'warning',
          () => performImport(),
          true
        )
        setLoading(false)
        return
      }
      
      await performImport()
    } catch (err) {
      console.error(err)
      showModal('Import Failed', err?.message || 'Import failed. Check server logs.', 'error')
      setLoading(false)
    }
  }
  
  async function performImport() {
    setLoading(true)
    try {
      const res = await importNotionPage(importForm.notionUrl, importForm.category_id)
      
      if (!res || !res.success) {
        throw new Error(res?.error || 'Import failed with unknown error')
      }
      
      if (res.isUpdate && res.saved) {
        // Existing blog was updated - content refreshed from Notion
        // Also update tags if provided
        if (importForm.tags && importForm.tags.length > 0) {
          await saveBlogTags(res.saved.id, importForm.tags)
        }
        showModal(
          'Blog Updated',
          `This Notion page was already imported.\n\nBlog: "${res.saved.title}"\nSlug: ${res.saved.slug}\nStatus: ${res.saved.status}\n\nThe content has been refreshed from Notion!`,
          'success'
        )
        setImportForm({ notionUrl: '', title: '', slug: '', category_id: '', tags: [] })
        if (activeTab === 'blogs') loadBlogs()
      } else if (res.preparedData) {
        // New import - save with user's title and slug
        const newBlog = {
          title: importForm.title,
          slug: importForm.slug,
          excerpt: res.preparedData.excerpt || '',
          content_md: res.preparedData.content_md,
          status: 'draft',
          source: 'notion',
          notion_page_id: res.preparedData.notion_page_id,
          category_id: importForm.category_id || null,
          created_at: new Date().toISOString()
        }
        
        const { data, error } = await supabase
          .from('blogs')
          .insert([newBlog])
          .select()
          .single()
        
        if (error) {
          // Handle specific Supabase errors
          if (error.code === '23505') {
            throw new Error(`Duplicate key error: ${error.message}`)
          }
          throw error
        }
        
        // Save tags if provided
        if (importForm.tags && importForm.tags.length > 0) {
          await saveBlogTags(data.id, importForm.tags)
        }
        
        showModal('Success', `Blog imported successfully!\n\nTitle: ${importForm.title}\nSlug: ${importForm.slug}\n\nYou can now publish it from the Blogs tab.`, 'success')
        setImportForm({ notionUrl: '', title: '', slug: '', category_id: '', tags: [] })
        if (activeTab === 'blogs') loadBlogs()
      } else {
        showModal('Success', res.message || 'Operation completed!', 'success')
        setImportForm({ notionUrl: '', title: '', slug: '', category_id: '', tags: [] })
        if (activeTab === 'blogs') loadBlogs()
      }
    } catch (err) {
      console.error('Import error:', err)
      showModal('Import Failed', err?.message || 'Import failed. Please check the server logs or try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  function handleCancelPreview() {
    setImportForm({ notionUrl: '', title: '', slug: '', category_id: '', tags: [] })
  }

  async function handleCreateCategory(e) {
    e.preventDefault()
    if (!supabase || !newCategory.name || !newCategory.slug) {
      showModal('Validation Error', 'Name and slug are required.', 'error')
      return
    }
    setLoading(true)
    const { data, error } = await supabase.from('categories').insert([newCategory]).select()
    setLoading(false)
    if (error) {
      showModal('Error', error.message, 'error')
    } else {
      showModal('Success', 'Category created successfully!', 'success')
      setNewCategory({ name: '', slug: '', description: '', icon: '📝' })
      loadCategories()
    }
  }

  function handleEditCategory(category) {
    setEditingCategory(category)
    setEditCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || '📝'
    })
  }

  function handleCancelCategoryEdit() {
    setEditingCategory(null)
    setEditCategoryForm({ name: '', slug: '', description: '', icon: '' })
  }

  async function handleSaveCategoryEdit() {
    if (!editCategoryForm.name.trim() || !editCategoryForm.slug.trim()) {
      showModal('Validation Error', 'Name and slug are required.', 'error')
      return
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(editCategoryForm.slug)) {
      showModal('Validation Error', 'Slug can only contain lowercase letters, numbers, and hyphens.', 'error')
      return
    }

    // Check if slug changed and is duplicate
    if (editCategoryForm.slug !== editingCategory.slug) {
      const { data: existingSlug } = await supabase
        .from('categories')
        .select('id, name')
        .eq('slug', editCategoryForm.slug)
        .single()
      
      if (existingSlug) {
        showModal('Duplicate Slug', `Slug "${editCategoryForm.slug}" is already used by category: "${existingSlug.name}".\n\nPlease choose a different one.`, 'error')
        return
      }
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('categories')
        .update({
          name: editCategoryForm.name,
          slug: editCategoryForm.slug,
          description: editCategoryForm.description,
          icon: editCategoryForm.icon
        })
        .eq('id', editingCategory.id)

      if (error) throw error

      showModal('Success', 'Category updated successfully!', 'success')
      handleCancelCategoryEdit()
      loadCategories()
    } catch (err) {
      console.error('Update error:', err)
      showModal('Update Failed', err?.message || 'Failed to update category.', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteCategory(id) {
    showModal(
      'Confirm Delete',
      'Are you sure you want to delete this category?\n\nThis action cannot be undone.',
      'warning',
      async () => {
        const { error } = await supabase.from('categories').delete().eq('id', id)
        if (!error) {
          showModal('Success', 'Category deleted successfully!', 'success')
          loadCategories()
        } else {
          showModal('Error', error.message, 'error')
        }
      },
      true
    )
  }

  async function handlePublishBlog(id) {
    const { error } = await supabase.from('blogs').update({ status: 'published' }).eq('id', id)
    if (!error) {
      showModal('Success', 'Blog published successfully!', 'success')
      loadBlogs()
    } else {
      showModal('Error', error.message, 'error')
    }
  }

  async function handleUnpublishBlog(id) {
    const { error } = await supabase.from('blogs').update({ status: 'draft' }).eq('id', id)
    if (!error) {
      showModal('Success', 'Blog unpublished! It\'s now a draft.', 'success')
      loadBlogs()
    } else {
      showModal('Error', error.message, 'error')
    }
  }

  async function handleDeleteBlog(id) {
    showModal(
      'Confirm Delete',
      'Are you sure you want to delete this blog?\n\nThis action cannot be undone.',
      'warning',
      async () => {
        const { error } = await supabase.from('blogs').delete().eq('id', id)
        if (!error) {
          showModal('Success', 'Blog deleted successfully!', 'success')
          loadBlogs()
        } else {
          showModal('Error', error.message, 'error')
        }
      },
      true
    )
  }

  function handleEditBlog(blog) {
    setEditingBlog(blog)
    setEditForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || '',
      content_md: blog.content_md || '',
      category_id: blog.category_id || '',
      tags: blog.tags || []
    })
    setTagInput('')
  }

  function handleCancelEdit() {
    setEditingBlog(null)
    setEditForm({ title: '', slug: '', excerpt: '', content_md: '', category_id: '', tags: [] })
    setTagInput('')
  }

  async function handleRefreshFromNotion() {
    if (!editingBlog.notion_page_id) {
      showModal('Not Available', 'This blog was not imported from Notion, so it cannot be refreshed.', 'info')
      return
    }

    showModal(
      'Refresh Content from Notion',
      'This will fetch the latest content from Notion and update the content field.\n\nYour current title, slug, and category will be preserved.\n\nContinue?',
      'warning',
      async () => {
        setLoading(true)
        try {
          // Construct Notion URL from page ID
          const notionUrl = `https://www.notion.so/${editingBlog.notion_page_id}`
          
          const res = await importNotionPage(notionUrl, editingBlog.category_id)
          
          if (!res || !res.success) {
            throw new Error(res?.error || 'Failed to fetch from Notion')
          }

          // Update only the content and excerpt, keep title/slug
          const newContent = res.preparedData?.content_md || res.saved?.content_md || ''
          const newExcerpt = res.preparedData?.excerpt || res.saved?.excerpt || ''

          setEditForm({
            ...editForm,
            content_md: newContent,
            excerpt: newExcerpt
          })

          showModal('Success', 'Content refreshed from Notion!\n\nReview the changes and click "Save Changes" to update the blog.', 'success')
        } catch (err) {
          console.error('Refresh error:', err)
          showModal('Refresh Failed', err?.message || 'Failed to refresh content from Notion.', 'error')
        } finally {
          setLoading(false)
        }
      },
      true
    )
  }

  async function handleSaveEdit() {
    if (!editForm.title.trim() || !editForm.slug.trim()) {
      showModal('Validation Error', 'Title and slug are required.', 'error')
      return
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(editForm.slug)) {
      showModal('Validation Error', 'Slug can only contain lowercase letters, numbers, and hyphens.', 'error')
      return
    }
    
    if (editForm.slug.startsWith('-') || editForm.slug.endsWith('-')) {
      showModal('Validation Error', 'Slug cannot start or end with a hyphen.', 'error')
      return
    }

    // Check if slug changed and is duplicate
    if (editForm.slug !== editingBlog.slug) {
      const { data: existingSlug } = await supabase
        .from('blogs')
        .select('id, title')
        .eq('slug', editForm.slug)
        .single()
      
      if (existingSlug) {
        showModal('Duplicate Slug', `Slug "${editForm.slug}" is already used by another blog: "${existingSlug.title}".\n\nPlease choose a different one.`, 'error')
        return
      }
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('blogs')
        .update({
          title: editForm.title,
          slug: editForm.slug,
          excerpt: editForm.excerpt,
          content_md: editForm.content_md,
          category_id: editForm.category_id || null
        })
        .eq('id', editingBlog.id)

      if (error) throw error

      // Save tags
      await saveBlogTags(editingBlog.id, editForm.tags)

      showModal('Success', 'Blog updated successfully!', 'success')
      handleCancelEdit()
      loadBlogs()
    } catch (err) {
      console.error('Update error:', err)
      showModal('Update Failed', err?.message || 'Failed to update blog.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-white dark:bg-gray-900">
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
        showConfirm={modal.showConfirm}
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'import'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            📥 Import
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'blogs'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            📝 Blogs
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'categories'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            🏷️ Categories
          </button>
        </div>

        {/* Import Tab */}
        {activeTab === 'import' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Import from Notion</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">Enter your blog details and Notion page URL to import content.</p>
            
            <form onSubmit={handleNotionImport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Blog Title *</label>
                <input
                  type="text"
                  className="w-full rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Getting Started with AI"
                  value={importForm.title}
                  onChange={(e) => setImportForm({ ...importForm, title: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">URL Slug *</label>
                <input
                  type="text"
                  className="w-full rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., getting-started-with-ai"
                  value={importForm.slug}
                  onChange={(e) => setImportForm({ ...importForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">URL will be: /blogs/{importForm.slug || 'your-slug'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Notion Page URL *</label>
                <input
                  type="url"
                  className="w-full rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="https://www.notion.so/your-workspace/page..."
                  value={importForm.notionUrl}
                  onChange={(e) => setImportForm({ ...importForm, notionUrl: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Category (optional)</label>
                <select
                  className="w-full rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={importForm.category_id}
                  onChange={(e) => setImportForm({ ...importForm, category_id: e.target.value })}
                >
                  <option value="">-- No category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Tags (optional)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagInputKeyPress}
                    placeholder="Enter a tag and press Enter"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                {importForm.tags && importForm.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {importForm.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg text-sm"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => setImportForm({ ...importForm, tags: importForm.tags.filter(t => t !== tag) })}
                          className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 transition-colors"
              >
                {loading ? 'Importing...' : '📥 Import Blog from Notion'}
              </button>
            </form>
          </div>
        )}

        {/* Blogs Tab */}
        {activeTab === 'blogs' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Manage Blogs</h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total: {blogs.length} | 
                Drafts: {blogs.filter(b => b.status === 'draft').length} | 
                Published: {blogs.filter(b => b.status === 'published').length}
              </div>
            </div>
            {blogsLoading ? (
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            ) : blogs.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No blogs found. Import from Notion to get started!</p>
            ) : (
              <div className="space-y-4">
                {/* Show drafts first, then published */}
                {[...blogs].sort((a, b) => {
                  if (a.status === 'draft' && b.status !== 'draft') return -1;
                  if (a.status !== 'draft' && b.status === 'draft') return 1;
                  return 0;
                }).map((blog) => (
                  <div key={blog.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{blog.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{blog.slug}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            blog.status === 'published'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {blog.status}
                          </span>
                          {blog.source && (
                            <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                              {blog.source}
                            </span>
                          )}
                          {blog.tags && blog.tags.length > 0 && blog.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              #{tag}
                            </span>
                          ))}
                          {blog.tags && blog.tags.length > 3 && (
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                              +{blog.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`/blogs/${blog.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </a>
                        <button
                          onClick={() => handleEditBlog(blog)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                        >
                          Edit
                        </button>
                        {blog.status === 'draft' && (
                          <button
                            onClick={() => handlePublishBlog(blog.id)}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                          >
                            Publish
                          </button>
                        )}
                        {blog.status === 'published' && (
                          <button
                            onClick={() => handleUnpublishBlog(blog.id)}
                            className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded transition-colors"
                          >
                            Unpublish
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteBlog(blog.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Edit Blog Modal/Panel */}
        {editingBlog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Edit Blog</h2>
                  <button
                    onClick={handleCancelEdit}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Title *</label>
                    <input
                      type="text"
                      className="w-full rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Slug *</label>
                    <input
                      type="text"
                      className="w-full rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      value={editForm.slug}
                      onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                      required
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Lowercase letters, numbers, and hyphens only</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Category</label>
                    <select
                      className="w-full rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      value={editForm.category_id}
                      onChange={(e) => setEditForm({ ...editForm, category_id: e.target.value })}
                    >
                      <option value="">No Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Excerpt</label>
                    <textarea
                      className="w-full rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      rows="3"
                      value={editForm.excerpt}
                      onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })}
                      placeholder="Brief description of the blog..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Tags</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        className="flex-1 rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleTagInputKeyPress}
                        placeholder="Enter a tag and press Enter"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    {editForm.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {editForm.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg text-sm"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content (Markdown)</label>
                      {editingBlog.notion_page_id && (
                        <button
                          type="button"
                          onClick={handleRefreshFromNotion}
                          disabled={loading}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Refresh from Notion
                        </button>
                      )}
                    </div>
                    <textarea
                      className="w-full rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white font-mono text-sm"
                      rows="15"
                      value={editForm.content_md}
                      onChange={(e) => setEditForm({ ...editForm, content_md: e.target.value })}
                      placeholder="# Your markdown content here..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-6 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            {/* Create Category */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Create Category</h2>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Name</label>
                    <input
                      type="text"
                      className="w-full rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="AI & Machine Learning"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Slug</label>
                    <input
                      type="text"
                      className="w-full rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="ai-ml"
                      value={newCategory.slug}
                      onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Icon (emoji)</label>
                  <input
                    type="text"
                    className="w-full rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="🤖"
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    className="w-full rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Articles about AI and ML..."
                    rows="3"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Creating...' : 'Create Category'}
                </button>
              </form>
            </div>

            {/* List Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Existing Categories</h2>
              {categories.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">No categories yet. Create one above!</p>
              ) : (
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{cat.icon}</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{cat.name}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">({cat.slug})</span>
                        </div>
                        {cat.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{cat.description}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCategory(cat)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {editingCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Edit Category</h2>
                  <button
                    onClick={handleCancelCategoryEdit}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSaveCategoryEdit(); }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Name *</label>
                      <input
                        type="text"
                        className="w-full rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        value={editCategoryForm.name}
                        onChange={(e) => setEditCategoryForm({ ...editCategoryForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Slug *</label>
                      <input
                        type="text"
                        className="w-full rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        value={editCategoryForm.slug}
                        onChange={(e) => setEditCategoryForm({ ...editCategoryForm, slug: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Icon (Emoji)</label>
                    <input
                      type="text"
                      className="w-full rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      value={editCategoryForm.icon}
                      onChange={(e) => setEditCategoryForm({ ...editCategoryForm, icon: e.target.value })}
                      placeholder="📝"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Description</label>
                    <textarea
                      className="w-full rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      rows="3"
                      value={editCategoryForm.description}
                      onChange={(e) => setEditCategoryForm({ ...editCategoryForm, description: e.target.value })}
                      placeholder="Brief description of this category..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelCategoryEdit}
                      className="px-6 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
