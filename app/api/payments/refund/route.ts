import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PaymentService } from '@/lib/payment'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const refundSchema = z.object({
  paymentId: z.string(),
  amount: z.number().positive().optional(),
  reason: z.string().min(1, 'Refund reason is required'),
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
    const validatedData = refundSchema.parse(body)

    // Get the payment to verify ownership
    const payment = await PaymentService.getPaymentById(validatedData.paymentId)
    
    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
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

    // Process the refund
    const refundedPayment = await PaymentService.refundPayment(
      validatedData.paymentId,
      validatedData.amount,
      validatedData.reason
    )

    return NextResponse.json({
      success: true,
      message: 'Payment refunded successfully',
      payment: refundedPayment,
    })
  } catch (error) {
    console.error('Error processing refund:', error)
    
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
      { error: 'Failed to process refund' },
      { status: 500 }
    )
  }
}
