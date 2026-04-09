const Skills = () => {
  const skillCategories = [
    {
      title: 'Programming Languages',
      gradient: 'from-blue-400 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      skills: [
        { name: 'C#', icon: '💠' },
        { name: 'C++', icon: '⚡' },
        { name: 'Python', icon: '�' },
        { name: 'C', icon: '©️' },
        { name: 'JavaScript', icon: '�' },
        { name: 'TypeScript', icon: '📘' },
      ],
    },
    {
      title: 'Web Development',
      gradient: 'from-green-400 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      skills: [
        { name: '.NET', icon: '�' },
        { name: 'ASP.NET', icon: '🌐' },
        { name: 'React', icon: '⚛️' },
        { name: 'HTML/CSS', icon: '🎨' },
        { name: 'Bootstrap', icon: '🅱️' },
        { name: 'Blazor', icon: '�' },
      ],
    },
    {
      title: 'Databases',
      gradient: 'from-purple-400 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      skills: [
        { name: 'MySQL', icon: '🗄️' },
        { name: 'PostgreSQL', icon: '🐘' },
        { name: 'Redis', icon: '�' },
        { name: 'MongoDB', icon: '🍃' },
        { name: 'SQL Server', icon: '💾' },
        { name: 'Supabase', icon: '⚡' },
      ],
    },
    {
      title: 'Frameworks & Libraries',
      gradient: 'from-pink-400 to-pink-600',
      bgGradient: 'from-pink-50 to-pink-100',
      skills: [
        { name: 'FastAPI', icon: '🚀' },
        { name: 'Entity Framework', icon: '�' },
        { name: 'scikit-learn', icon: '📊' },
        { name: 'Pandas', icon: '�' },
        { name: 'NumPy', icon: '�' },
        { name: 'REST APIs', icon: '�' },
      ],
    },
    {
      title: 'Cloud & DevOps',
      gradient: 'from-cyan-400 to-cyan-600',
      bgGradient: 'from-cyan-50 to-cyan-100',
      skills: [
        { name: 'Azure', icon: '☁️' },
        { name: 'OAuth 2.0', icon: '�' },
        { name: 'OpenID Connect', icon: '�' },
        { name: 'GitHub Actions', icon: '⚙️' },
        { name: 'Docker', icon: '�' },
        { name: 'CI/CD', icon: '�' },
      ],
    },
    {
      title: 'Version Control & Tools',
      gradient: 'from-amber-400 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100',
      skills: [
        { name: 'Git', icon: '�' },
        { name: 'GitHub', icon: '�' },
        { name: 'VS Code', icon: '💻' },
        { name: 'Postman', icon: '�' },
        { name: 'Jenkins', icon: '⚙️' },
        { name: 'Jira', icon: '📋' },
      ],
    },
  ];

  return (
    <section id="skills" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Technical <span className="text-gradient">Skills</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Technologies and tools I work with to build amazing applications
          </p>
        </div>

        {/* Skills Grid - 2 columns on mobile, 3 on desktop */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
            >
              {/* Category Header with Gradient */}
              <div className={`bg-gradient-to-r ${category.gradient} text-white rounded-xl p-4 mb-6 text-center`}>
                <h3 className="text-xl font-bold">
                  {category.title}
                </h3>
              </div>
              
              {/* Skills Grid */}
              <div className="grid grid-cols-2 gap-3">
                {category.skills.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className={`flex flex-col items-center justify-center p-3 bg-gradient-to-br ${category.bgGradient} dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-700 rounded-xl hover:scale-110 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md border-2 border-gray-200 dark:border-${category.gradient.split('-')[1]}-500/30 dark:hover:border-${category.gradient.split('-')[1]}-400/50`}
                  >
                    <span className="text-3xl mb-1">{skill.icon}</span>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-100 text-center leading-tight">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Currently pursuing <span className="font-bold text-blue-600 dark:text-blue-400">M.Tech in AI/ML</span> from BITS Pilani
          </p>
        </div>
      </div>
    </section>
  );
};

export default Skills;
