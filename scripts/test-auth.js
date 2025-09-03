const bcrypt = require('bcryptjs')

// Test credentials
const testUsers = [
  {
    email: 'admin@kalpla.com',
    password: 'admin123',
    role: 'ADMIN'
  },
  {
    email: 'instructor@kalpla.com',
    password: 'instructor123',
    role: 'INSTRUCTOR'
  },
  {
    email: 'student@kalpla.com',
    password: 'student123',
    role: 'STUDENT'
  }
]

async function testAuthentication() {
  console.log('🔐 Testing Authentication...\n')
  
  for (const user of testUsers) {
    console.log(`Testing ${user.role} user: ${user.email}`)
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/callback/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: user.email,
          password: user.password,
          csrfToken: 'test-csrf-token', // This might be required
          json: 'true'
        })
      })
      
      console.log(`Status: ${response.status}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log(`✅ Success: ${data.user?.name} (${data.user?.role})`)
      } else {
        const error = await response.text()
        console.log(`❌ Error: ${error}`)
      }
    } catch (error) {
      console.log(`❌ Network Error: ${error.message}`)
    }
    
    console.log('---')
  }
}

testAuthentication()
