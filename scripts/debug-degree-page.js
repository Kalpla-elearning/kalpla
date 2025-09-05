const { PrismaClient } = require('@prisma/client')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const prisma = new PrismaClient()

async function debugDegreePage() {
  try {
    console.log('🔍 Debugging Degree Program Page...\n')

    // Get a degree program
    const program = await prisma.degreeProgram.findFirst({
      where: { 
        status: 'PUBLISHED'
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true
          }
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true
          }
        }
      }
    })

    if (!program) {
      console.log('❌ No degree program found')
      return
    }

    console.log(`✅ Found program: ${program.title}`)
    console.log(`✅ Slug: ${program.slug}`)
    console.log(`✅ Status: ${program.status}`)
    console.log(`✅ Instructor: ${program.instructor?.name || 'None'}`)

    // Test JSON parsing
    console.log('\n🔍 Testing JSON parsing...')
    
    try {
      const features = program.features ? JSON.parse(program.features) : []
      console.log(`✅ Features parsed: ${features.length} items`)
      console.log(`   Sample: ${features[0] || 'None'}`)
    } catch (error) {
      console.log(`❌ Features parsing failed: ${error.message}`)
      console.log(`   Raw data: ${program.features}`)
    }

    try {
      const requirements = program.requirements ? JSON.parse(program.requirements) : []
      console.log(`✅ Requirements parsed: ${requirements.length} items`)
      console.log(`   Sample: ${requirements[0] || 'None'}`)
    } catch (error) {
      console.log(`❌ Requirements parsing failed: ${error.message}`)
      console.log(`   Raw data: ${program.requirements}`)
    }

    try {
      const syllabus = program.syllabus ? JSON.parse(program.syllabus) : []
      console.log(`✅ Syllabus parsed: ${syllabus.length} items`)
      console.log(`   Sample: ${JSON.stringify(syllabus[0] || {})}`)
    } catch (error) {
      console.log(`❌ Syllabus parsing failed: ${error.message}`)
      console.log(`   Raw data: ${program.syllabus}`)
    }

    try {
      const tags = program.tags ? JSON.parse(program.tags) : []
      console.log(`✅ Tags parsed: ${tags.length} items`)
      console.log(`   Sample: ${tags[0] || 'None'}`)
    } catch (error) {
      console.log(`❌ Tags parsing failed: ${error.message}`)
      console.log(`   Raw data: ${program.tags}`)
    }

    // Test the page URL
    console.log(`\n🌐 Testing page URL: /degrees/${program.slug}`)

  } catch (error) {
    console.error('❌ Debug failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugDegreePage()
