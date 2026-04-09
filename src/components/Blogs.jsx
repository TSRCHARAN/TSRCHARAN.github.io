import { Link } from 'react-router-dom';
import { blogCategories, getBlogsByCategory } from '../data/blogsData';

const Blogs = () => {
  return (
    <section id="blogs" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          {/* <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Blog <span className="text-gradient">&</span> Articles
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Sharing my knowledge and experiences in software development, AI/ML, and technology
          </p> */}

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            .NET to AI <span className="text-gradient">Transition</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-green-600 to-teal-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Documenting my journey from a .NET Developer to an AI Engineer. 
            Sharing insights on building modern AI-powered systems.
          </p>
        </div>

        {/* Blog Categories */}
        <div className="space-y-12">
          {blogCategories.map((category) => {
            const categoryBlogs = getBlogsByCategory(category.id);
            
            return (
              <div key={category.id} className="animate-fade-in">
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`text-3xl bg-gradient-to-r ${category.color} p-3 rounded-xl text-white shadow-lg`}>
                    {category.icon}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    ({categoryBlogs.length} articles)
                  </span>
                </div>

                {/* Blogs Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {categoryBlogs.map((blog) => (
                    <Link
                      key={blog.id}
                      to={`/blogs/${blog.slug}`}
                      className="group bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
                    >
                      {/* Blog Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {blog.title}
                          </h4>
                        </div>
                        <span className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
                          📖
                        </span>
                      </div>

                      {/* Excerpt */}
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                        {blog.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(blog.tags || []).slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="px-3 py-1 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-600">
                            +{blog.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <span>📅 {blog.date}</span>
                        <span>⏱️ {blog.readTime}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Blogs;
