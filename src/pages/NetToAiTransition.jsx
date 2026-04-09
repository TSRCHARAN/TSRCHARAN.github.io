import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { supabase, fetchBlogsByCategorySlug, fetchBlogsByTag } from '../utils/supabase'; // Import supabase helpers
import { 
  netToAiBlogs 
} from '../data/netToAiData';

const NetToAiTransition = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [blogs, setBlogs] = useState(netToAiBlogs); // Start with local data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRemoteBlogs();
  }, []);

  async function loadRemoteBlogs() {
    setLoading(true);
    try {
      // 1. Fetch by Category 'dotnet-to-ai'
      const blogsByCategory = await fetchBlogsByCategorySlug('dotnet-to-ai');
      
      // 2. Fetch by Tag 'dotnet-to-ai' or 'NetToAi'
      const blogsByTag1 = await fetchBlogsByTag('dotnet-to-ai');
      const blogsByTag2 = await fetchBlogsByTag('NetToAi');

      // Combine and deduplicate remote blogs
      const combinedRemote = [
        ...(blogsByCategory || []), 
        ...(blogsByTag1 || []),
        ...(blogsByTag2 || [])
      ];
      
      // Deduplicate by ID and Slug
      const uniqueRemote = Array.from(new Map(combinedRemote.map(item => [item.slug, item])).values());

      if (uniqueRemote.length > 0) {
        // Transform remote blogs
        const transformedRemote = uniqueRemote.map(b => ({
          ...b,
          date: b.created_at ? new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown',
          readTime: b.content_md ? `${Math.ceil(b.content_md.split(' ').length / 200)} min read` : '5 min read',
          // Keep original category if exists, else fallback
          category: b.category_id ? 'dotnet-to-ai' : (b.tags?.includes('dotnet-to-ai') ? 'dotnet-to-ai' : 'Tech'),
          tags: b.tags || ['dotnet-to-ai'], 
        }));

        // Merge with local, prioritizing Remote (if slug collision, remote wins? Or local stays? Usually remote updates are preferred)
        // Let's keep local if it's not in remote, but typically we want remote to override local eventually.
        // For now, let's append unique remote blogs to local.
        
        const localSlugs = new Set(netToAiBlogs.map(b => b.slug));
        const newRemoteBlogs = transformedRemote.filter(b => !localSlugs.has(b.slug));

        setBlogs(prev => [...prev, ...newRemoteBlogs]);
      }
    } catch (err) {
      console.error('Error loading remote .NET to AI blogs:', err);
    } finally {
      setLoading(false);
    }
  }

  // Handle search
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  // Filter
  const getFilteredBlogs = () => {
    let filtered = [...blogs];

    // Filter by search term
    if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(blog => 
            blog.title.toLowerCase().includes(term) ||
            blog.excerpt.toLowerCase().includes(term) ||
            blog.tags.some(tag => tag.toLowerCase().includes(term))
        );
    }

    // Sort blogs (simple date sort)
    filtered.sort((a, b) => {
        if (sortBy === 'newest') {
            return new Date(b.date) - new Date(a.date);
        } else {
            return new Date(a.date) - new Date(b.date);
        }
    });

    return filtered;
  };

  const filteredBlogs = getFilteredBlogs();

  return (
    <div className="min-h-screen pt-20 pb-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          {/* <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            .NET to <span className="text-gradient">AI Transition</span>
          </h1> */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Attention is <span className="text-gradient">All You Need</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            My journey, learnings, and comparisons as I transitioned from a .NET backend developer to an AI engineer.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="w-full md:w-96">
              <SearchBar onSearch={handleSearch} />
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full border border-gray-100 dark:border-gray-700"
            >
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    {blog.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {blog.readTime}
                  </span>
                </div>

                <Link to={`/blogs/${blog.slug}`}>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {blog.title}
                  </h2>
                </Link>

                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-grow">
                  {blog.excerpt}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.slice(0, 3).map(tag => (
                      <span 
                        key={tag}
                        className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {blog.date}
                    </span>
                    <Link
                      to={`/blogs/${blog.slug}`}
                      className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1"
                    >
                      Read full story →
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* No Results State */}
        {filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetToAiTransition;
