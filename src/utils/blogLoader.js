// This file loads markdown blog posts from the src/blogs folder
// Vite will handle the glob import at build time

// Blog posts are imported as modules using eager loading
const blogModules = import.meta.glob('../blogs/*.md', { as: 'raw', eager: true });

console.log('Blog modules found:', Object.keys(blogModules).length, 'files');
console.log('Module paths:', Object.keys(blogModules));

function parseFrontmatter(content) {
  // Handle both CRLF (Windows) and LF (Unix) line endings
  content = content.replace(/\r\n/g, '\n');
  
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    console.warn('No frontmatter found in content. First 100 chars:', content.substring(0, 100));
    return { metadata: {}, content };
  }

  const [, frontmatterStr, markdownContent] = match;
  const metadata = {};

  frontmatterStr.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key) {
      let value = valueParts.join(':').trim();

      // Parse arrays (tags, etc.)
      if (value.startsWith('[') && value.endsWith(']')) {
        value = JSON.parse(value);
      } else if (value.startsWith('- ')) {
        // Handle YAML list format
        const lines = frontmatterStr.split('\n');
        const keyIndex = lines.findIndex(l => l.startsWith(key));
        const arrayItems = [];
        let i = keyIndex + 1;
        while (i < lines.length && lines[i].startsWith('  - ')) {
          arrayItems.push(lines[i].substring(4).trim());
          i++;
        }
        if (arrayItems.length > 0) {
          value = arrayItems;
        }
      }

      metadata[key.trim()] = value;
    }
  });

  return { metadata, content: markdownContent };
}

export async function getAllBlogs() {
  const blogs = [];

  for (const [path, content] of Object.entries(blogModules)) {
    try {
      // With eager: true, content is already the string, not a resolver function
      const { metadata, content: markdownContent } = parseFrontmatter(content);
      console.log('Loaded blog:', metadata.title, 'from', path);

      blogs.push({
        id: metadata.id || metadata.slug,
        ...metadata,
        tags: Array.isArray(metadata.tags) ? metadata.tags : [],
        content: markdownContent,
        path
      });
    } catch (err) {
      console.error('Error loading blog from', path, ':', err);
    }
  }

  console.log('Total blogs loaded:', blogs.length);

  // Sort by date (newest first)
  return blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function getBlogBySlug(slug) {
  const blogs = await getAllBlogs();
  return blogs.find(blog => blog.slug === slug);
}

export async function getBlogsByCategory(category) {
  const blogs = await getAllBlogs();
  return blogs.filter(blog => blog.category === category);
}
