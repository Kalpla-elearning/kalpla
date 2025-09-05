const { PrismaClient } = require('@prisma/client')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const prisma = new PrismaClient()

// USD to INR conversion rate (approximate)
const USD_TO_INR_RATE = 83.5

async function updatePricesToINR() {
  try {
    console.log('🔄 Updating course prices to INR...')

    // Get all courses with USD currency
    const courses = await prisma.course.findMany({
      where: {
        currency: 'USD'
      }
    })

    console.log(`Found ${courses.length} courses with USD pricing`)

    for (const course of courses) {
      const newPrice = Math.round(course.price * USD_TO_INR_RATE)
      
      await prisma.course.update({
        where: { id: course.id },
        data: {
          price: newPrice,
          currency: 'INR'
        }
      })

      console.log(`✅ Updated "${course.title}": $${course.price} → ₹${newPrice}`)
    }

    // Update degree programs
    const degreePrograms = await prisma.degreeProgram.findMany({
      where: {
        currency: 'USD'
      }
    })

    console.log(`Found ${degreePrograms.length} degree programs with USD pricing`)

    for (const program of degreePrograms) {
      const newPrice = Math.round(program.price * USD_TO_INR_RATE)
      
      await prisma.degreeProgram.update({
        where: { id: program.id },
        data: {
          price: newPrice,
          currency: 'INR'
        }
      })

      console.log(`✅ Updated degree program "${program.title}": $${program.price} → ₹${newPrice}`)
    }

    // Update subscription plans
    const subscriptionPlans = await prisma.subscriptionPlan.findMany({
      where: {
        currency: 'USD'
      }
    })

    console.log(`Found ${subscriptionPlans.length} subscription plans with USD pricing`)

    for (const plan of subscriptionPlans) {
      const newPrice = Math.round(plan.amount * USD_TO_INR_RATE)
      
      await prisma.subscriptionPlan.update({
        where: { id: plan.id },
        data: {
          amount: newPrice,
          currency: 'INR'
        }
      })

      console.log(`✅ Updated subscription plan "${plan.planName}": $${plan.amount} → ₹${newPrice}`)
    }

    // Update pricing plans
    const pricingPlans = await prisma.pricingPlan.findMany({
      where: {
        currency: 'USD'
      }
    })

    console.log(`Found ${pricingPlans.length} pricing plans with USD pricing`)

    for (const plan of pricingPlans) {
      const newPrice = Math.round(plan.price * USD_TO_INR_RATE)
      
      await prisma.pricingPlan.update({
        where: { id: plan.id },
        data: {
          price: newPrice,
          currency: 'INR'
        }
      })

      console.log(`✅ Updated pricing plan "${plan.planName}": $${plan.price} → ₹${newPrice}`)
    }

    console.log('🎉 Successfully updated all prices to INR!')

  } catch (error) {
    console.error('❌ Error updating prices to INR:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updatePricesToINR()
