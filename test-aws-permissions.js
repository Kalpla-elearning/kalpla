// Test AWS permissions for Amplify
const { execSync } = require('child_process')

console.log('🔍 Testing AWS permissions for Amplify...\n')

const tests = [
  {
    name: 'AWS Identity',
    command: 'aws sts get-caller-identity',
    description: 'Check current AWS user identity'
  },
  {
    name: 'SSM Parameter Access',
    command: 'aws ssm get-parameter --name "/cdk-bootstrap/hnb659fds/version" --region ap-south-1',
    description: 'Test SSM parameter access (required for Amplify)'
  },
  {
    name: 'CloudFormation Access',
    command: 'aws cloudformation list-stacks --region ap-south-1 --max-items 1',
    description: 'Test CloudFormation access'
  },
  {
    name: 'S3 Access',
    command: 'aws s3 ls',
    description: 'Test S3 access'
  },
  {
    name: 'IAM Access',
    command: 'aws iam get-user --user-name kalpla-course',
    description: 'Test IAM access'
  }
]

async function runTests() {
  let passed = 0
  let failed = 0

  for (const test of tests) {
    try {
      console.log(`🧪 Testing: ${test.name}`)
      console.log(`   ${test.description}`)
      
      const result = execSync(test.command, { 
        encoding: 'utf8',
        timeout: 10000 
      })
      
      console.log(`   ✅ PASSED`)
      if (result.trim()) {
        console.log(`   📄 Result: ${result.trim().substring(0, 100)}...`)
      }
      passed++
    } catch (error) {
      console.log(`   ❌ FAILED`)
      console.log(`   🔍 Error: ${error.message.split('\n')[0]}`)
      failed++
    }
    console.log('')
  }

  console.log('📊 Test Results:')
  console.log(`   ✅ Passed: ${passed}`)
  console.log(`   ❌ Failed: ${failed}`)
  console.log('')

  if (failed === 0) {
    console.log('🎉 All tests passed! AWS permissions are correctly configured.')
    console.log('   You can now run: npx ampx sandbox')
  } else {
    console.log('⚠️  Some tests failed. Please fix AWS permissions:')
    console.log('   1. Go to AWS IAM Console')
    console.log('   2. Find user "kalpla-course"')
    console.log('   3. Add required policies (see FIX_AWS_IAM_PERMISSIONS.md)')
    console.log('   4. Or create a new admin user with full access')
  }
}

runTests().catch(console.error)
