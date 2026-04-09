import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  getCategoryById as getFallbackCategory, 
} from '../data/blogsData';
import { getBlogsByCategory } from '../utils/blogLoader';

const CategoryBlogs = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [allBlogsInCategory, setAllBlogsInCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Handle search - MUST be before any returns
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setShowSuggestions(term.trim().length > 0);
  }, []);

  // Close suggestions when clicking outside - MUST be before any returns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load category and blogs from markdown files
  useEffect(() => {
    loadCategoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  async function loadCategoryData() {
    setLoading(true);
    try {
      console.log('Loading category:', categoryId);
      
      // Get category from static data
      const categoryInfo = getFallbackCategory(categoryId);
      if (categoryInfo) {
        setCategory(categoryInfo);
        
        // Load blogs for this category from markdown
        const categoryBlogs = await getBlogsByCategory(categoryId);
        setAllBlogsInCategory(categoryBlogs);
      } else {
        console.log('Category not found');
      }
    } catch (err) {
      console.error('Error loading category:', err);
      const categoryInfo = getFallbackCategory(categoryId);
      if (categoryInfo) {
        setCategory(categoryInfo);
        setAllBlogsInCategory([]);
      }
    } finally {
      setLoading(false);
    }
  }

  // Search within category blogs
  const searchInCategory = (term) => {
    const lowerTerm = term.toLowerCase();
    return allBlogsInCategory.filter(blog => 
      blog.title.toLowerCase().includes(lowerTerm) ||
      blog.excerpt?.toLowerCase().includes(lowerTerm) ||
      blog.tags?.some(tag => tag.toLowerCase().includes(lowerTerm))
    );
  };

  // Get tags from this category only (safe to do before returns, no hooks)
  const categoryTags = allBlogsInCategory.length > 0 
    ? [...new Set(allBlogsInCategory.flatMap(blog => blog.tags || []))].sort()
    : [];

  // Get filtered blogs
  const blogs = searchTerm.trim() ? searchInCategory(searchTerm) : allBlogsInCategory;

  // Get search results for suggestions
  const searchResults = searchTerm.trim() ? searchInCategory(searchTerm) : [];

  // If category not found and not loading, redirect to categories page
  if (!loading && !category) {
    return <Navigate to="/blogs" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-16 bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600 dark:text-gray-400">Loading category...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8 font-medium transition-colors"
        >
          <span>←</span> Back to Categories
        </Link>

        {/* Category Header */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className={`text-6xl bg-gradient-to-br ${category.color} p-5 rounded-3xl text-white shadow-xl`}>
              {category.icon}
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                {category.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {blogs.length} {blogs.length === 1 ? 'article' : 'articles'} {searchTerm ? 'found' : 'available'}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-12 relative" ref={searchRef}>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
              placeholder="🔍 Search articles in this category..."
              className="w-full px-6 py-5 pl-6 pr-14 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 transition-all duration-300 shadow-lg hover:shadow-xl text-base md:text-lg"
            />

            {/* Clear Button */}
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setShowSuggestions(false);
                }}
                className="absolute right-5 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && searchResults.length > 0 && (
            <div className="absolute w-full mt-3 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 max-h-[32rem] overflow-y-auto z-50 backdrop-blur-lg">
              <div className="p-3">
                <div className="px-4 py-3 text-sm font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-blue-600 dark:text-blue-400">{searchResults.length}</span> {searchResults.length === 1 ? 'article' : 'articles'} found
                </div>
                <div className="py-2">
                  {searchResults.map((blog) => (
                    <Link
                      key={blog.id}
                      to={`/blogs/${blog.slug}`}
                      onClick={() => {
                        setShowSuggestions(false);
                        setSearchTerm('');
                      }}
                      className="block p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-700 rounded-xl transition-all group my-1"
                    >
                      <div className="flex items-start gap-4">
                        {/* Blog Icon */}
                        <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${category.color} text-white rounded-xl flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition-transform`}>
                          📖
                        </div>
                        
                        {/* Blog Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-1">
                            {blog.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                            {blog.excerpt}
                          </p>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-xs text-gray-500 dark:text-gray-500 font-medium">
                              ⏱️ {blog.readTime}
                            </span>
                            <div className="flex gap-1.5 flex-wrap">
                              {(blog.tags || []).slice(0, 3).map((tag, idx) => (
                                <span key={idx} className="text-xs px-2.5 py-1 bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-400 rounded-md font-medium">
                                  #{tag}
                                </span>
                              ))}
                              {blog.tags.length > 3 && (
                                <span className="text-xs px-2.5 py-1 text-gray-500 dark:text-gray-400">
                                  +{blog.tags.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* No Results */}
          {showSuggestions && searchTerm.trim() && searchResults.length === 0 && (
            <div className="absolute w-full mt-3 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 p-10 text-center z-50">
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                No articles found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No results for "<span className="font-semibold text-blue-600 dark:text-blue-400">{searchTerm}</span>"
              </p>
            </div>
          )}
        </div>

        {/* Blogs Grid */}
        {blogs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blogs/${blog.slug}`}
                className="group bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
              >
                {/* Blog Icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`text-3xl bg-gradient-to-br ${category.color} p-3 rounded-xl text-white shadow-md`}>
                    📖
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {blog.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {blog.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
                  {blog.excerpt}
                </p>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(blog.tags || []).slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                    {blog.tags.length > 2 && (
                      <span className="px-3 py-1 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-600">
                        +{blog.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <span>📅 {blog.date}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium group-hover:gap-2 flex items-center gap-1 transition-all">
                    Read More <span>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
              }}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryBlogs;
