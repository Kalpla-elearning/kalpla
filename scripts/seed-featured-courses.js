const { PrismaClient } = require('@prisma/client')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const prisma = new PrismaClient()

async function seedFeaturedCourses() {
  try {
    console.log('🌱 Seeding featured courses...')

    // First, let's create some instructors if they don't exist
    const instructors = [
      {
        email: 'angela.yu@example.com',
        name: 'Dr. Angela Yu',
        role: 'INSTRUCTOR',
        bio: 'Full-stack developer and instructor with 10+ years of experience',
        isVerified: true
      },
      {
        email: 'jose.portilla@example.com',
        name: 'Jose Portilla',
        role: 'INSTRUCTOR',
        bio: 'Data science expert and machine learning instructor',
        isVerified: true
      },
      {
        email: 'jonas.schmedtmann@example.com',
        name: 'Jonas Schmedtmann',
        role: 'INSTRUCTOR',
        bio: 'JavaScript expert and web development instructor',
        isVerified: true
      },
      {
        email: 'phil.ebiner@example.com',
        name: 'Phil Ebiner',
        role: 'INSTRUCTOR',
        bio: 'Digital marketing expert and business instructor',
        isVerified: true
      }
    ]

    const createdInstructors = []
    for (const instructor of instructors) {
      const existingInstructor = await prisma.user.findUnique({
        where: { email: instructor.email }
      })

      if (!existingInstructor) {
        const newInstructor = await prisma.user.create({
          data: instructor
        })
        createdInstructors.push(newInstructor)
        console.log(`✅ Created instructor: ${instructor.name}`)
      } else {
        createdInstructors.push(existingInstructor)
        console.log(`ℹ️  Instructor already exists: ${instructor.name}`)
      }
    }

    // Create featured courses
    const featuredCourses = [
      {
        title: 'Complete Web Development Bootcamp',
        description: 'Learn web development from scratch with this comprehensive course covering HTML, CSS, JavaScript, React, Node.js, and more. Perfect for beginners and intermediate developers.',
        slug: 'complete-web-development-bootcamp',
        price: 2500,
        currency: 'INR',
        category: 'Development',
        subcategory: 'Web Development',
        level: 'Beginner',
        status: 'PUBLISHED',
        isFeatured: true,
        instructorId: createdInstructors[0].id,
        thumbnailUrl: '/api/placeholder/300/200',
        requirements: 'No prior programming experience required. Basic computer skills recommended.',
        learningOutcomes: 'Build responsive websites, create web applications, understand modern web development practices'
      },
      {
        title: 'Python for Data Science and Machine Learning',
        description: 'Master Python programming for data science, machine learning, and artificial intelligence applications. Learn pandas, numpy, scikit-learn, and more.',
        slug: 'python-data-science-machine-learning',
        price: 2100,
        currency: 'INR',
        category: 'Data Science',
        subcategory: 'Python',
        level: 'Intermediate',
        status: 'PUBLISHED',
        isFeatured: true,
        instructorId: createdInstructors[1].id,
        thumbnailUrl: '/api/placeholder/300/200',
        requirements: 'Basic programming knowledge recommended. No prior data science experience required.',
        learningOutcomes: 'Analyze data with Python, build machine learning models, create data visualizations'
      },
      {
        title: 'The Complete JavaScript Course 2024',
        description: 'Learn JavaScript from scratch and build real-world projects with modern ES6+ features. Master DOM manipulation, async programming, and more.',
        slug: 'complete-javascript-course-2024',
        price: 1700,
        currency: 'INR',
        category: 'Development',
        subcategory: 'JavaScript',
        level: 'Beginner',
        status: 'PUBLISHED',
        isFeatured: true,
        instructorId: createdInstructors[2].id,
        thumbnailUrl: '/api/placeholder/300/200',
        requirements: 'No prior programming experience required.',
        learningOutcomes: 'Master JavaScript fundamentals, build interactive websites, understand modern JavaScript features'
      },
      {
        title: 'Digital Marketing Masterclass',
        description: 'Learn digital marketing strategies including SEO, social media marketing, email marketing, Google Ads, and content marketing.',
        slug: 'digital-marketing-masterclass',
        price: 2900,
        currency: 'INR',
        category: 'Marketing',
        subcategory: 'Digital Marketing',
        level: 'Beginner',
        status: 'PUBLISHED',
        isFeatured: true,
        instructorId: createdInstructors[3].id,
        thumbnailUrl: '/api/placeholder/300/200',
        requirements: 'Basic understanding of business concepts recommended.',
        learningOutcomes: 'Create effective marketing campaigns, understand digital marketing tools, grow online presence'
      }
    ]

    for (const courseData of featuredCourses) {
      const existingCourse = await prisma.course.findUnique({
        where: { slug: courseData.slug }
      })

      if (!existingCourse) {
        const course = await prisma.course.create({
          data: courseData
        })

        // Create some modules for each course
        const modules = [
          {
            title: 'Introduction',
            description: 'Get started with the basics',
            courseId: course.id,
            order: 1,
            isPublished: true
          },
          {
            title: 'Core Concepts',
            description: 'Learn the fundamental concepts',
            courseId: course.id,
            order: 2,
            isPublished: true
          },
          {
            title: 'Practical Applications',
            description: 'Apply what you\'ve learned',
            courseId: course.id,
            order: 3,
            isPublished: true
          }
        ]

        for (const moduleData of modules) {
          const module = await prisma.module.create({
            data: moduleData
          })

          // Create some content for each module
          const contents = [
            {
              title: 'Introduction Video',
              description: 'Welcome to the course',
              type: 'VIDEO',
              duration: 1800, // 30 minutes
              moduleId: module.id,
              order: 1
            },
            {
              title: 'Key Concepts',
              description: 'Learn the main concepts',
              type: 'VIDEO',
              duration: 2700, // 45 minutes
              moduleId: module.id,
              order: 2
            }
          ]

          for (const contentData of contents) {
            await prisma.content.create({
              data: contentData
            })
          }
        }

        // Create some sample reviews
        const reviews = [
          {
            userId: createdInstructors[0].id,
            courseId: course.id,
            rating: 5,
            comment: 'Excellent course! Very well structured and easy to follow.',
            isReviewed: true
          },
          {
            userId: createdInstructors[1].id,
            courseId: course.id,
            rating: 4,
            comment: 'Great content and practical examples.',
            isReviewed: true
          }
        ]

        for (const reviewData of reviews) {
          await prisma.review.create({
            data: reviewData
          })
        }

        // Create some sample enrollments
        const enrollments = [
          {
            userId: createdInstructors[0].id,
            courseId: course.id,
            status: 'ACTIVE',
            progress: 75
          },
          {
            userId: createdInstructors[1].id,
            courseId: course.id,
            status: 'ACTIVE',
            progress: 50
          }
        ]

        for (const enrollmentData of enrollments) {
          await prisma.enrollment.create({
            data: enrollmentData
          })
        }

        console.log(`✅ Created featured course: ${course.title}`)
      } else {
        // Update existing course to be featured
        await prisma.course.update({
          where: { id: existingCourse.id },
          data: { isFeatured: true, status: 'PUBLISHED' }
        })
        console.log(`ℹ️  Updated existing course to featured: ${existingCourse.title}`)
      }
    }

    console.log('🎉 Featured courses seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding featured courses:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedFeaturedCourses()
