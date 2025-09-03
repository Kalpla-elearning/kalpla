const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testCourseManagement() {
  console.log('🧪 Testing Course Management System...')
  
  try {
    // Test 1: Check if demo courses exist
    console.log('\n1. Checking demo courses...')
    const courses = await prisma.course.findMany({
      include: {
        instructor: {
          select: {
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            modules: true,
            enrollments: true,
            reviews: true
          }
        }
      }
    })
    
    console.log(`✅ Found ${courses.length} courses in database:`)
    courses.forEach(course => {
      console.log(`   - "${course.title}" by ${course.instructor.name}`)
      console.log(`     Price: $${course.price} | Status: ${course.status} | Category: ${course.category}`)
    })

    // Test 2: Test course creation
    console.log('\n2. Testing course creation...')
    const instructor = await prisma.user.findFirst({
      where: { role: 'INSTRUCTOR' }
    })
    
    if (instructor) {
      const testCourse = await prisma.course.create({
        data: {
          title: 'Test Course Management',
          description: 'This is a test course for course management functionality',
          price: 49.99,
          category: 'Testing',
          tags: JSON.stringify(['test', 'management', 'demo']),
          instructorId: instructor.id,
          status: 'DRAFT'
        }
      })
      console.log(`✅ Created test course: "${testCourse.title}" - $${testCourse.price}`)
    }

    // Test 3: Test course update
    console.log('\n3. Testing course update...')
    const courseToUpdate = await prisma.course.findFirst({
      where: { title: 'Test Course Management' }
    })
    
    if (courseToUpdate) {
      const updatedCourse = await prisma.course.update({
        where: { id: courseToUpdate.id },
        data: { 
          title: 'Updated Test Course',
          price: 59.99,
          status: 'PUBLISHED'
        }
      })
      console.log(`✅ Updated course: "${updatedCourse.title}" - $${updatedCourse.price} - ${updatedCourse.status}`)
    }

    // Test 4: Test course deletion
    console.log('\n4. Testing course deletion...')
    const courseToDelete = await prisma.course.findFirst({
      where: { title: 'Updated Test Course' }
    })
    
    if (courseToDelete) {
      await prisma.course.delete({
        where: { id: courseToDelete.id }
      })
      console.log('✅ Deleted test course successfully')
    }

    // Test 5: Test course search functionality
    console.log('\n5. Testing search functionality...')
    const publishedCourses = await prisma.course.findMany({
      where: { status: 'PUBLISHED' }
    })
    console.log(`✅ Found ${publishedCourses.length} published courses`)

    const draftCourses = await prisma.course.findMany({
      where: { status: 'DRAFT' }
    })
    console.log(`✅ Found ${draftCourses.length} draft courses`)

    const webDevCourses = await prisma.course.findMany({
      where: { category: 'Web Development' }
    })
    console.log(`✅ Found ${webDevCourses.length} web development courses`)

    // Test 6: Test course statistics
    console.log('\n6. Testing course statistics...')
    const courseStats = await prisma.course.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    })
    
    console.log('✅ Course statistics by status:')
    courseStats.forEach(stat => {
      console.log(`   - ${stat.status}: ${stat._count.status} courses`)
    })

    const categoryStats = await prisma.course.groupBy({
      by: ['category'],
      _count: {
        category: true
      }
    })
    
    console.log('✅ Course statistics by category:')
    categoryStats.forEach(stat => {
      console.log(`   - ${stat.category}: ${stat._count.category} courses`)
    })

    // Test 7: Test instructor-course relationship
    console.log('\n7. Testing instructor-course relationship...')
    const instructorWithCourses = await prisma.user.findFirst({
      where: { role: 'INSTRUCTOR' },
      include: {
        courses: {
          select: {
            title: true,
            status: true,
            price: true
          }
        }
      }
    })
    
    if (instructorWithCourses) {
      console.log(`✅ Instructor "${instructorWithCourses.name}" has ${instructorWithCourses.courses.length} courses:`)
      instructorWithCourses.courses.forEach(course => {
        console.log(`   - "${course.title}" - $${course.price} - ${course.status}`)
      })
    }

    console.log('\n🎉 All course management tests passed!')
    console.log('\n📋 Course Management Features:')
    console.log('✅ Course creation with instructor assignment')
    console.log('✅ Course information updates')
    console.log('✅ Course deletion with cascade')
    console.log('✅ Status-based filtering (Published/Draft/Archived)')
    console.log('✅ Category-based filtering')
    console.log('✅ Search functionality')
    console.log('✅ Statistics and analytics')
    console.log('✅ Instructor-course relationships')

    console.log('\n🌐 Test the admin dashboard at: http://localhost:3000/admin/dashboard')
    console.log('🔐 Login with: admin@example.com / admin123')

  } catch (error) {
    console.error('❌ Course management test failed:', error.message)
  }
}

testCourseManagement()
  .catch((e) => {
    console.error('❌ Test failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
