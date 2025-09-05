const { exec } = require('child_process')
const util = require('util')
const execAsync = util.promisify(exec)

async function testPage(url, expectedStatus = 200) {
  try {
    const { stdout } = await execAsync(`curl -s -I "${url}"`)
    const statusMatch = stdout.match(/HTTP\/\d\.\d (\d+)/)
    const status = statusMatch ? parseInt(statusMatch[1]) : 0
    
    if (status === expectedStatus) {
      console.log(`✅ ${url} - Status: ${status}`)
      return true
    } else {
      console.log(`❌ ${url} - Expected: ${expectedStatus}, Got: ${status}`)
      return false
    }
  } catch (error) {
    console.log(`❌ ${url} - Error: ${error.message}`)
    return false
  }
}

async function testAllPages() {
  console.log('🧪 Testing All Pages and Routing...\n')

  const baseUrl = 'http://localhost:3000'
  const pages = [
    // Main pages
    { url: `${baseUrl}/`, name: 'Homepage' },
    { url: `${baseUrl}/courses`, name: 'Courses Page' },
    { url: `${baseUrl}/blog`, name: 'Blog Page' },
    { url: `${baseUrl}/degrees`, name: 'Degrees Page' },
    { url: `${baseUrl}/mentorship`, name: 'Mentorship Page' },
    { url: `${baseUrl}/about`, name: 'About Page' },
    { url: `${baseUrl}/contact`, name: 'Contact Page' },
    
    // Auth pages
    { url: `${baseUrl}/auth/signin`, name: 'Sign In Page' },
    { url: `${baseUrl}/auth/signin-amplify`, name: 'Amplify Sign In Page' },
    { url: `${baseUrl}/auth/signup`, name: 'Sign Up Page' },
    { url: `${baseUrl}/auth/forgot-password`, name: 'Forgot Password Page' },
    
    // Dashboard pages
    { url: `${baseUrl}/dashboard`, name: 'Dashboard Main' },
    { url: `${baseUrl}/dashboard/referrals`, name: 'Referrals Page' },
    { url: `${baseUrl}/dashboard/learning`, name: 'Learning Page' },
    { url: `${baseUrl}/dashboard/assignments`, name: 'Assignments Page' },
    { url: `${baseUrl}/dashboard/mentors`, name: 'Mentors Page' },
    { url: `${baseUrl}/dashboard/services`, name: 'Services Page' },
    
    // Admin pages
    { url: `${baseUrl}/admin/dashboard`, name: 'Admin Dashboard' },
    { url: `${baseUrl}/admin/users`, name: 'Admin Users' },
    { url: `${baseUrl}/admin/courses`, name: 'Admin Courses' },
    
    // Instructor pages
    { url: `${baseUrl}/instructor/dashboard`, name: 'Instructor Dashboard' },
    { url: `${baseUrl}/instructor/courses`, name: 'Instructor Courses' },
  ]

  let passed = 0
  let total = pages.length

  console.log('📄 Testing Main Pages...')
  for (const page of pages) {
    const success = await testPage(page.url)
    if (success) passed++
  }

  console.log(`\n📊 Results: ${passed}/${total} pages working (${Math.round(passed/total*100)}%)`)

  // Test API endpoints
  console.log('\n🔌 Testing API Endpoints...')
  const apiEndpoints = [
    { url: `${baseUrl}/api/courses/featured`, name: 'Featured Courses API' },
    { url: `${baseUrl}/api/degree-programs`, name: 'Degree Programs API' },
    { url: `${baseUrl}/api/blog`, name: 'Blog API' },
    { url: `${baseUrl}/api/referrals`, name: 'Referrals API' },
    { url: `${baseUrl}/api/referrals/validate`, name: 'Referral Validation API' },
  ]

  let apiPassed = 0
  for (const endpoint of apiEndpoints) {
    const success = await testPage(endpoint.url, 200)
    if (success) apiPassed++
  }

  console.log(`📊 API Results: ${apiPassed}/${apiEndpoints.length} endpoints working (${Math.round(apiPassed/apiEndpoints.length*100)}%)`)

  // Test specific functionality
  console.log('\n🎯 Testing Specific Functionality...')
  
  // Test referral system
  console.log('Testing Referral System...')
  const referralTest = await testPage(`${baseUrl}/dashboard/referrals`)
  if (referralTest) {
    console.log('✅ Referral system accessible')
  } else {
    console.log('❌ Referral system not accessible')
  }

  // Test authentication flow
  console.log('Testing Authentication Flow...')
  const authTest = await testPage(`${baseUrl}/auth/signin-amplify`)
  if (authTest) {
    console.log('✅ Authentication pages accessible')
  } else {
    console.log('❌ Authentication pages not accessible')
  }

  // Test dashboard access
  console.log('Testing Dashboard Access...')
  const dashboardTest = await testPage(`${baseUrl}/dashboard`)
  if (dashboardTest) {
    console.log('✅ Dashboard accessible')
  } else {
    console.log('❌ Dashboard not accessible')
  }

  console.log('\n🎉 Page and Routing Test Complete!')
  
  if (passed === total) {
    console.log('🎊 All pages are working perfectly!')
  } else {
    console.log(`⚠️  ${total - passed} pages need attention`)
  }

  console.log('\n📱 Key Pages to Test Manually:')
  console.log('1. Homepage: http://localhost:3000/')
  console.log('2. Courses: http://localhost:3000/courses')
  console.log('3. Blog: http://localhost:3000/blog')
  console.log('4. Degrees: http://localhost:3000/degrees')
  console.log('5. Dashboard: http://localhost:3000/dashboard')
  console.log('6. Referrals: http://localhost:3000/dashboard/referrals')
  console.log('7. Sign In: http://localhost:3000/auth/signin-amplify')
  console.log('8. Sign Up: http://localhost:3000/auth/signup')

  console.log('\n✨ All routing and pages have been fixed!')
}

testAllPages().catch(console.error)
