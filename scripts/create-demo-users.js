const bcrypt = require('bcryptjs');

// This script creates demo users for testing
// Run this after setting up your database

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
];

async function createDemoUsers() {
  console.log('🔐 Creating demo users...');
  
  for (const user of demoUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    
    console.log(`\n👤 ${user.role} User:`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: ${user.password}`);
    console.log(`   Hashed Password: ${hashedPassword}`);
    
    // You would insert this into your database here
    // For now, just showing the hashed passwords
  }
  
  console.log('\n✅ Demo users created!');
  console.log('\n📝 To use these users:');
  console.log('1. Set up your database with: npm run db:migrate');
  console.log('2. Insert these users into your database');
  console.log('3. Sign in with the credentials above');
}

createDemoUsers().catch(console.error);
