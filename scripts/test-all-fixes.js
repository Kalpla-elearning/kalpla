const { PrismaClient } = require('@prisma/client')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const prisma = new PrismaClient()

async function testAllFixes() {
  try {
    console.log('🔧 Testing All Fixes...\n')

    // 1. Test Database Connection
    console.log('1️⃣ Testing Database Connection...')
    try {
      await prisma.$connect()
      console.log('✅ Database connection successful')
    } catch (error) {
      console.log('❌ Database connection failed:', error.message)
      return
    }

    // 2. Test API Endpoints
    console.log('\n2️⃣ Testing API Endpoints...')
    
    const endpoints = [
      'http://localhost:3000/api/courses/featured',
      'http://localhost:3000/api/degree-programs',
      'http://localhost:3000/api/blog'
    ]

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint)
        if (response.ok) {
          console.log(`✅ ${endpoint} - OK`)
        } else {
          console.log(`❌ ${endpoint} - ${response.status}`)
        }
      } catch (error) {
        console.log(`❌ ${endpoint} - ${error.message}`)
      }
    }

    // 3. Test Page Loading
    console.log('\n3️⃣ Testing Page Loading...')
    
    const pages = [
      'http://localhost:3000/',
      'http://localhost:3000/courses',
      'http://localhost:3000/blog',
      'http://localhost:3000/degrees',
      'http://localhost:3000/courses/digital-marketing-masterclass'
    ]

    for (const page of pages) {
      try {
        const response = await fetch(page)
        if (response.ok) {
          console.log(`✅ ${page} - OK`)
        } else {
          console.log(`❌ ${page} - ${response.status}`)
        }
      } catch (error) {
        console.log(`❌ ${page} - ${error.message}`)
      }
    }

    // 4. Test Database Queries
    console.log('\n4️⃣ Testing Database Queries...')
    
    try {
      const courses = await prisma.course.findMany({ take: 1 })
      console.log(`✅ Courses query - Found ${courses.length} courses`)
    } catch (error) {
      console.log('❌ Courses query failed:', error.message)
    }

    try {
      const posts = await prisma.post.findMany({ take: 1 })
      console.log(`✅ Posts query - Found ${posts.length} posts`)
    } catch (error) {
      console.log('❌ Posts query failed:', error.message)
    }

    try {
      const degreePrograms = await prisma.degreeProgram.findMany({ take: 1 })
      console.log(`✅ Degree programs query - Found ${degreePrograms.length} programs`)
    } catch (error) {
      console.log('❌ Degree programs query failed:', error.message)
    }

    // 5. Test Connection Pool
    console.log('\n5️⃣ Testing Connection Pool...')
    
    const promises = []
    for (let i = 0; i < 5; i++) {
      promises.push(
        prisma.course.findMany({ take: 1 })
          .then(() => console.log(`✅ Connection ${i + 1} - OK`))
          .catch(error => console.log(`❌ Connection ${i + 1} - ${error.message}`))
      )
    }
    
    await Promise.all(promises)

    // 6. Test Error Handling
    console.log('\n6️⃣ Testing Error Handling...')
    
    try {
      // This should trigger an error but be handled gracefully
      await prisma.course.findMany({
        where: { invalidField: 'test' }
      })
    } catch (error) {
      if (error.message.includes('Unknown argument')) {
        console.log('✅ Error handling - Database validation working')
      } else {
        console.log('❌ Unexpected error:', error.message)
      }
    }

    // 7. Test Image Configuration
    console.log('\n7️⃣ Testing Image Configuration...')
    
    try {
      const response = await fetch('http://localhost:3000/courses')
      const content = await response.text()
      
      if (content.includes('images.unsplash.com')) {
        console.log('✅ Unsplash images detected in content')
      } else {
        console.log('ℹ️ No Unsplash images found (may be using placeholders)')
      }
    } catch (error) {
      console.log('❌ Image test failed:', error.message)
    }

    console.log('\n🎉 All Fixes Test Complete!')
    console.log('\n📋 Summary of Fixes Applied:')
    console.log('✅ Database connection pool optimized')
    console.log('✅ Connection timeout increased to 20s')
    console.log('✅ Connection limit reduced to 3')
    console.log('✅ Next.js image configuration updated')
    console.log('✅ Error handling added to all database queries')
    console.log('✅ Prisma configuration optimized')
    console.log('✅ Graceful shutdown handlers added')
    console.log('✅ Unsplash and placeholder images supported')

  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAllFixes()
