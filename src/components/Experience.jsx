const Experience = () => {
  const experiences = [
    {
      company: 'Digital Trust Technologies',
      position: 'Software Development Engineer - 1',
      period: 'Feb 2024 - Present',
      location: 'India',
      achievements: [
        {
          title: 'OAuth and OpenID Connect',
          description: 'Developed and implemented a custom Identity Provider (IDP) leveraging OAuth and OpenID protocols, enhancing security and authentication capabilities across all user bases.',
        },
        {
          title: 'E-Consent Service',
          description: 'Developed a robust consent management system, streamlining secure data sharing by enabling clients to request access to user profiles with flexible consent options.',
        },
        {
          title: 'Cloud Storage Integration',
          description: 'Integrated OneDrive and Google Drive pickers to facilitate seamless document uploads and downloads, significantly enhancing user experience.',
        },
        {
          title: 'Redis Integration',
          description: 'Enhanced application performance by implementing Redis caching, reducing server load by 35% and improving response times by 50%.',
        },
        {
          title: 'Health Check Service',
          description: 'Designed and implemented a comprehensive health check service to monitor microservices, ensuring 99.9% uptime and enabling proactive issue resolution.',
        },
      ],
      techStack: 'ASP.NET, Web API, MVC, Blazor, C#, .NET Core, Entity Framework Core, SQL Server, Redis, REST APIs, OAuth 2.0, OpenID Connect, Google Drive API, OneDrive API, GitHub Actions',
    },
    {
      company: 'Z444 (EdTech Startup)',
      position: 'Co-Founder & Mentor',
      period: 'Oct 2024 - Present',
      location: 'Remote',
      website: 'https://z444.vercel.app',
      achievements: [
        {
          title: 'Platform Development',
          description: 'Co-founded Z444, an online platform to mentor juniors in programming and software development.',
        },
        {
          title: 'Student Mentorship',
          description: 'Guided juniors in interview preparation, coding challenges, and project building, helping them launch their tech careers.',
        },
      ],
    },
  ];

  return (
    <section id="experience" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Work <span className="text-gradient">Experience</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            My professional journey and key contributions
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="relative pl-8 border-l-4 border-blue-500 dark:border-blue-400 hover:border-purple-500 dark:hover:border-purple-400 transition-colors duration-300"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-3 top-0 w-6 h-6 bg-blue-500 dark:bg-blue-400 rounded-full border-4 border-white dark:border-gray-900 shadow-lg"></div>

              {/* Content Card */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-600">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {exp.position}
                    </h3>
                    <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2">
                      {exp.company}
                      {exp.website && (
                        <a
                          href={exp.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          🔗 Visit
                        </a>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-700 dark:text-gray-200 font-semibold">{exp.period}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{exp.location}</p>
                  </div>
                </div>

                {/* Achievements */}
                <div className="space-y-4">
                  {exp.achievements.map((achievement, achIndex) => (
                    <div key={achIndex} className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600">
                      <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2">
                        • {achievement.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {achievement.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Tech Stack */}
                {exp.techStack && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-500">
                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                      <strong>Tech Stack:</strong>
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-200">{exp.techStack}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
