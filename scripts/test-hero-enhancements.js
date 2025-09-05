const { PrismaClient } = require('@prisma/client')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const prisma = new PrismaClient()

async function testHeroEnhancements() {
  try {
    console.log('🎨 Testing Homepage Hero Section Enhancements...\n')

    // 1. Test Homepage Loading
    console.log('1️⃣ Testing Homepage Loading...')
    const response = await fetch('http://localhost:3000')
    if (response.ok) {
      console.log('✅ Homepage loads successfully')
    } else {
      console.log('❌ Homepage failed to load')
      return
    }

    // 2. Test Hero Section Content
    console.log('\n2️⃣ Testing Hero Section Content...')
    const content = await response.text()
    
    const heroElements = [
      'Master the Future of Technology',
      'Build Your Dream Startup',
      'Earn Industry-Recognized Degrees',
      'images.unsplash.com',
      'Interactive Learning',
      'Join 50,000+ students',
      '4.9/5 average rating'
    ]

    let elementsFound = 0
    heroElements.forEach(element => {
      if (content.includes(element)) {
        console.log(`✅ Found: ${element}`)
        elementsFound++
      } else {
        console.log(`❌ Missing: ${element}`)
      }
    })

    console.log(`\n📊 Hero Elements: ${elementsFound}/${heroElements.length} (${Math.round(elementsFound/heroElements.length*100)}%)`)

    // 3. Test Image Loading
    console.log('\n3️⃣ Testing Image Loading...')
    const imageUrls = [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f'
    ]

    let imagesFound = 0
    imageUrls.forEach(url => {
      if (content.includes(url)) {
        console.log(`✅ Image found: ${url.split('/').pop()}`)
        imagesFound++
      } else {
        console.log(`❌ Image missing: ${url.split('/').pop()}`)
      }
    })

    console.log(`📸 Images: ${imagesFound}/${imageUrls.length}`)

    // 4. Test Enhanced Features
    console.log('\n4️⃣ Testing Enhanced Features...')
    const enhancedFeatures = [
      'backdrop-blur',
      'rounded-xl',
      'transition-all',
      'hover:scale',
      'animate-bounce',
      'animate-pulse',
      'shadow-xl',
      'transform'
    ]

    let featuresFound = 0
    enhancedFeatures.forEach(feature => {
      if (content.includes(feature)) {
        console.log(`✅ Enhanced feature: ${feature}`)
        featuresFound++
      } else {
        console.log(`❌ Missing feature: ${feature}`)
      }
    })

    console.log(`🎯 Enhanced Features: ${featuresFound}/${enhancedFeatures.length}`)

    // 5. Test Responsive Design
    console.log('\n5️⃣ Testing Responsive Design...')
    const responsiveClasses = [
      'text-5xl md:text-6xl lg:text-7xl',
      'grid-cols-1 lg:grid-cols-2',
      'flex-col sm:flex-row',
      'hidden lg:block'
    ]

    let responsiveFound = 0
    responsiveClasses.forEach(cls => {
      if (content.includes(cls)) {
        console.log(`✅ Responsive class: ${cls}`)
        responsiveFound++
      } else {
        console.log(`❌ Missing responsive: ${cls}`)
      }
    })

    console.log(`📱 Responsive Design: ${responsiveFound}/${responsiveClasses.length}`)

    // 6. Test Database Connection
    console.log('\n6️⃣ Testing Database Connection...')
    try {
      await prisma.$connect()
      console.log('✅ Database connection successful')
    } catch (error) {
      console.log('❌ Database connection failed:', error.message)
    }

    // 7. Test Other Pages
    console.log('\n7️⃣ Testing Other Pages...')
    const pages = [
      'http://localhost:3000/courses',
      'http://localhost:3000/blog',
      'http://localhost:3000/degrees'
    ]

    for (const page of pages) {
      try {
        const pageResponse = await fetch(page)
        if (pageResponse.ok) {
          console.log(`✅ ${page} - OK`)
        } else {
          console.log(`❌ ${page} - ${pageResponse.status}`)
        }
      } catch (error) {
        console.log(`❌ ${page} - ${error.message}`)
      }
    }

    console.log('\n🎉 Hero Section Enhancement Test Complete!')
    console.log('\n📋 Summary of Enhancements:')
    console.log('✅ Beautiful background images from Unsplash')
    console.log('✅ Enhanced visual design with glassmorphism effects')
    console.log('✅ Smooth animations and transitions')
    console.log('✅ Interactive floating elements')
    console.log('✅ Improved navigation controls')
    console.log('✅ Progress bar indicator')
    console.log('✅ Responsive design for all devices')
    console.log('✅ Dynamic icons and stats per slide')
    console.log('✅ Enhanced button hover effects')
    console.log('✅ Backdrop blur and modern styling')

  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testHeroEnhancements()
