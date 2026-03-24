export const netToAiBlogs = [
  {
    id: 'dotnet-to-ai-intro',
    slug: 'my-journey-from-dotnet-to-ai',
    title: 'My Journey: From .NET Developer to AI Engineer',
    excerpt: 'Sharing my personal roadmap and experiences transitioning from a traditional backend role to the world of Artificial Intelligence.',
    content: `
# My Journey: From .NET Developer to AI Engineer

Transitioning from a .NET background to AI is an exciting and challenging journey. In this series, I'll share how I leveraged my software engineering foundations to master machine learning and AI.

## The Foundation

As a .NET developer, I understood:
- Strong typing and OOP principles
- System architecture and design patterns
- Database management and query optimization
- API development and integration

## The Gap

What I needed to learn:
- Python and its ecosystem (NumPy, Pandas)
- Mathematical foundations (Linear Algebra, Calculus)
- Neural Networks and Deep Learning architectures
- MLOps and model deployment

## The Strategy

1. **Leveraging Existing Skills**: Backend logic helped with understanding data pipelines.
2. **Learning Python**: It felt dynamic and concise compared to C#, but lacked the strictness I was used to.
3. **Starting Small**: Simple regression models before jumping to LLMs.

Stay tuned for more detailed posts on each step of this transition!
    `,
    date: 'Mar 2024',
    readTime: '5 min read',
    category: 'dotnet-to-ai',
    tags: ['Career', '.NET', 'AI', 'Learning Path'],
    author: 'T Sai Ram Charan',
  },
  {
    id: 'csharp-vs-python-ai',
    slug: 'csharp-vs-python-for-ai',
    title: 'C# vs Python for AI: A .NET Developer\'s Perspective',
    excerpt: 'Comparing the two languages in the context of AI/ML development. Can you do AI in .NET?',
    content: `
# C# vs Python for AI

Is Python the only way? As a .NET developer, I explored using ML.NET and C# for AI tasks.

## The Python Advantage

- **Libraries**: PyTorch, TensorFlow, Scikit-learn are native to Python.
- **Community**: The vast majority of research is published in Python.

## The .NET Potential with ML.NET

- **Integration**: Seamlessly runs within existing ASP.NET Core apps.
- **Performance**: High performance for prediction and training in some scenarios.

## Verdict

For learning and cutting-edge research, Python is a must. For integrating standard ML models into enterprise .NET applications, ML.NET is a strong contender. I'll show you how to use both!
    `,
    date: 'Mar 2024',
    readTime: '7 min read',
    category: 'dotnet-to-ai',
    tags: ['C#', 'Python', 'ML.NET', 'Comparison'],
    author: 'T Sai Ram Charan',
  }
];

export const getNetToAiBlogBySlug = (slug) => {
    return netToAiBlogs.find(blog => blog.slug === slug);
};
