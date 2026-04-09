export const blogCategories = [
  {
    id: 'dotnet-backend',
    name: '.NET & Backend',
    icon: '💻',
    color: 'from-blue-400 to-indigo-600',
    bgColor: 'from-blue-50 to-indigo-50',
  },
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    icon: '🤖',
    color: 'from-purple-400 to-pink-600',
    bgColor: 'from-purple-50 to-pink-50',
  },
  {
    id: 'web-dev',
    name: 'Web Development',
    icon: '🌐',
    color: 'from-green-400 to-teal-600',
    bgColor: 'from-green-50 to-teal-50',
  },
  {
    id: 'cloud-devops',
    name: 'Cloud & DevOps',
    icon: '☁️',
    color: 'from-cyan-400 to-blue-600',
    bgColor: 'from-cyan-50 to-blue-50',
  },
];

export const blogs = [
  // .NET & Backend
  {
    id: 'microservices-dotnet',
    slug: 'building-microservices-with-dotnet-core',
    title: 'Building Microservices with .NET Core',
    excerpt: 'Learn how to design and implement scalable microservices architecture using .NET Core and Docker.',
    content: `
# Building Microservices with .NET Core

Microservices architecture has become the go-to pattern for building scalable, maintainable applications. In this article, we'll explore how to build microservices using .NET Core.

## What are Microservices?

Microservices are small, independent services that work together to form a larger application. Each service focuses on a specific business capability and can be developed, deployed, and scaled independently.

## Key Benefits

1. **Scalability** - Scale individual services based on demand
2. **Technology Diversity** - Use different tech stacks for different services
3. **Fault Isolation** - Failures in one service don't bring down the entire system
4. **Independent Deployment** - Deploy services independently

## Getting Started with .NET Core

\`\`\`csharp
// Sample Microservice Startup
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers();
        services.AddSwaggerGen();
    }
}
\`\`\`

Stay tuned for more detailed implementation guides!
    `,
    date: 'Nov 2024',
    readTime: '8 min read',
    category: 'dotnet-backend',
    tags: ['.NET Core', 'Microservices', 'Docker', 'Architecture'],
    author: 'T Sai Ram Charan',
  },
  {
    id: 'oauth-implementation',
    slug: 'oauth-2-implementation-guide',
    title: 'OAuth 2.0 Implementation Guide',
    excerpt: 'A comprehensive guide to implementing OAuth 2.0 and OpenID Connect for secure authentication.',
    content: `
# OAuth 2.0 Implementation Guide

OAuth 2.0 is the industry-standard protocol for authorization. This guide will walk you through implementing OAuth 2.0 in your applications.

## Understanding OAuth 2.0

OAuth 2.0 provides secure delegated access, allowing applications to access resources on behalf of a user without exposing credentials.

## Key Components

- **Resource Owner**: The user
- **Client**: Your application
- **Authorization Server**: Issues tokens
- **Resource Server**: Hosts protected resources

## Implementation Steps

1. Register your application
2. Request authorization
3. Exchange code for tokens
4. Access protected resources

More details coming soon!
    `,
    date: 'Oct 2024',
    readTime: '10 min read',
    category: 'dotnet-backend',
    tags: ['OAuth', 'Security', 'Authentication', 'OpenID'],
    author: 'T Sai Ram Charan',
  },
  
  // AI & ML
  {
    id: 'tensorflow-intro',
    slug: 'getting-started-with-tensorflow',
    title: 'Getting Started with TensorFlow',
    excerpt: 'Introduction to building and training neural networks using TensorFlow and Keras.',
    content: `
# Getting Started with TensorFlow

TensorFlow is one of the most popular frameworks for machine learning and deep learning. Let's dive into building your first neural network.

## What is TensorFlow?

TensorFlow is an open-source platform for machine learning developed by Google. It provides a comprehensive ecosystem for building and deploying ML models.

## Your First Neural Network

\`\`\`python
import tensorflow as tf
from tensorflow import keras

# Build a simple model
model = keras.Sequential([
    keras.layers.Dense(128, activation='relu'),
    keras.layers.Dense(10, activation='softmax')
])

model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])
\`\`\`

## Next Steps

- Train your model
- Evaluate performance
- Deploy to production

Happy learning!
    `,
    date: 'Oct 2024',
    readTime: '12 min read',
    category: 'ai-ml',
    tags: ['TensorFlow', 'Neural Networks', 'Python', 'Deep Learning'],
    author: 'T Sai Ram Charan',
  },
  {
    id: 'ml-deployment',
    slug: 'machine-learning-model-deployment',
    title: 'Machine Learning Model Deployment',
    excerpt: 'Best practices for deploying ML models to production using FastAPI and Docker.',
    content: `
# Machine Learning Model Deployment

Deploying ML models to production requires careful planning and the right tools. This guide covers best practices for production deployments.

## Deployment Options

1. **REST API** - Using FastAPI or Flask
2. **Serverless** - AWS Lambda, Azure Functions
3. **Containerized** - Docker and Kubernetes
4. **Edge Deployment** - TensorFlow Lite

## FastAPI Example

\`\`\`python
from fastapi import FastAPI
import joblib

app = FastAPI()
model = joblib.load('model.pkl')

@app.post("/predict")
async def predict(data: dict):
    prediction = model.predict([data['features']])
    return {"prediction": prediction.tolist()}
\`\`\`

More deployment strategies coming soon!
    `,
    date: 'Sep 2024',
    readTime: '9 min read',
    category: 'ai-ml',
    tags: ['ML', 'FastAPI', 'Deployment', 'Docker'],
    author: 'T Sai Ram Charan',
  },
  
  // Web Development
  {
    id: 'react-performance',
    slug: 'react-performance-optimization',
    title: 'React Performance Optimization',
    excerpt: 'Essential techniques to optimize React applications for better performance and user experience.',
    content: `
# React Performance Optimization

Learn how to make your React applications lightning fast with these optimization techniques.

## Common Performance Issues

- Unnecessary re-renders
- Large bundle sizes
- Inefficient state management
- Memory leaks

## Optimization Techniques

### 1. Use React.memo

\`\`\`javascript
const MyComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});
\`\`\`

### 2. useMemo and useCallback

\`\`\`javascript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
\`\`\`

## Measuring Performance

Use React DevTools Profiler to identify bottlenecks and measure improvements.
    `,
    date: 'Nov 2024',
    readTime: '7 min read',
    category: 'web-dev',
    tags: ['React', 'Performance', 'JavaScript', 'Optimization'],
    author: 'T Sai Ram Charan',
  },
  {
    id: 'tailwind-css',
    slug: 'modern-css-with-tailwind',
    title: 'Modern CSS with Tailwind',
    excerpt: 'Building responsive and beautiful UIs using Tailwind CSS utility-first approach.',
    content: `
# Modern CSS with Tailwind

Tailwind CSS revolutionizes how we write CSS. Let's explore this utility-first framework.

## Why Tailwind?

- **Utility-First** - Build complex designs without custom CSS
- **Responsive** - Built-in responsive design utilities
- **Customizable** - Easy to customize and extend
- **Performance** - Purge unused CSS in production

## Example

\`\`\`html
<div class="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
  <h1 class="text-4xl font-bold text-white">
    Hello Tailwind!
  </h1>
</div>
\`\`\`

## Best Practices

1. Use @apply for repeated patterns
2. Configure your design tokens
3. Use JIT mode for faster builds
4. Keep components small and focused

Start building amazing UIs today!
    `,
    date: 'Oct 2024',
    readTime: '6 min read',
    category: 'web-dev',
    tags: ['CSS', 'Tailwind', 'UI/UX', 'Web Design'],
    author: 'T Sai Ram Charan',
  },
  
  // Cloud & DevOps
  {
    id: 'azure-deployment',
    slug: 'azure-deployment-strategies',
    title: 'Azure Deployment Strategies',
    excerpt: 'Exploring different deployment strategies for applications on Microsoft Azure cloud platform.',
    content: `
# Azure Deployment Strategies

Microsoft Azure offers multiple deployment strategies. Let's explore which one fits your needs.

## Deployment Options

### 1. Blue-Green Deployment
Zero-downtime deployments by maintaining two identical environments.

### 2. Canary Deployment
Gradually roll out changes to a small subset of users first.

### 3. Rolling Deployment
Update instances gradually without downtime.

## Azure Services

- **App Service** - Easy deployment for web apps
- **AKS** - Kubernetes orchestration
- **Container Instances** - Serverless containers
- **Functions** - Serverless compute

## Sample Configuration

\`\`\`yaml
# Azure Pipeline YAML
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: Docker@2
    inputs:
      command: buildAndPush
\`\`\`

Choose the right strategy for your application!
    `,
    date: 'Sep 2024',
    readTime: '11 min read',
    category: 'cloud-devops',
    tags: ['Azure', 'Cloud', 'DevOps', 'Deployment'],
    author: 'T Sai Ram Charan',
  },
  {
    id: 'github-actions-ci-cd',
    slug: 'ci-cd-with-github-actions',
    title: 'CI/CD with GitHub Actions',
    excerpt: 'Automating your deployment pipeline using GitHub Actions for continuous integration and delivery.',
    content: `
# CI/CD with GitHub Actions

Automate your entire development workflow with GitHub Actions.

## What is CI/CD?

**Continuous Integration** - Automatically build and test code changes
**Continuous Delivery** - Automatically deploy to production

## GitHub Actions Workflow

\`\`\`yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
    
    - name: Deploy
      run: npm run deploy
\`\`\`

## Benefits

- Automated testing
- Consistent deployments
- Fast feedback loops
- Version control integration

Start automating today!
    `,
    date: 'Aug 2024',
    readTime: '8 min read',
    category: 'cloud-devops',
    tags: ['CI/CD', 'GitHub Actions', 'Automation', 'DevOps'],
    author: 'T Sai Ram Charan',
  },
];

// Helper functions
export const getBlogsByCategory = (categoryId) => {
  return blogs.filter(blog => blog.category === categoryId);
};

export const getBlogBySlug = (slug) => {
  return blogs.find(blog => blog.slug === slug);
};

export const getCategoryById = (categoryId) => {
  return blogCategories.find(cat => cat.id === categoryId);
};

// Get all unique tags from blogs
export const getAllTags = () => {
  const tagsSet = new Set();
  blogs.forEach(blog => {
    blog.tags.forEach(tag => tagsSet.add(tag));
  });
  return Array.from(tagsSet).sort();
};

// Search blogs by title, excerpt, or tags
export const searchBlogs = (searchTerm, blogsToSearch = blogs) => {
  if (!searchTerm.trim()) return blogsToSearch;
  
  const term = searchTerm.toLowerCase();
  return blogsToSearch.filter(blog => 
    blog.title.toLowerCase().includes(term) ||
    blog.excerpt.toLowerCase().includes(term) ||
    blog.tags.some(tag => tag.toLowerCase().includes(term))
  );
};

// Filter blogs by tags
export const filterBlogsByTags = (selectedTags, blogsToFilter = blogs) => {
  if (selectedTags.length === 0) return blogsToFilter;
  
  return blogsToFilter.filter(blog =>
    selectedTags.some(selectedTag => 
      blog.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
    )
  );
};

// Sort blogs
export const sortBlogs = (blogsToSort, sortBy) => {
  const sorted = [...blogsToSort];
  
  switch (sortBy) {
    case 'newest':
      // Assuming newer blogs have more recent dates
      return sorted.reverse();
    case 'oldest':
      return sorted;
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sorted;
  }
};
