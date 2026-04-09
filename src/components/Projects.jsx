const Projects = () => {
  const projects = [
    {
      title: 'Handwritten Calculator',
      description: 'Developed a handwritten calculator that recognizes and performs calculations on handwritten input, utilizing contour detection techniques to accurately identify and interpret handwritten digits and operators.',
      icon: '🧮',
      tags: ['Machine Learning', 'Python', 'OpenCV', 'Contour Detection'],
      demoLink: '#',
      paperLink: 'https://www.ijisrt.com/handwritten-calculator-using-contour-detection',
      githubLink: '#',
      gradient: 'from-emerald-400 to-teal-600',
      bgPattern: 'from-emerald-50 to-teal-50',
      category: 'ML Research',
      featured: true,
    },
    {
      title: 'Path Finding Visualizer',
      description: "Developed an intuitive visualizer that dynamically navigates around obstacles to find the shortest route between two points on a grid, utilizing Dijkstra's and A* algorithms.",
      icon: '🗺️',
      tags: ['DSA', 'JavaScript', 'Algorithms', 'Visualization'],
      demoLink: '#',
      githubLink: 'https://github.com/TSRCHARAN/PATH-FINDING-VIUALIZERS',
      gradient: 'from-blue-400 to-indigo-600',
      bgPattern: 'from-blue-50 to-indigo-50',
      category: 'DSA Project',
      featured: true,
    },
    {
      title: 'Z444 - EdTech Platform',
      description: 'Co-founded an online mentorship platform connecting students with mentors for programming guidance, interview preparation, and career development.',
      icon: '🎓',
      tags: ['React', 'Next.js', 'Firebase', 'EdTech'],
      demoLink: 'https://z444.vercel.app',
      githubLink: '#',
      gradient: 'from-purple-400 to-pink-600',
      bgPattern: 'from-purple-50 to-pink-50',
      category: 'Startup',
      featured: true,
    },
    {
      title: 'OAuth Identity Provider',
      description: 'Custom Identity Provider (IDP) implementation with OAuth 2.0 and OpenID Connect protocols for secure authentication and authorization.',
      icon: '🔐',
      tags: ['.NET Core', 'OAuth 2.0', 'OpenID', 'Security'],
      demoLink: '#',
      githubLink: '#',
      gradient: 'from-orange-400 to-red-600',
      bgPattern: 'from-orange-50 to-red-50',
      category: 'Enterprise',
    },
    {
      title: 'E-Consent Management',
      description: 'Robust consent management system enabling secure data sharing with flexible consent options and enhanced user control over data privacy.',
      icon: '✅',
      tags: ['ASP.NET', 'C#', 'SQL Server', 'Privacy'],
      demoLink: '#',
      githubLink: '#',
      gradient: 'from-cyan-400 to-blue-600',
      bgPattern: 'from-cyan-50 to-blue-50',
      category: 'Enterprise',
    },
    {
      title: 'Health Monitor Service',
      description: 'Comprehensive health check service monitoring microservices with 99.9% uptime, enabling proactive issue resolution and system reliability.',
      icon: '🏥',
      tags: ['.NET', 'Microservices', 'Redis', 'Monitoring'],
      demoLink: '#',
      githubLink: '#',
      gradient: 'from-teal-400 to-green-600',
      bgPattern: 'from-teal-50 to-green-50',
      category: 'Enterprise',
    },
  ];

  return (
    <section id="projects" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Showcasing my best work across ML, Web Development, and Enterprise Solutions
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 border-2 border-gray-200 dark:border-gray-700"
            >
              {/* Category Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className={`px-4 py-1 bg-gradient-to-r ${project.gradient} text-white text-xs font-bold rounded-full shadow-lg`}>
                  {project.category}
                </span>
              </div>

              {/* Gradient Header with Icon */}
              <div className={`relative h-40 bg-gradient-to-br ${project.bgPattern} dark:bg-gray-800 flex items-center justify-center overflow-hidden`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 dark:opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                  }}></div>
                </div>
                
                {/* Icon with Gradient Border */}
                <div className={`relative z-10 w-24 h-24 bg-white dark:bg-gradient-to-br dark:${project.gradient} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border-2 border-gray-200 dark:border-transparent`}>
                  <span className="text-5xl filter dark:brightness-110 dark:contrast-125">{project.icon}</span>
                </div>

                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-20 dark:group-hover:opacity-10 transition-opacity duration-500`}></div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className={`px-3 py-1 bg-gradient-to-r ${project.bgPattern} dark:bg-gradient-to-r dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-100 text-xs font-semibold rounded-lg border-2 border-gray-300 dark:border-${project.gradient.split('-')[1]}-500/30`}
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gradient-to-r dark:from-gray-700 dark:to-gray-600 text-gray-500 dark:text-gray-100 text-xs font-semibold rounded-lg border-2 border-gray-300 dark:border-gray-600">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {project.paperLink ? (
                    <a
                      href={project.paperLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 text-center px-4 py-2.5 bg-gradient-to-r ${project.gradient} text-white text-sm font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300`}
                    >
                      📄 Paper
                    </a>
                  ) : (
                    <a
                      href={project.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 text-center px-4 py-2.5 bg-gradient-to-r ${project.gradient} text-white text-sm font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300`}
                    >
                      🚀 Live Demo
                    </a>
                  )}
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-4 py-2.5 border-2 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-xl hover:border-gray-900 dark:hover:border-gray-400 hover:bg-gray-900 dark:hover:bg-gray-600 hover:text-white transform hover:scale-105 transition-all duration-300"
                  >
                    <span className="inline-block">💻</span> Code
                  </a>
                </div>
              </div>

              {/* Bottom Accent Line */}
              <div className={`h-1 bg-gradient-to-r ${project.gradient}`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
