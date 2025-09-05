// Seed database with sample data
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with sample data...')
    
    // Create sample users
    console.log('👤 Creating sample users...')
    const instructor = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'instructor@example.com',
        role: 'INSTRUCTOR',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      }
    })
    
    const student = await prisma.user.create({
      data: {
        name: 'Jane Smith',
        email: 'student@example.com',
        role: 'STUDENT',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
      }
    })
    
    console.log(`✅ Created users: ${instructor.name} (${instructor.role}), ${student.name} (${student.role})`)
    
    // Create sample categories
    console.log('🏷️  Creating sample categories...')
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Web Development',
          description: 'Learn modern web development technologies',
          color: '#3B82F6',
          slug: 'web-development'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Data Science',
          description: 'Master data analysis and machine learning',
          color: '#10B981',
          slug: 'data-science'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Mobile Development',
          description: 'Build mobile applications for iOS and Android',
          color: '#F59E0B',
          slug: 'mobile-development'
        }
      })
    ])
    
    console.log(`✅ Created ${categories.length} categories`)
    
    // Create sample courses
    console.log('📚 Creating sample courses...')
    const courses = await Promise.all([
      prisma.course.create({
        data: {
          title: 'Complete React Development Course',
          description: 'Learn React from scratch and build real-world applications',
          slug: 'complete-react-development-course',
          thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
          price: 8500,
          category: 'Web Development',
          level: 'BEGINNER',
          duration: 40,
          instructorId: instructor.id,
          status: 'PUBLISHED',
          requirements: 'Basic HTML, CSS, and JavaScript knowledge',
          learningOutcomes: 'Build modern React applications, understand hooks, state management, and deployment'
        }
      }),
      prisma.course.create({
        data: {
          title: 'Python for Data Science',
          description: 'Master Python programming for data analysis and visualization',
          slug: 'python-for-data-science',
          thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
          price: 12500,
          category: 'Data Science',
          level: 'INTERMEDIATE',
          duration: 60,
          instructorId: instructor.id,
          status: 'PUBLISHED',
          requirements: 'Basic programming knowledge',
          learningOutcomes: 'Data analysis with pandas, visualization with matplotlib, machine learning basics'
        }
      }),
      prisma.course.create({
        data: {
          title: 'Flutter Mobile App Development',
          description: 'Build cross-platform mobile apps with Flutter',
          slug: 'flutter-mobile-app-development',
          thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
          price: 16700,
          category: 'Mobile Development',
          level: 'ADVANCED',
          duration: 80,
          instructorId: instructor.id,
          status: 'PUBLISHED',
          requirements: 'Dart programming knowledge recommended',
          learningOutcomes: 'Build iOS and Android apps, understand Flutter widgets, state management'
        }
      })
    ])
    
    console.log(`✅ Created ${courses.length} courses`)
    
    // Create sample modules for the first course
    console.log('📖 Creating sample modules...')
    const module1 = await prisma.module.create({
      data: {
        title: 'Introduction to React',
        description: 'Learn the basics of React and JSX',
        order: 1,
        courseId: courses[0].id
      }
    })
    
    const module2 = await prisma.module.create({
      data: {
        title: 'Components and Props',
        description: 'Understanding React components and props',
        order: 2,
        courseId: courses[0].id
      }
    })
    
    // Create sample lessons
    await prisma.lesson.create({
      data: {
        title: 'What is React?',
        description: 'Introduction to React library',
        content: 'React is a JavaScript library for building user interfaces...',
        type: 'VIDEO',
        url: 'https://example.com/video1',
        videoUrl: 'https://example.com/video1',
        order: 1,
        moduleId: module1.id,
        isPublished: true
      }
    })
    
    await prisma.lesson.create({
      data: {
        title: 'Setting up React',
        description: 'How to set up a React development environment',
        content: 'To get started with React, you need to install Node.js...',
        type: 'TEXT',
        order: 2,
        moduleId: module1.id,
        isPublished: true
      }
    })
    
    console.log('✅ Created sample modules and lessons')
    
    // Create sample enrollment
    console.log('🎓 Creating sample enrollment...')
    await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: courses[0].id,
        status: 'ACTIVE',
        enrolledAt: new Date()
      }
    })
    
    console.log('✅ Created sample enrollment')
    
    // Create sample reviews
    console.log('⭐ Creating sample reviews...')
    await prisma.review.create({
      data: {
        userId: student.id,
        courseId: courses[0].id,
        rating: 5,
        comment: 'Excellent course! Very well explained and easy to follow.'
      }
    })
    
    console.log('✅ Created sample review')
    
    console.log('🎉 Database seeded successfully!')
    console.log('')
    console.log('📊 Summary:')
    console.log(`- Users: 2 (1 instructor, 1 student)`)
    console.log(`- Categories: ${categories.length}`)
    console.log(`- Courses: ${courses.length}`)
    console.log(`- Modules: 2`)
    console.log(`- Lessons: 2`)
    console.log(`- Enrollments: 1`)
    console.log(`- Reviews: 1`)
    console.log('')
    console.log('🚀 You can now test the courses page!')
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedDatabase()
