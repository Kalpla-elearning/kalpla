const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedBlogData() {
  console.log('🌱 Seeding WordPress-like blog data...')
  
  try {
    // Create categories
    console.log('\n1. Creating categories...')
    const categories = [
      { name: 'Technology', description: 'Latest tech news and tutorials', color: '#3B82F6' },
      { name: 'Web Development', description: 'Frontend and backend development', color: '#10B981' },
      { name: 'Design', description: 'UI/UX design and creative content', color: '#F59E0B' },
      { name: 'Business', description: 'Entrepreneurship and business insights', color: '#EF4444' },
      { name: 'Education', description: 'Learning and educational content', color: '#8B5CF6' }
    ]

    const createdCategories = []
    for (const category of categories) {
      const slug = category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const created = await prisma.category.create({
        data: {
          name: category.name,
          slug,
          description: category.description,
          color: category.color
        }
      })
      createdCategories.push(created)
      console.log(`✅ Created category: "${created.name}"`)
    }

    // Create tags
    console.log('\n2. Creating tags...')
    const tags = [
      { name: 'React', description: 'React.js framework', color: '#61DAFB' },
      { name: 'JavaScript', description: 'JavaScript programming', color: '#F7DF1E' },
      { name: 'Node.js', description: 'Node.js backend development', color: '#339933' },
      { name: 'CSS', description: 'CSS styling and design', color: '#1572B6' },
      { name: 'HTML', description: 'HTML markup language', color: '#E34F26' },
      { name: 'TypeScript', description: 'TypeScript programming', color: '#3178C6' },
      { name: 'Next.js', description: 'Next.js framework', color: '#000000' },
      { name: 'Tutorial', description: 'Step-by-step tutorials', color: '#10B981' },
      { name: 'Tips', description: 'Useful tips and tricks', color: '#F59E0B' },
      { name: 'News', description: 'Latest news and updates', color: '#EF4444' }
    ]

    const createdTags = []
    for (const tag of tags) {
      const slug = tag.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const created = await prisma.tag.create({
        data: {
          name: tag.name,
          slug,
          description: tag.description,
          color: tag.color
        }
      })
      createdTags.push(created)
      console.log(`✅ Created tag: "${created.name}"`)
    }

    // Get admin user
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (!adminUser) {
      console.log('❌ No admin user found. Please create an admin user first.')
      return
    }

    // Create blog posts
    console.log('\n3. Creating blog posts...')
    const posts = [
      {
        title: 'Getting Started with Next.js 14',
        excerpt: 'Learn how to build modern web applications with Next.js 14 and its new features.',
        content: `
          <h2>Introduction to Next.js 14</h2>
          <p>Next.js 14 brings exciting new features and improvements to the React framework. In this comprehensive guide, we'll explore the latest updates and how to get started.</p>
          
          <h3>Key Features</h3>
          <ul>
            <li>App Router improvements</li>
            <li>Enhanced performance</li>
            <li>Better TypeScript support</li>
            <li>Improved developer experience</li>
          </ul>
          
          <h3>Getting Started</h3>
          <p>To create a new Next.js 14 project, run the following command:</p>
          <pre><code>npx create-next-app@latest my-app</code></pre>
          
          <p>This will create a new Next.js application with all the latest features and best practices.</p>
        `,
        status: 'PUBLISHED',
        visibility: 'PUBLIC',
        categoryIds: [createdCategories[0].id, createdCategories[1].id],
        tagIds: [createdTags[0].id, createdTags[1].id, createdTags[6].id, createdTags[7].id]
      },
      {
        title: 'Mastering React Hooks in 2024',
        excerpt: 'A deep dive into React Hooks and how to use them effectively in modern React applications.',
        content: `
          <h2>Understanding React Hooks</h2>
          <p>React Hooks revolutionized how we write React components. They allow us to use state and other React features in functional components.</p>
          
          <h3>Common Hooks</h3>
          <ul>
            <li><strong>useState:</strong> Manage component state</li>
            <li><strong>useEffect:</strong> Handle side effects</li>
            <li><strong>useContext:</strong> Access React context</li>
            <li><strong>useReducer:</strong> Complex state management</li>
          </ul>
          
          <h3>Best Practices</h3>
          <p>When using hooks, follow these best practices:</p>
          <ol>
            <li>Only call hooks at the top level</li>
            <li>Don't call hooks inside loops or conditions</li>
            <li>Use custom hooks to extract component logic</li>
          </ol>
        `,
        status: 'PUBLISHED',
        visibility: 'PUBLIC',
        categoryIds: [createdCategories[1].id],
        tagIds: [createdTags[0].id, createdTags[1].id, createdTags[7].id]
      },
      {
        title: 'CSS Grid vs Flexbox: When to Use Which',
        excerpt: 'Learn the differences between CSS Grid and Flexbox and when to use each layout method.',
        content: `
          <h2>CSS Layout Methods</h2>
          <p>CSS Grid and Flexbox are two powerful layout systems in CSS. Understanding when to use each is crucial for modern web development.</p>
          
          <h3>CSS Grid</h3>
          <p>CSS Grid is perfect for two-dimensional layouts. Use it when you need to control both rows and columns.</p>
          
          <h3>Flexbox</h3>
          <p>Flexbox is ideal for one-dimensional layouts. Use it for aligning items in a single direction.</p>
          
          <h3>When to Use Each</h3>
          <ul>
            <li><strong>Use Grid:</strong> Overall page layout, complex 2D layouts</li>
            <li><strong>Use Flexbox:</strong> Component layouts, aligning items in one direction</li>
          </ul>
        `,
        status: 'PUBLISHED',
        visibility: 'PUBLIC',
        categoryIds: [createdCategories[2].id, createdCategories[1].id],
        tagIds: [createdTags[3].id, createdTags[7].id, createdTags[8].id]
      },
      {
        title: 'Building Scalable Node.js Applications',
        excerpt: 'Best practices for building scalable and maintainable Node.js applications.',
        content: `
          <h2>Scalable Node.js Architecture</h2>
          <p>Building scalable Node.js applications requires careful planning and following best practices.</p>
          
          <h3>Key Principles</h3>
          <ul>
            <li>Modular architecture</li>
            <li>Proper error handling</li>
            <li>Performance optimization</li>
            <li>Security best practices</li>
          </ul>
          
          <h3>Tools and Libraries</h3>
          <p>Essential tools for Node.js development:</p>
          <ul>
            <li>Express.js for web frameworks</li>
            <li>Prisma for database management</li>
            <li>Jest for testing</li>
            <li>ESLint for code quality</li>
          </ul>
        `,
        status: 'DRAFT',
        visibility: 'PUBLIC',
        categoryIds: [createdCategories[0].id, createdCategories[1].id],
        tagIds: [createdTags[2].id, createdTags[1].id, createdTags[7].id]
      },
      {
        title: 'The Future of Web Development',
        excerpt: 'Exploring emerging trends and technologies that will shape the future of web development.',
        content: `
          <h2>Emerging Technologies</h2>
          <p>The web development landscape is constantly evolving. Here are the trends to watch in 2024.</p>
          
          <h3>AI and Machine Learning</h3>
          <p>AI is becoming increasingly integrated into web applications, from chatbots to content generation.</p>
          
          <h3>WebAssembly</h3>
          <p>WebAssembly enables high-performance applications to run in the browser.</p>
          
          <h3>Progressive Web Apps</h3>
          <p>PWAs continue to bridge the gap between web and native applications.</p>
        `,
        status: 'PUBLISHED',
        visibility: 'PUBLIC',
        categoryIds: [createdCategories[0].id],
        tagIds: [createdTags[9].id, createdTags[8].id]
      }
    ]

    const createdPosts = []
    for (const post of posts) {
      const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const created = await prisma.post.create({
        data: {
          title: post.title,
          slug,
          content: post.content,
          excerpt: post.excerpt,
          status: post.status,
          visibility: post.visibility,
          authorId: adminUser.id,
          publishedAt: post.status === 'PUBLISHED' ? new Date() : null,
          metaTitle: post.title,
          metaDescription: post.excerpt
        }
      })

      // Add categories
      if (post.categoryIds.length > 0) {
        await prisma.postCategory.createMany({
          data: post.categoryIds.map((categoryId) => ({
            postId: created.id,
            categoryId
          }))
        })
      }

      // Add tags
      if (post.tagIds.length > 0) {
        await prisma.postTag.createMany({
          data: post.tagIds.map((tagId) => ({
            postId: created.id,
            tagId
          }))
        })
      }

      createdPosts.push(created)
      console.log(`✅ Created post: "${created.title}" - ${created.status}`)
    }

    // Create some comments
    console.log('\n4. Creating comments...')
    const comments = [
      {
        content: 'Great article! Very helpful for beginners.',
        postId: createdPosts[0].id,
        authorId: adminUser.id,
        status: 'APPROVED',
        isApproved: true
      },
      {
        content: 'Thanks for sharing these insights. Looking forward to more content!',
        postId: createdPosts[1].id,
        authorId: adminUser.id,
        status: 'APPROVED',
        isApproved: true
      },
      {
        content: 'This is exactly what I was looking for. Clear and concise explanation.',
        postId: createdPosts[2].id,
        authorId: adminUser.id,
        status: 'PENDING',
        isApproved: false
      }
    ]

    for (const comment of comments) {
      const created = await prisma.comment.create({
        data: comment
      })
      console.log(`✅ Created comment: "${created.content.substring(0, 50)}..."`)
    }

    console.log('\n🎉 WordPress-like blog data seeded successfully!')
    console.log('\n📊 Blog Statistics:')
    console.log(`   - Categories: ${createdCategories.length}`)
    console.log(`   - Tags: ${createdTags.length}`)
    console.log(`   - Posts: ${createdPosts.length}`)
    console.log(`   - Comments: ${comments.length}`)

    console.log('\n🌐 Test the blog at: http://localhost:3000/admin/dashboard')
    console.log('🔐 Login with: admin@example.com / admin123')
    console.log('📝 Click "Manage Blog" to access the WordPress-like blog dashboard')

  } catch (error) {
    console.error('❌ Blog seeding failed:', error.message)
  }
}

seedBlogData()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
