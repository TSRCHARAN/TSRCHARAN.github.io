import { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  blogCategories, 
  getCategoryById 
} from '../data/blogsData';
import { getAllBlogs } from '../utils/blogLoader';

const BlogCategories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load blogs from markdown files
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      // Use static categories from blogsData
      setCategories(blogCategories);
      
      // Load all markdown blogs
      const allBlogs = await getAllBlogs();
      setBlogs(allBlogs);
    } catch (err) {
      console.error('Error loading data:', err);
      setCategories(blogCategories);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }

  // Search blogs (from both DB and fallback)
  const searchBlogs = (term) => {
    const lowerTerm = term.toLowerCase();
    return blogs.filter(blog => 
      blog.title.toLowerCase().includes(lowerTerm) ||
      blog.excerpt?.toLowerCase().includes(lowerTerm) ||
      blog.tags?.some(tag => tag.toLowerCase().includes(lowerTerm))
    );
  };

  // Get blogs by category
  const getBlogsByCategoryId = (categoryId) => {
    return blogs.filter(blog => blog.category === categoryId);
  };

  // Handle search
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setShowSuggestions(term.trim().length > 0);
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get search results
  const searchResults = searchTerm.trim() ? searchBlogs(searchTerm) : [];

  // Get category info (check DB categories first, then fallback)
  const getCategoryInfo = (categoryId) => {
    const dbCat = categories.find(c => c.id === categoryId);
    if (dbCat) return dbCat;
    return getCategoryById(categoryId);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-16 bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600 dark:text-gray-400">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Blog <span className="text-gradient">Categories</span>
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore articles organized by topics in software development, AI/ML, and technology
          </p>
        </div>

        {/* Search Bar with Suggestions */}
        <div className="max-w-4xl mx-auto mb-16 relative" ref={searchRef}>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
              placeholder="🔍 Search blogs by title, tags, or keywords..."
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
                  {searchResults.map((blog) => {
                    const category = getCategoryInfo(blog.category_id || blog.category);
                    return (
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
                          {/* Category Icon */}
                          <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${category.color} text-white rounded-xl flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition-transform`}>
                            {category.icon}
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
                    );
                  })}
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

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {categories.map((category) => {
            const blogCount = getBlogsByCategoryId(category.id).length;
            
            return (
              <Link
                key={category.id}
                to={`/blogs/category/${category.slug || category.id}`}
                className="group relative bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 overflow-hidden"
              >
                {/* Background Gradient Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${category.color} text-white text-4xl rounded-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                  
                  {/* Category Name */}
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </h2>
                  
                  {/* Article Count */}
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {blogCount} {blogCount === 1 ? 'article' : 'articles'} available
                  </p>
                  
                  {/* Arrow */}
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-3 gap-2 transition-all">
                    <span>Explore Articles</span>
                    <span className="text-xl">→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BlogCategories;
