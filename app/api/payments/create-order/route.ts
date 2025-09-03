import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PaymentService } from '@/lib/payment'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const createOrderSchema = z.object({
  type: z.enum(['COURSE', 'DEGREE_PROGRAM', 'MENTORSHIP', 'SUBSCRIPTION']),
  itemId: z.string(),
  itemTitle: z.string(),
  itemType: z.string(),
  unitPrice: z.number().positive(),
  quantity: z.number().positive().optional().default(1),
  currency: z.string().optional().default('INR'),
  billingAddress: z.any().optional(),
  shippingAddress: z.any().optional(),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createOrderSchema.parse(body)

    // Create order in database
    const order = await PaymentService.createOrder({
      userId: session.user.id,
      ...validatedData,
    })

    // Create Razorpay order
    const razorpayOrder = await PaymentService.createRazorpayOrder(order, session.user)

    // Create payment record
    const payment = await PaymentService.createPayment({
      orderId: order.id,
      amount: order.totalAmount,
      currency: order.currency,
      paymentMethod: 'RAZORPAY',
      description: `Payment for ${order.itemTitle}`,
      metadata: {
        razorpayOrderId: razorpayOrder.id,
      },
    })

    // Update payment with gateway order ID
    await PaymentService.updatePaymentStatus(payment.id, 'PENDING', {
      id: razorpayOrder.id,
      gatewayOrderId: razorpayOrder.id,
    })

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderNumber: order.orderNumber,
      paymentId: payment.id,
    })
  } catch (error) {
    console.error('Error creating payment order:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    )
  }
}
