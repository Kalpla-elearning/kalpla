const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function seedDemoUsers() {
  console.log('🌱 Seeding demo users...')
  
  const demoUsers = [
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'ADMIN'
    },
    {
      name: 'John Instructor',
      email: 'instructor@example.com',
      password: 'instructor123',
      role: 'INSTRUCTOR'
    },
    {
      name: 'Jane Student',
      email: 'student@example.com',
      password: 'student123',
      role: 'STUDENT'
    }
  ]

  for (const user of demoUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 12)
    
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email }
      })
      
      if (existingUser) {
        console.log(`⚠️  User ${user.email} already exists, skipping...`)
        continue
      }
      
      const newUser = await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role,
          isVerified: true
        }
      })
      
      console.log(`✅ Created ${user.role} user: ${user.email}`)
    } catch (error) {
      console.error(`❌ Error creating user ${user.email}:`, error.message)
    }
  }
  
  console.log('\n🎉 Demo users seeded successfully!')
  console.log('\n📝 Login credentials:')
  console.log('Admin: admin@example.com / admin123')
  console.log('Instructor: instructor@example.com / instructor123')
  console.log('Student: student@example.com / student123')
}

seedDemoUsers()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
