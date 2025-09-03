import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const createPlanSchema = z.object({
  name: z.string().min(1, 'Plan name is required'),
  description: z.string().min(1, 'Plan description is required'),
  type: z.enum(['MONTHLY', 'YEARLY', 'LIFETIME']),
  price: z.number().positive('Price must be positive'),
  currency: z.string().default('INR'),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  maxCourses: z.number().positive().optional(),
  maxStudents: z.number().positive().optional(),
  maxStorage: z.number().positive().optional(),
  priority: z.number().default(0),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')

    const where: any = {}
    if (active === 'true') {
      where.isActive = true
    }

    const plans = await prisma.subscriptionPlan.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { price: 'asc' }
      ],
    })

    // Parse features JSON for each plan
    const plansWithFeatures = plans.map(plan => ({
      ...plan,
      features: plan.features ? JSON.parse(plan.features) : [],
    }))

    return NextResponse.json({
      success: true,
      plans: plansWithFeatures,
    })
  } catch (error) {
    console.error('Error fetching subscription plans:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription plans' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Only admins can create subscription plans
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = createPlanSchema.parse(body)

    const plan = await prisma.subscriptionPlan.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        type: validatedData.type,
        price: validatedData.price,
        currency: validatedData.currency,
        features: JSON.stringify(validatedData.features),
        maxCourses: validatedData.maxCourses,
        maxStudents: validatedData.maxStudents,
        maxStorage: validatedData.maxStorage,
        priority: validatedData.priority,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Subscription plan created successfully',
      plan: {
        ...plan,
        features: JSON.parse(plan.features),
      },
    })
  } catch (error) {
    console.error('Error creating subscription plan:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create subscription plan' },
      { status: 500 }
    )
  }
}
