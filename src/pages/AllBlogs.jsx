import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterControls from '../components/FilterControls';
import { 
  blogCategories, 
  getAllTags, 
  searchBlogs, 
  filterBlogsByTags, 
  sortBlogs,
  getCategoryById 
} from '../data/blogsData';
import { getAllBlogs } from '../utils/blogLoader';

const AllBlogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load markdown blogs on mount
  useEffect(() => {
    async function loadBlogs() {
      const blogs = await getAllBlogs();
      setAllBlogs(blogs);
      setLoading(false);
    }
    loadBlogs();
  }, []);

  const allTags = getAllTags();

  // Handle search
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  // Handle tag toggle
  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Get filtered and sorted blogs
  const getFilteredBlogs = () => {
    let filtered = [...allBlogs];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }

    // Filter by search term
    filtered = searchBlogs(searchTerm, filtered);

    // Filter by tags
    filtered = filterBlogsByTags(selectedTags, filtered);

    // Sort blogs
    filtered = sortBlogs(filtered, sortBy);

    return filtered;
  };

  const filteredBlogs = getFilteredBlogs();

  return (
    <div className="min-h-screen pt-20 pb-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            All <span className="text-gradient">Blogs</span>
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {loading ? 'Loading...' : `${filteredBlogs.length} ${filteredBlogs.length === 1 ? 'article' : 'articles'} found`}
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search blogs by title, tags, or keywords..."
          />
        </div>

        {/* Filters */}
        <div className="mb-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700">
          <FilterControls
            tags={allTags}
            selectedTags={selectedTags}
            onTagChange={handleTagToggle}
            sortBy={sortBy}
            onSortChange={setSortBy}
            showCategoryFilter={true}
            categories={blogCategories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Results */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No blogs found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedTags([]);
                setSelectedCategory('all');
              }}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => {
              const category = getCategoryById(blog.category) || {
                id: 'ai',
                name: 'AI & ML',
                icon: '🤖',
                color: 'from-blue-600 to-purple-600'
              };
              return (
                <Link
                  key={blog.id}
                  to={`/blogs/${blog.slug}`}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  {/* Category Badge */}
                  <div className="p-6 pb-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r ${category.color} text-white text-xs font-semibold rounded-full`}>
                        {category.icon} {category.name}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500 mb-4">
                      <span>{blog.date}</span>
                      <span>•</span>
                      <span>{blog.readTime}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(blog.tags || []).slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                      {blog.tags.length > 3 && (
                        <span className="px-2 py-1 text-gray-500 dark:text-gray-400 text-xs">
                          +{blog.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Read More */}
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-2 gap-1 transition-all">
                      <span>Read Article</span>
                      <span>→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBlogs;
