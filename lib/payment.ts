import { prisma } from '@/lib/prisma'
import Razorpay from 'razorpay'
import crypto from 'crypto'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export interface CreateOrderData {
  userId: string
  type: 'COURSE' | 'DEGREE_PROGRAM' | 'MENTORSHIP' | 'SUBSCRIPTION'
  itemId: string
  itemTitle: string
  itemType: string
  unitPrice: number
  quantity?: number
  currency?: string
  billingAddress?: any
  shippingAddress?: any
  notes?: string
}

export interface PaymentData {
  orderId: string
  amount: number
  currency?: string
  paymentMethod?: string
  description?: string
  metadata?: any
  userId: string
}

export class PaymentService {
  // Create a new order
  static async createOrder(data: CreateOrderData) {
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    const quantity = data.quantity || 1
    const totalAmount = data.unitPrice * quantity

    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        orderNumber,
        type: data.type,
        itemId: data.itemId,
        itemTitle: data.itemTitle,
        itemType: data.itemType,
        quantity,
        unitPrice: data.unitPrice,
        totalAmount,
        currency: data.currency || 'INR',
        billingAddress: data.billingAddress ? JSON.stringify(data.billingAddress) : null,
        shippingAddress: data.shippingAddress ? JSON.stringify(data.shippingAddress) : null,
        notes: data.notes,
      },
    })

    return order
  }

  // Create Razorpay order
  static async createRazorpayOrder(order: any, user: any) {
    const options = {
      amount: Math.round(order.totalAmount * 100), // Convert to paise
      currency: order.currency,
      receipt: order.orderNumber,
      notes: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        itemId: order.itemId,
        itemTitle: order.itemTitle,
        userId: user.id,
        userEmail: user.email,
      },
      prefill: {
        name: user.name || '',
        email: user.email || '',
      },
    }

    const razorpayOrder = await razorpay.orders.create(options)
    return razorpayOrder
  }

  // Create payment record
  static async createPayment(data: PaymentData) {
    const payment = await prisma.payment.create({
      data: {
        userId: data.userId,
        orderId: data.orderId,
        amount: data.amount,
        currency: data.currency || 'INR',
        status: 'PENDING',
        paymentMethod: data.paymentMethod,
        paymentGateway: 'razorpay',
        description: data.description,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      },
    })

    return payment
  }

  // Verify Razorpay payment
  static async verifyRazorpayPayment(paymentId: string, orderId: string, signature: string) {
    // Verify signature
    const body = orderId + '|' + paymentId
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex')

    if (expectedSignature !== signature) {
      throw new Error('Invalid payment signature')
    }

    // Get payment details from Razorpay
    const payment = await razorpay.payments.fetch(paymentId)

    if (payment.status !== 'captured') {
      throw new Error('Payment not captured')
    }

    return payment
  }

  // Update payment status
  static async updatePaymentStatus(paymentId: string, status: string, gatewayData?: any) {
    const updateData: any = {
      status,
      updatedAt: new Date(),
    }

    if (gatewayData) {
      updateData.gatewayPaymentId = gatewayData.id
      updateData.metadata = JSON.stringify(gatewayData)
    }

    if (status === 'SUCCESS') {
      updateData.gatewayPaymentId = gatewayData?.id
    }

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: updateData,
      include: {
        order: true,
        user: true,
      },
    })

    return payment
  }

  // Update order status
  static async updateOrderStatus(orderId: string, status: string) {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        updatedAt: new Date(),
      },
    })

    return order
  }

  // Process successful payment
  static async processSuccessfulPayment(payment: any) {
    const { order, user } = payment

    // Update order status
    await this.updateOrderStatus(order.id, 'CONFIRMED')

    // Handle different order types
    switch (order.type) {
      case 'COURSE':
        await this.handleCourseEnrollment(order, user)
        break
      case 'DEGREE_PROGRAM':
        await this.handleDegreeEnrollment(order, user)
        break
      case 'MENTORSHIP':
        await this.handleMentorshipEnrollment(order, user)
        break
      case 'SUBSCRIPTION':
        await this.handleSubscriptionEnrollment(order, user)
        break
    }

    return { success: true }
  }

  // Handle course enrollment
  static async handleCourseEnrollment(order: any, user: any) {
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: order.itemId,
        },
      },
    })

    if (!existingEnrollment) {
      await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: order.itemId,
          status: 'ACTIVE',
        },
      })
    }
  }

  // Handle degree program enrollment
  static async handleDegreeEnrollment(order: any, user: any) {
    const existingEnrollment = await prisma.degreeEnrollment.findUnique({
      where: {
        userId_programId: {
          userId: user.id,
          programId: order.itemId,
        },
      },
    })

    if (!existingEnrollment) {
      await prisma.degreeEnrollment.create({
        data: {
          userId: user.id,
          programId: order.itemId,
          status: 'ENROLLED',
          paymentId: order.payment?.gatewayPaymentId,
          paymentStatus: 'SUCCESS',
        },
      })
    }
  }

  // Handle mentorship enrollment
  static async handleMentorshipEnrollment(order: any, user: any) {
    const existingEnrollment = await prisma.mentorshipEnrollment.findUnique({
      where: {
        userId_programId: {
          userId: user.id,
          programId: order.itemId,
        },
      },
    })

    if (!existingEnrollment) {
      await prisma.mentorshipEnrollment.create({
        data: {
          userId: user.id,
          programId: order.itemId,
          status: 'ENROLLED',
          paymentId: order.payment?.gatewayPaymentId,
          paymentStatus: 'SUCCESS',
        },
      })
    }
  }

  // Handle subscription enrollment
  static async handleSubscriptionEnrollment(order: any, user: any) {
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: order.itemId },
    })

    if (!plan) {
      throw new Error('Subscription plan not found')
    }

    const endDate = this.calculateSubscriptionEndDate(plan.type)

    await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: order.itemId,
        planName: plan.name,
        planType: plan.type,
        amount: order.totalAmount,
        currency: order.currency,
        status: 'ACTIVE',
        startDate: new Date(),
        endDate,
        nextBillingDate: plan.type !== 'LIFETIME' ? endDate : null,
        gatewaySubscriptionId: order.payment?.gatewayPaymentId,
      },
    })
  }

  // Calculate subscription end date
  static calculateSubscriptionEndDate(planType: string): Date | null {
    const now = new Date()
    
    switch (planType) {
      case 'MONTHLY':
        return new Date(now.setMonth(now.getMonth() + 1))
      case 'YEARLY':
        return new Date(now.setFullYear(now.getFullYear() + 1))
      case 'LIFETIME':
        return null
      default:
        return null
    }
  }

  // Get user's payment history
  static async getUserPayments(userId: string, page = 1, limit = 10) {
    const offset = (page - 1) * limit

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where: { userId },
        include: {
          order: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.payment.count({
        where: { userId },
      }),
    ])

    return {
      payments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  // Get user's orders
  static async getUserOrders(userId: string, page = 1, limit = 10) {
    const offset = (page - 1) * limit

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: {
          payment: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.order.count({
        where: { userId },
      }),
    ])

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  // Get order by ID
  static async getOrderById(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        payment: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return order
  }

  // Get payment by ID
  static async getPaymentById(paymentId: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return payment
  }

  // Refund payment
  static async refundPayment(paymentId: string, amount?: number, reason?: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true },
    })

    if (!payment) {
      throw new Error('Payment not found')
    }

    if (payment.status !== 'SUCCESS') {
      throw new Error('Payment cannot be refunded')
    }

    const refundAmount = amount || payment.amount

    // Process refund through Razorpay
    const refund = await razorpay.payments.refund(payment.gatewayPaymentId!, {
      amount: Math.round(refundAmount * 100),
      notes: {
        reason: reason || 'Customer request',
      },
    })

    // Update payment record
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'REFUNDED',
        refundAmount,
        refundReason: reason,
        refundedAt: new Date(),
        gatewayRefundId: refund.id,
      },
    })

    // Update order status
    await this.updateOrderStatus(payment.orderId, 'REFUNDED')

    return updatedPayment
  }
}
