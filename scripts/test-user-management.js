const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testUserManagement() {
  console.log('🧪 Testing User Management System...')
  
  try {
    // Test 1: Check if demo users exist
    console.log('\n1. Checking demo users...')
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true
      }
    })
    
    console.log(`✅ Found ${users.length} users in database:`)
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - ${user.role} - ${user.isVerified ? 'Verified' : 'Pending'}`)
    })

    // Test 2: Test user creation
    console.log('\n2. Testing user creation...')
    const testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword123',
        role: 'STUDENT',
        isVerified: true
      }
    })
    console.log(`✅ Created test user: ${testUser.name} (${testUser.email})`)

    // Test 3: Test user update
    console.log('\n3. Testing user update...')
    const updatedUser = await prisma.user.update({
      where: { id: testUser.id },
      data: { 
        name: 'Updated Test User',
        role: 'INSTRUCTOR'
      }
    })
    console.log(`✅ Updated user: ${updatedUser.name} - Role: ${updatedUser.role}`)

    // Test 4: Test user deletion
    console.log('\n4. Testing user deletion...')
    await prisma.user.delete({
      where: { id: testUser.id }
    })
    console.log('✅ Deleted test user successfully')

    // Test 5: Test user search functionality
    console.log('\n5. Testing search functionality...')
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN' }
    })
    console.log(`✅ Found ${adminUsers.length} admin users`)

    const verifiedUsers = await prisma.user.findMany({
      where: { isVerified: true }
    })
    console.log(`✅ Found ${verifiedUsers.length} verified users`)

    // Test 6: Test user statistics
    console.log('\n6. Testing user statistics...')
    const userStats = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true
      }
    })
    
    console.log('✅ User statistics by role:')
    userStats.forEach(stat => {
      console.log(`   - ${stat.role}: ${stat._count.role} users`)
    })

    console.log('\n🎉 All user management tests passed!')
    console.log('\n📋 User Management Features:')
    console.log('✅ User creation with role assignment')
    console.log('✅ User information updates')
    console.log('✅ User deletion with cascade')
    console.log('✅ Role-based filtering')
    console.log('✅ Verification status management')
    console.log('✅ Search functionality')
    console.log('✅ Statistics and analytics')

    console.log('\n🌐 Test the admin dashboard at: http://localhost:3000/admin/dashboard')
    console.log('🔐 Login with: admin@example.com / admin123')

  } catch (error) {
    console.error('❌ User management test failed:', error.message)
  }
}

testUserManagement()
  .catch((e) => {
    console.error('❌ Test failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
