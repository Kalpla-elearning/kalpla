import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PaymentService } from '@/lib/payment'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
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
    const validatedData = verifyPaymentSchema.parse(body)

    // Verify the payment with Razorpay
    const razorpayPayment = await PaymentService.verifyRazorpayPayment(
      validatedData.razorpay_payment_id,
      validatedData.razorpay_order_id,
      validatedData.razorpay_signature
    )

    // Find the payment record in our database
    const payment = await PaymentService.getPaymentById(validatedData.razorpay_payment_id)
    
    if (!payment) {
      return NextResponse.json(
        { error: 'Payment record not found' },
        { status: 404 }
      )
    }

    // Verify the payment belongs to the user
    if (payment.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized access to payment' },
        { status: 403 }
      )
    }

    // Update payment status to success
    const updatedPayment = await PaymentService.updatePaymentStatus(
      payment.id,
      'SUCCESS',
      razorpayPayment
    )

    // Process the successful payment (enrollments, etc.)
    await PaymentService.processSuccessfulPayment(updatedPayment)

    return NextResponse.json({
      success: true,
      paymentId: validatedData.razorpay_payment_id,
      orderId: validatedData.razorpay_order_id,
      amount: razorpayPayment.amount,
      currency: razorpayPayment.currency,
      status: razorpayPayment.status,
      orderNumber: payment.order.orderNumber,
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
