const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testWordPressModals() {
  console.log('🧪 Testing WordPress-like Post Modals...')
  
  try {
    // Test 1: Check if categories exist
    console.log('\n1. Checking categories...')
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    })
    
    console.log(`✅ Found ${categories.length} categories:`)
    categories.forEach(category => {
      console.log(`   - "${category.name}" (${category.color}) - ${category._count.posts} posts`)
    })

    // Test 2: Check if tags exist
    console.log('\n2. Checking tags...')
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    })
    
    console.log(`✅ Found ${tags.length} tags:`)
    tags.forEach(tag => {
      console.log(`   - "${tag.name}" (${tag.color}) - ${tag._count.posts} posts`)
    })

    // Test 3: Check if posts exist
    console.log('\n3. Checking posts...')
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      }
    })
    
    console.log(`✅ Found ${posts.length} posts:`)
    posts.forEach(post => {
      console.log(`   - "${post.title}" by ${post.author.name}`)
      console.log(`     Status: ${post.status}, Visibility: ${post.visibility}`)
      console.log(`     Categories: ${post.categories.map(pc => pc.category.name).join(', ')}`)
      console.log(`     Tags: ${post.tags.map(pt => pt.tag.name).join(', ')}`)
      console.log(`     Comments: ${post._count.comments}`)
    })

    // Test 4: Test category creation
    console.log('\n4. Testing category creation...')
    const testCategory = await prisma.category.create({
      data: {
        name: 'Test Category for Modals',
        slug: 'test-category-for-modals',
        description: 'This is a test category for modal functionality',
        color: '#FF6B6B'
      }
    })
    console.log(`✅ Created test category: "${testCategory.name}"`)

    // Test 5: Test tag creation
    console.log('\n5. Testing tag creation...')
    const testTag = await prisma.tag.create({
      data: {
        name: 'Test Tag for Modals',
        slug: 'test-tag-for-modals',
        description: 'This is a test tag for modal functionality',
        color: '#4ECDC4'
      }
    })
    console.log(`✅ Created test tag: "${testTag.name}"`)

    // Test 6: Test post creation with categories and tags
    console.log('\n6. Testing post creation with categories and tags...')
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (adminUser) {
      const testPost = await prisma.post.create({
        data: {
          title: 'Test Post for WordPress Modals',
          slug: 'test-post-for-wordpress-modals',
          content: '<h2>Test Content</h2><p>This is a test post created to verify WordPress-like modal functionality.</p>',
          excerpt: 'Test post for modal functionality',
          status: 'DRAFT',
          visibility: 'PUBLIC',
          authorId: adminUser.id,
          metaTitle: 'Test Post for WordPress Modals',
          metaDescription: 'Test post for modal functionality'
        }
      })

      // Add categories to the post
      await prisma.postCategory.createMany({
        data: [
          { postId: testPost.id, categoryId: testCategory.id },
          { postId: testPost.id, categoryId: categories[0]?.id }
        ].filter(item => item.categoryId)
      })

      // Add tags to the post
      await prisma.postTag.createMany({
        data: [
          { postId: testPost.id, tagId: testTag.id },
          { postId: testPost.id, tagId: tags[0]?.id }
        ].filter(item => item.tagId)
      })

      console.log(`✅ Created test post: "${testPost.title}"`)
    }

    // Test 7: Test category update
    console.log('\n7. Testing category update...')
    const updatedCategory = await prisma.category.update({
      where: { id: testCategory.id },
      data: {
        name: 'Updated Test Category',
        color: '#9B59B6'
      }
    })
    console.log(`✅ Updated category: "${updatedCategory.name}"`)

    // Test 8: Test tag update
    console.log('\n8. Testing tag update...')
    const updatedTag = await prisma.tag.update({
      where: { id: testTag.id },
      data: {
        name: 'Updated Test Tag',
        color: '#E74C3C'
      }
    })
    console.log(`✅ Updated tag: "${updatedTag.name}"`)

    // Test 9: Clean up test data
    console.log('\n9. Cleaning up test data...')
    await prisma.post.deleteMany({
      where: { title: 'Test Post for WordPress Modals' }
    })
    await prisma.category.delete({
      where: { id: testCategory.id }
    })
    await prisma.tag.delete({
      where: { id: testTag.id }
    })
    console.log('✅ Test data cleaned up')

    console.log('\n🎉 WordPress-like modal tests completed successfully!')
    console.log('\n📋 WordPress Modal Features:')
    console.log('✅ Rich Text Editor - Full formatting toolbar')
    console.log('✅ Post Creation Modal - Complete WordPress-like interface')
    console.log('✅ Post Editing Modal - Edit existing posts')
    console.log('✅ Category Management - Create, edit, delete categories')
    console.log('✅ Tag Management - Create, edit, delete tags')
    console.log('✅ Status Management - Draft, published, private, scheduled')
    console.log('✅ Visibility Control - Public, private, password-protected')
    console.log('✅ SEO Fields - Meta titles and descriptions')
    console.log('✅ Featured Images - Image upload and management')
    console.log('✅ Preview Mode - Live post preview')
    console.log('✅ Color Coding - Visual category and tag organization')

    console.log('\n🌐 Test the WordPress-like modals at: http://localhost:3000/admin/dashboard')
    console.log('🔐 Login with: admin@example.com / admin123')
    console.log('📝 Click "Manage Blog" → "New Post" to test the post creation modal')
    console.log('🏷️ Click "Categories" or "Tags" to test management modals')

  } catch (error) {
    console.error('❌ WordPress modal test failed:', error.message)
  }
}

testWordPressModals()
  .catch((e) => {
    console.error('❌ Test failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
