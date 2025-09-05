const { PrismaClient } = require('@prisma/client')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const prisma = new PrismaClient()

async function seedBlogData() {
  try {
    console.log('🌱 Seeding blog data...')

    // First, let's create some tags
    const tags = [
      { name: 'JavaScript', slug: 'javascript', description: 'JavaScript programming and development', color: '#F7DF1E' },
      { name: 'React', slug: 'react', description: 'React library and ecosystem', color: '#61DAFB' },
      { name: 'Python', slug: 'python', description: 'Python programming language', color: '#3776AB' },
      { name: 'Machine Learning', slug: 'machine-learning', description: 'Machine learning and AI', color: '#FF6F00' },
      { name: 'Web Development', slug: 'web-development', description: 'Web development technologies', color: '#3B82F6' },
      { name: 'Tutorial', slug: 'tutorial', description: 'Step-by-step tutorials', color: '#10B981' },
      { name: 'Tips', slug: 'tips', description: 'Programming tips and tricks', color: '#F59E0B' },
      { name: 'Career', slug: 'career', description: 'Career advice and development', color: '#8B5CF6' }
    ]

    const createdTags = []
    for (const tagData of tags) {
      const existingTag = await prisma.tag.findUnique({
        where: { slug: tagData.slug }
      })

      if (!existingTag) {
        const tag = await prisma.tag.create({
          data: tagData
        })
        createdTags.push(tag)
        console.log(`✅ Created tag: ${tag.name}`)
      } else {
        createdTags.push(existingTag)
        console.log(`ℹ️  Tag already exists: ${existingTag.name}`)
      }
    }

    // Get existing categories
    const categories = await prisma.category.findMany()
    console.log(`Found ${categories.length} existing categories`)

    // Get a user to be the author
    let author = await prisma.user.findFirst({
      where: { role: 'INSTRUCTOR' }
    })

    if (!author) {
      // Create a sample author if none exists
      author = await prisma.user.create({
        data: {
          email: 'blog.author@kalpla.in',
          name: 'Kalpla Blog Team',
          role: 'INSTRUCTOR',
          bio: 'Official blog team at Kalpla',
          isVerified: true
        }
      })
      console.log(`✅ Created author: ${author.name}`)
    }

    // Create sample blog posts
    const blogPosts = [
      {
        title: 'Getting Started with React: A Complete Beginner\'s Guide',
        slug: 'getting-started-with-react-complete-beginners-guide',
        content: `# Getting Started with React: A Complete Beginner's Guide

React has become one of the most popular JavaScript libraries for building user interfaces. Whether you're a complete beginner or coming from another framework, this guide will help you get started with React.

## What is React?

React is a JavaScript library created by Facebook for building user interfaces, particularly web applications. It allows you to create reusable UI components and manage the state of your application efficiently.

## Why Choose React?

- **Component-Based Architecture**: Build encapsulated components that manage their own state
- **Virtual DOM**: React uses a virtual DOM for better performance
- **Ecosystem**: Huge ecosystem of libraries and tools
- **Community**: Large, active community with lots of resources
- **Job Market**: High demand for React developers

## Setting Up Your First React App

The easiest way to get started with React is using Create React App:

\`\`\`bash
npx create-react-app my-first-react-app
cd my-first-react-app
npm start
\`\`\`

This will create a new React application and start the development server.

## Understanding Components

In React, everything is a component. A component is a piece of the UI that can be reused. Here's a simple example:

\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}
\`\`\`

## State and Props

- **Props**: Data passed down from parent components
- **State**: Data that belongs to a component and can change over time

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## Next Steps

1. Learn about JSX syntax
2. Understand component lifecycle
3. Explore React Hooks
4. Learn about state management
5. Build your first project

## Conclusion

React is a powerful tool for building modern web applications. Start with the basics, practice regularly, and don't be afraid to experiment. The React community is always there to help!

Happy coding! 🚀`,
        excerpt: 'Learn the fundamentals of React with this comprehensive beginner\'s guide. From setup to your first component, we\'ll cover everything you need to know.',
        featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
        status: 'PUBLISHED',
        visibility: 'PUBLIC',
        metaTitle: 'Getting Started with React - Complete Beginner\'s Guide',
        metaDescription: 'Learn React from scratch with this comprehensive guide. Perfect for beginners who want to start building modern web applications.',
        categoryIds: [categories.find(c => c.slug === 'web-development')?.id].filter(Boolean),
        tagIds: [createdTags.find(t => t.slug === 'react')?.id, createdTags.find(t => t.slug === 'javascript')?.id, createdTags.find(t => t.slug === 'tutorial')?.id].filter(Boolean)
      },
      {
        title: 'Python for Data Science: Essential Libraries You Need to Know',
        slug: 'python-data-science-essential-libraries',
        content: `# Python for Data Science: Essential Libraries You Need to Know

Python has become the go-to language for data science, thanks to its powerful libraries and easy-to-learn syntax. In this post, we'll explore the essential Python libraries every data scientist should know.

## Why Python for Data Science?

Python offers several advantages for data science:
- **Easy to learn**: Simple syntax and readable code
- **Rich ecosystem**: Extensive collection of libraries
- **Community support**: Large, active community
- **Integration**: Works well with other tools and languages
- **Versatility**: Can handle everything from data collection to deployment

## Essential Python Libraries

### 1. NumPy
NumPy is the foundation of the Python data science stack. It provides:
- N-dimensional arrays
- Mathematical functions
- Linear algebra operations
- Random number generation

\`\`\`python
import numpy as np

# Create an array
arr = np.array([1, 2, 3, 4, 5])
print(arr.mean())  # 3.0
\`\`\`

### 2. Pandas
Pandas is perfect for data manipulation and analysis:
- DataFrames and Series
- Data cleaning and preprocessing
- Data aggregation and grouping
- Time series analysis

\`\`\`python
import pandas as pd

# Create a DataFrame
df = pd.DataFrame({
    'Name': ['Alice', 'Bob', 'Charlie'],
    'Age': [25, 30, 35],
    'City': ['New York', 'London', 'Tokyo']
})
print(df.head())
\`\`\`

### 3. Matplotlib
Matplotlib is the most popular plotting library:
- Static, animated, and interactive visualizations
- Publication-quality figures
- Customizable plots
- Integration with Jupyter notebooks

\`\`\`python
import matplotlib.pyplot as plt

# Create a simple plot
x = np.linspace(0, 10, 100)
y = np.sin(x)
plt.plot(x, y)
plt.title('Sine Wave')
plt.show()
\`\`\`

### 4. Seaborn
Seaborn builds on matplotlib for statistical visualizations:
- Beautiful default styles
- Statistical plotting functions
- Easy-to-use interface
- Integration with pandas

### 5. Scikit-learn
Scikit-learn is the go-to library for machine learning:
- Classification, regression, clustering
- Model selection and evaluation
- Data preprocessing
- Dimensionality reduction

\`\`\`python
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

# Simple linear regression example
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = LinearRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)
\`\`\`

## Getting Started

1. **Install Python**: Use Anaconda or pip
2. **Set up Jupyter**: For interactive development
3. **Learn the basics**: Start with NumPy and Pandas
4. **Practice**: Work on real datasets
5. **Explore**: Try different libraries for your specific needs

## Conclusion

These libraries form the foundation of Python data science. Start with NumPy and Pandas, then gradually add others based on your needs. Remember, the best way to learn is by doing!

Happy analyzing! 📊`,
        excerpt: 'Discover the essential Python libraries every data scientist needs to know. From NumPy to Scikit-learn, learn how to build powerful data science workflows.',
        featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
        status: 'PUBLISHED',
        visibility: 'PUBLIC',
        metaTitle: 'Python Data Science Libraries - Essential Guide',
        metaDescription: 'Learn about the essential Python libraries for data science including NumPy, Pandas, Matplotlib, and Scikit-learn.',
        categoryIds: [categories.find(c => c.slug === 'data-science')?.id].filter(Boolean),
        tagIds: [createdTags.find(t => t.slug === 'python')?.id, createdTags.find(t => t.slug === 'machine-learning')?.id, createdTags.find(t => t.slug === 'tips')?.id].filter(Boolean)
      },
      {
        title: '10 JavaScript Tips That Will Make You a Better Developer',
        slug: '10-javascript-tips-better-developer',
        content: `# 10 JavaScript Tips That Will Make You a Better Developer

JavaScript is a powerful and flexible language, but it can be tricky to master. Here are 10 essential tips that will help you write better, more efficient JavaScript code.

## 1. Use const and let Instead of var

Always prefer \`const\` and \`let\` over \`var\` for better block scoping:

\`\`\`javascript
// Good
const name = 'John';
let age = 25;

// Avoid
var name = 'John';
var age = 25;
\`\`\`

## 2. Use Template Literals

Template literals make string concatenation much cleaner:

\`\`\`javascript
// Good
const message = \`Hello, \${name}! You are \${age} years old.\`;

// Avoid
const message = 'Hello, ' + name + '! You are ' + age + ' years old.';
\`\`\`

## 3. Use Destructuring

Destructuring makes your code more readable and concise:

\`\`\`javascript
// Object destructuring
const { name, age, city } = user;

// Array destructuring
const [first, second, third] = array;
\`\`\`

## 4. Use Arrow Functions

Arrow functions provide a more concise syntax:

\`\`\`javascript
// Good
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);

// Traditional function
const doubled = numbers.map(function(n) {
  return n * 2;
});
\`\`\`

## 5. Use Array Methods Effectively

Learn and use array methods like \`map\`, \`filter\`, \`reduce\`:

\`\`\`javascript
const users = [
  { name: 'John', age: 25, active: true },
  { name: 'Jane', age: 30, active: false },
  { name: 'Bob', age: 35, active: true }
];

// Get active users
const activeUsers = users.filter(user => user.active);

// Get user names
const names = users.map(user => user.name);

// Calculate average age
const avgAge = users.reduce((sum, user) => sum + user.age, 0) / users.length;
\`\`\`

## 6. Use Optional Chaining

Optional chaining (\`?.\`) helps avoid errors when accessing nested properties:

\`\`\`javascript
// Safe property access
const city = user?.address?.city;

// Safe method calling
const result = user?.getName?.();
\`\`\`

## 7. Use Nullish Coalescing

The nullish coalescing operator (\`??\`) provides a default value:

\`\`\`javascript
const name = user.name ?? 'Anonymous';
const count = data.count ?? 0;
\`\`\`

## 8. Use Async/Await

Async/await makes asynchronous code more readable:

\`\`\`javascript
// Good
async function fetchUser(id) {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
  }
}

// Avoid callback hell
function fetchUser(id, callback) {
  fetch(\`/api/users/\${id}\`)
    .then(response => response.json())
    .then(user => callback(null, user))
    .catch(error => callback(error, null));
}
\`\`\`

## 9. Use Object Spread

Object spread makes object manipulation easier:

\`\`\`javascript
const user = { name: 'John', age: 25 };
const updatedUser = { ...user, age: 26 };

// Merging objects
const config = { ...defaultConfig, ...userConfig };
\`\`\`

## 10. Use Modern ES6+ Features

Take advantage of modern JavaScript features:

\`\`\`javascript
// Default parameters
function greet(name = 'World') {
  return \`Hello, \${name}!\`;
}

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

// Modules
import { helper } from './utils.js';
export const myFunction = () => { /* ... */ };
\`\`\`

## Bonus Tip: Use a Linter

Use ESLint to catch common mistakes and enforce coding standards:

\`\`\`bash
npm install --save-dev eslint
npx eslint --init
\`\`\`

## Conclusion

These tips will help you write more maintainable, readable, and efficient JavaScript code. Practice them regularly, and they'll become second nature.

Remember, the best way to improve is through consistent practice and staying updated with the latest JavaScript features.

Happy coding! 🚀`,
        excerpt: 'Master JavaScript with these 10 essential tips that will make you a better developer. From modern ES6+ features to best practices.',
        featuredImage: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=400&fit=crop',
        status: 'PUBLISHED',
        visibility: 'PUBLIC',
        metaTitle: '10 JavaScript Tips for Better Development',
        metaDescription: 'Learn 10 essential JavaScript tips and best practices that will make you a more efficient and skilled developer.',
        categoryIds: [categories.find(c => c.slug === 'web-development')?.id].filter(Boolean),
        tagIds: [createdTags.find(t => t.slug === 'javascript')?.id, createdTags.find(t => t.slug === 'tips')?.id, createdTags.find(t => t.slug === 'career')?.id].filter(Boolean)
      }
    ]

    for (const postData of blogPosts) {
      const existingPost = await prisma.post.findUnique({
        where: { slug: postData.slug }
      })

      if (!existingPost) {
        // Create the post
        const post = await prisma.post.create({
          data: {
            title: postData.title,
            slug: postData.slug,
            content: postData.content,
            excerpt: postData.excerpt,
            featuredImage: postData.featuredImage,
            status: postData.status,
            visibility: postData.visibility,
                    metaTitle: postData.metaTitle,
            authorId: author.id,
            publishedAt: new Date()
          }
        })

        // Add categories
        if (postData.categoryIds.length > 0) {
          for (const categoryId of postData.categoryIds) {
            await prisma.postCategory.create({
              data: {
                postId: post.id,
                categoryId: categoryId,
                status: 'PUBLISHED',
                publishedAt: new Date()
              }
            })
          }
        }

        // Add tags
        if (postData.tagIds.length > 0) {
          for (const tagId of postData.tagIds) {
            await prisma.postTag.create({
              data: {
                postId: post.id,
                tagId: tagId
              }
            })
          }
        }

        console.log(`✅ Created blog post: ${post.title}`)
      } else {
        console.log(`ℹ️  Blog post already exists: ${existingPost.title}`)
      }
    }

    console.log('🎉 Blog data seeded successfully!')

  } catch (error) {
    console.error('❌ Error seeding blog data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedBlogData()