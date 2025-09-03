const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function checkAndCreateUsers() {
  try {
    console.log('🔍 Checking database for users...')
    
    // Check existing users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    })
    
    console.log(`📊 Found ${users.length} users in database:`)
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.role} - Created: ${user.createdAt}`)
    })
    
    // If no users exist, create a test admin user
    if (users.length === 0) {
      console.log('\n👤 No users found. Creating test admin user...')
      
      const hashedPassword = await bcrypt.hash('admin123', 12)
      
      const adminUser = await prisma.user.create({
        data: {
          email: 'admin@kalpla.com',
          name: 'Admin User',
          password: hashedPassword,
          role: 'ADMIN',
          isVerified: true
        }
      })
      
      console.log('✅ Created admin user:')
      console.log(`  - Email: admin@kalpla.com`)
      console.log(`  - Password: admin123`)
      console.log(`  - Role: ${adminUser.role}`)
      console.log(`  - ID: ${adminUser.id}`)
    }
    
    // Also create a test instructor if none exists
    const instructors = users.filter(u => u.role === 'INSTRUCTOR')
    if (instructors.length === 0) {
      console.log('\n👨‍🏫 No instructors found. Creating test instructor...')
      
      const hashedPassword = await bcrypt.hash('instructor123', 12)
      
      const instructorUser = await prisma.user.create({
        data: {
          email: 'instructor@kalpla.com',
          name: 'Test Instructor',
          password: hashedPassword,
          role: 'INSTRUCTOR',
          isVerified: true
        }
      })
      
      console.log('✅ Created instructor user:')
      console.log(`  - Email: instructor@kalpla.com`)
      console.log(`  - Password: instructor123`)
      console.log(`  - Role: ${instructorUser.role}`)
      console.log(`  - ID: ${instructorUser.id}`)
    }
    
    // Also create a test student if none exists
    const students = users.filter(u => u.role === 'STUDENT')
    if (students.length === 0) {
      console.log('\n👨‍🎓 No students found. Creating test student...')
      
      const hashedPassword = await bcrypt.hash('student123', 12)
      
      const studentUser = await prisma.user.create({
        data: {
          email: 'student@kalpla.com',
          name: 'Test Student',
          password: hashedPassword,
          role: 'STUDENT',
          isVerified: true
        }
      })
      
      console.log('✅ Created student user:')
      console.log(`  - Email: student@kalpla.com`)
      console.log(`  - Password: student123`)
      console.log(`  - Role: ${studentUser.role}`)
      console.log(`  - ID: ${studentUser.id}`)
    }
    
    console.log('\n🎉 Database check complete!')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAndCreateUsers()
