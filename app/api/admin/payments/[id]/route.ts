import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PaymentService } from '@/lib/payment'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
            type: true,
            itemTitle: true,
            itemType: true,
            totalAmount: true,
            status: true,
            createdAt: true
          }
        }
      }
    })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: payment
    })
  } catch (error) {
    console.error('Error fetching payment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status, refundAmount, refundReason } = body

    // Check if payment exists
    const existingPayment = await prisma.payment.findUnique({
      where: { id: params.id },
      include: {
        order: true
      }
    })

    if (!existingPayment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // Handle refund
    if (status === 'REFUNDED' && existingPayment.status === 'SUCCESS') {
      try {
        const refundedPayment = await PaymentService.refundPayment(
          params.id,
          refundAmount,
          refundReason
        )

        return NextResponse.json({
          success: true,
          data: refundedPayment,
          message: 'Payment refunded successfully'
        })
      } catch (refundError: any) {
        return NextResponse.json(
          { error: refundError.message || 'Failed to process refund' },
          { status: 400 }
        )
      }
    }

    // Update payment status
    const updatedPayment = await prisma.payment.update({
      where: { id: params.id },
      data: {
        status,
        ...(refundAmount && { refundAmount }),
        ...(refundReason && { refundReason })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        order: true
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedPayment,
      message: 'Payment updated successfully'
    })
  } catch (error) {
    console.error('Error updating payment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
