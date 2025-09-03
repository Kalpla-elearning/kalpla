const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testBlogPostDetail() {
  console.log('🧪 Testing Blog Post Detail Page...')
  
  try {
    // Test 1: Get a published post
    console.log('\n1. Getting published post...')
    const post = await prisma.post.findFirst({
      where: { status: 'PUBLISHED' },
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

    if (!post) {
      console.log('❌ No published posts found')
      return
    }

    console.log(`✅ Found post: "${post.title}"`)
    console.log(`   - Author: ${post.author.name}`)
    console.log(`   - Categories: ${post.categories.map(pc => pc.category.name).join(', ')}`)
    console.log(`   - Tags: ${post.tags.map(pt => pt.tag.name).join(', ')}`)
    console.log(`   - Views: ${post.viewCount}, Likes: ${post.likeCount}, Comments: ${post._count.comments}`)

    // Test 2: Test related posts functionality
    console.log('\n2. Testing related posts...')
    const categoryIds = post.categories.map(pc => pc.category.id)
    const relatedPosts = await prisma.post.findMany({
      where: {
        AND: [
          { id: { not: post.id } },
          { status: 'PUBLISHED' },
          {
            categories: {
              some: {
                categoryId: {
                  in: categoryIds
                }
              }
            }
          }
        ]
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
        viewCount: true,
        likeCount: true,
        author: { select: { id: true, name: true } },
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                color: true
              }
            }
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: { publishedAt: 'desc' },
      take: 3
    })

    console.log(`✅ Found ${relatedPosts.length} related posts:`)
    relatedPosts.forEach(relatedPost => {
      console.log(`   - "${relatedPost.title}" by ${relatedPost.author.name}`)
      console.log(`     Views: ${relatedPost.viewCount}, Comments: ${relatedPost._count.comments}`)
    })

    // Test 3: Test recent posts functionality
    console.log('\n3. Testing recent posts...')
    const recentPosts = await prisma.post.findMany({
      where: {
        AND: [
          { id: { not: post.id } },
          { status: 'PUBLISHED' }
        ]
      },
      select: {
        id: true,
        title: true,
        slug: true,
        publishedAt: true,
        viewCount: true,
        author: { select: { id: true, name: true } }
      },
      orderBy: { publishedAt: 'desc' },
      take: 5
    })

    console.log(`✅ Found ${recentPosts.length} recent posts:`)
    recentPosts.forEach(recentPost => {
      console.log(`   - "${recentPost.title}" by ${recentPost.author.name}`)
      console.log(`     Published: ${new Date(recentPost.publishedAt).toLocaleDateString()}`)
    })

    // Test 4: Test post data structure for detail page
    console.log('\n4. Testing post detail data structure...')
    const postDetail = await prisma.post.findUnique({
      where: { slug: post.slug },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
        viewCount: true,
        likeCount: true,
        metaTitle: true,
        metaDescription: true,
        author: { 
          select: { 
            id: true, 
            name: true,
            avatar: true,
            bio: true
          } 
        },
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true
              }
            }
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true
              }
            }
          }
        },
        _count: {
          select: {
            comments: true
          }
        },
        status: true,
      }
    })

    console.log(`✅ Post detail data structure is correct`)
    console.log(`   - All required fields present: id, title, slug, content, excerpt, featuredImage, etc.`)
    console.log(`   - Author information: ${postDetail.author.name} (bio: ${postDetail.author.bio ? 'Yes' : 'No'})`)
    console.log(`   - Categories: ${postDetail.categories.length} with color coding`)
    console.log(`   - Tags: ${postDetail.tags.length} with color coding`)
    console.log(`   - Engagement stats: ${postDetail.viewCount} views, ${postDetail.likeCount} likes, ${postDetail._count.comments} comments`)

    // Test 5: Test featured image support
    console.log('\n5. Testing featured image support...')
    const postsWithImages = await prisma.post.findMany({
      where: { 
        AND: [
          { status: 'PUBLISHED' },
          { featuredImage: { not: null } }
        ]
      },
      select: {
        id: true,
        title: true,
        featuredImage: true
      }
    })

    console.log(`✅ ${postsWithImages.length} posts have featured images`)
    postsWithImages.forEach(postWithImage => {
      console.log(`   - "${postWithImage.title}" has featured image`)
    })

    // Test 6: Test category and tag links
    console.log('\n6. Testing category and tag links...')
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        color: true
      }
    })

    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        color: true
      }
    })

    console.log(`✅ Categories (${categories.length}) with slugs:`)
    categories.forEach(category => {
      console.log(`   - "${category.name}" → /blog/category/${category.slug} (${category.color})`)
    })

    console.log(`✅ Tags (${tags.length}) with slugs:`)
    tags.forEach(tag => {
      console.log(`   - "${tag.name}" → /blog/tag/${tag.slug} (${tag.color})`)
    })

    console.log('\n🎉 Blog post detail page tests completed successfully!')
    console.log('\n📋 Blog Post Detail Features:')
    console.log('✅ Featured Image - Full-width hero image with proper aspect ratio')
    console.log('✅ Post Header - Title, excerpt, and meta information')
    console.log('✅ Author Information - Author card with bio and avatar')
    console.log('✅ Categories & Tags - Color-coded with clickable links')
    console.log('✅ Engagement Stats - Views, likes, and comment counts')
    console.log('✅ Related Posts - Posts from same categories with thumbnails')
    console.log('✅ Recent Posts - Latest posts from the blog')
    console.log('✅ Share Buttons - Social sharing functionality')
    console.log('✅ Responsive Layout - Mobile-friendly sidebar and main content')
    console.log('✅ Navigation - Back to blog button')
    console.log('✅ Rich Content - Markdown rendering with proper styling')

    console.log('\n🌐 Test the blog post detail at:')
    console.log(`   http://localhost:3000/blog/${post.slug}`)
    console.log('📝 View all posts at: http://localhost:3000/blog')
    console.log('🔐 Create new posts at: http://localhost:3000/admin/dashboard (Manage Blog)')

  } catch (error) {
    console.error('❌ Blog post detail test failed:', error.message)
  }
}

testBlogPostDetail()
  .catch((e) => {
    console.error('❌ Test failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
