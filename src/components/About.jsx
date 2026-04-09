const About = () => {
  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            About <span className="text-gradient">Me</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image/Illustration */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl flex items-center justify-center overflow-hidden shadow-xl">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">👨‍💻</div>
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                  Passionate Developer
                </p>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500 dark:bg-blue-600 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500 dark:bg-purple-600 rounded-full opacity-20 animate-pulse delay-75"></div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              I am a Software Engineer with a strong foundation in backend engineering and applied AI and Machine learning. I currently work as a Software Engineer (AI & Backend) and build AI-powered systems using ML, NLP, RAG and LLMs.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              My experience includes developing machine learning models for prediction and classification, building NLP pipelines for intent detection, and deploying AI systems using FastAPI, Python, .Net and Node.js.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              I hold a BTech in Artificial Intelligence and Data Science from SRKR Engineering College and am pursuing a Master's degree at BITS Pilani. With certifications in Python for Data Science and Version Control with Git, I aim to further enhance my technical expertise and contribute to the advancement of AI-powered systems.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              I have built AI-powered products including a conversational assistant with memory, an NLP-based intent classifier, and ML systems for behaviour prediction and personalization. I am interested in roles where I can build and scale real-world AI systems.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              I'm also a co-founder of <strong>Z444</strong>, an EdTech startup where I mentor juniors in programming and software development. When I'm not coding, you'll find me solving DSA problems or exploring machine learning algorithms.
            </p>

            {/* Quick Facts */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">M.Tech</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">BITS Pilani</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">Co-Founder</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Z444</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
