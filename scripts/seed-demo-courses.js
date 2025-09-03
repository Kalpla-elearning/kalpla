const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedDemoCourses() {
  console.log('🌱 Seeding demo courses...')
  
  try {
    // Get the instructor user
    const instructor = await prisma.user.findUnique({
      where: { email: 'instructor@example.com' }
    })

    if (!instructor) {
      console.log('❌ Instructor not found. Please create instructor user first.')
      return
    }

    const demoCourses = [
      {
        title: 'Complete Web Development Bootcamp',
        description: 'Learn full-stack web development with HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build real-world projects and become a professional developer.',
        price: 99.99,
        category: 'Web Development',
        tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
        status: 'PUBLISHED'
      },
      {
        title: 'Advanced JavaScript Patterns',
        description: 'Master advanced JavaScript concepts including closures, prototypes, async programming, and modern ES6+ features.',
        price: 79.99,
        category: 'Web Development',
        tags: ['JavaScript', 'ES6', 'Async', 'Closures', 'Prototypes'],
        status: 'PUBLISHED'
      },
      {
        title: 'React Native Mobile Development',
        description: 'Build cross-platform mobile apps with React Native. Learn to create iOS and Android apps using JavaScript and React.',
        price: 89.99,
        category: 'Mobile Development',
        tags: ['React Native', 'Mobile', 'iOS', 'Android', 'JavaScript'],
        status: 'DRAFT'
      },
      {
        title: 'Python for Data Science',
        description: 'Learn Python programming for data analysis, visualization, and machine learning. Work with pandas, numpy, matplotlib, and scikit-learn.',
        price: 119.99,
        category: 'Data Science',
        tags: ['Python', 'Data Science', 'Pandas', 'NumPy', 'Machine Learning'],
        status: 'PUBLISHED'
      },
      {
        title: 'Digital Marketing Masterclass',
        description: 'Comprehensive guide to digital marketing including SEO, social media marketing, content marketing, and paid advertising.',
        price: 69.99,
        category: 'Marketing',
        tags: ['SEO', 'Social Media', 'Content Marketing', 'PPC', 'Analytics'],
        status: 'PUBLISHED'
      },
      {
        title: 'UI/UX Design Fundamentals',
        description: 'Learn the principles of user interface and user experience design. Create beautiful and functional designs for web and mobile.',
        price: 89.99,
        category: 'Design',
        tags: ['UI Design', 'UX Design', 'Figma', 'Prototyping', 'User Research'],
        status: 'DRAFT'
      }
    ]

    for (const courseData of demoCourses) {
      try {
        const existingCourse = await prisma.course.findFirst({
          where: { title: courseData.title }
        })
        
        if (existingCourse) {
          console.log(`⚠️  Course "${courseData.title}" already exists, skipping...`)
          continue
        }
        
        const course = await prisma.course.create({
          data: {
            title: courseData.title,
            description: courseData.description,
            price: courseData.price,
            category: courseData.category,
            tags: JSON.stringify(courseData.tags),
            instructorId: instructor.id,
            status: courseData.status
          }
        })
        
        console.log(`✅ Created course: "${course.title}" - $${course.price} - ${course.status}`)
      } catch (error) {
        console.error(`❌ Error creating course "${courseData.title}":`, error.message)
      }
    }
    
    console.log('\n🎉 Demo courses seeded successfully!')
    console.log('\n📊 Course Statistics:')
    
    const courseStats = await prisma.course.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    })
    
    courseStats.forEach(stat => {
      console.log(`   - ${stat.status}: ${stat._count.status} courses`)
    })
    
    const totalCourses = await prisma.course.count()
    console.log(`   - Total: ${totalCourses} courses`)
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message)
  }
}

seedDemoCourses()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
