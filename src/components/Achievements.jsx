const Achievements = () => {
  const achievements = [
    {
      icon: '🏆',
      title: 'Smart Coder Certification',
      description: 'Certified as Smart Coder by Smart Interviews for being among top 1% of their community',
      color: 'from-yellow-400 to-orange-500',
    },
    {
      icon: '🥉',
      title: 'Top 3 Academic Rank',
      description: 'Ranked in Top 3 for Academic Performance in Computer Science branch',
      color: 'from-blue-400 to-purple-500',
    },
    {
      icon: '🎓',
      title: 'Outstanding CGPA',
      description: 'Achieved 9.24 CGPA in B.Tech Computer Science Engineering',
      color: 'from-green-400 to-teal-500',
    },
    {
      icon: '📝',
      title: 'Published Research Paper',
      description: 'Published paper on Handwritten Calculator using Contour Detection in IJISRT',
      color: 'from-pink-400 to-red-500',
    },
  ];

  const certifications = [
    {
      title: 'Data Structures and Algorithms',
      provider: 'Smart Interviews',
      link: 'https://smartinterviews.in/certificate/14421b49',
    },
    {
      title: 'Version Control with Git',
      provider: 'Coursera',
      link: 'https://coursera.org/share/3b0c11703a8b4d71acfcd7e45d6fefc9',
    },
  ];

  const profiles = [
    { name: 'LeetCode', icon: '💻', link: 'https://leetcode.com/TSR_CHARAN/' },
    { name: 'GeeksforGeeks', icon: '🔥', link: 'https://auth.geeksforgeeks.org/user/srct' },
    { name: 'CodeChef', icon: '👨‍🍳', link: 'https://www.codechef.com/users/tsr_charan' },
    { name: 'HackerRank', icon: '🎯', link: 'https://www.hackerrank.com/tsr_charan' },
  ];

  return (
    <section id="achievements" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Achievements & <span className="text-gradient">Recognition</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`text-4xl bg-gradient-to-br ${achievement.color} p-3 rounded-xl shadow-lg`}
                >
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {achievement.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Certifications
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {certifications.map((cert, index) => (
              <a
                key={index}
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {cert.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{cert.provider}</p>
                  </div>
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    📜
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Coding Profiles */}
        <div>
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Coding Profiles
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {profiles.map((profile, index) => (
              <a
                key={index}
                href={profile.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 text-center group border border-gray-200 dark:border-gray-700"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {profile.icon}
                </div>
                <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {profile.name}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;
