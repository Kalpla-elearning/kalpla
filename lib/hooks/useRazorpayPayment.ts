'use client'

import { useState } from 'react'
import { useSession } from '@/lib/hooks/useAuth'

interface PaymentOptions {
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
  programId?: string
  programTitle?: string
}

interface PaymentResult {
  success: boolean
  paymentId?: string
  error?: string
}

export const useRazorpayPayment = () => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initializePayment = async (options: PaymentOptions): Promise<PaymentResult> => {
    if (!session?.user) {
      return { success: false, error: 'Please login to continue' }
    }

    setLoading(true)
    setError(null)

    try {
      // Step 1: Create order on server
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: options.type,
          itemId: options.itemId,
          itemTitle: options.itemTitle,
          itemType: options.itemType,
          unitPrice: options.unitPrice,
          quantity: options.quantity || 1,
          currency: options.currency || 'INR',
          billingAddress: options.billingAddress,
          shippingAddress: options.shippingAddress,
          notes: options.notes,
        }),
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json()
        throw new Error(errorData.error || 'Failed to create payment order')
      }

      const orderData = await orderResponse.json()

      // Step 2: Initialize Razorpay
      const razorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Kalpla',
        description: `Payment for ${options.programTitle}`,
        order_id: orderData.orderId,
        prefill: {
          name: session.user.name || '',
          email: session.user.email || '',
        },
        theme: {
          color: '#365549',
        },
        handler: async function (response: any) {
          try {
            // Step 3: Verify payment on server
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            if (!verifyResponse.ok) {
              const errorData = await verifyResponse.json()
              throw new Error(errorData.error || 'Payment verification failed')
            }

            const verifyData = await verifyResponse.json()
            
            // Redirect to success page
            const successUrl = `/payment/success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}&program_id=${options.programId}`
            window.location.href = successUrl
            
            return { success: true, paymentId: verifyData.paymentId }
          } catch (error) {
            console.error('Payment verification error:', error)
            return { success: false, error: 'Payment verification failed' }
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false)
            setError('Payment cancelled')
          },
        },
        notes: {
          programId: options.programId,
          programTitle: options.programTitle,
        },
      }

      // Load Razorpay script if not already loaded
      if (!(window as any).Razorpay) {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        document.body.appendChild(script)

        await new Promise((resolve, reject) => {
          script.onload = resolve
          script.onerror = reject
        })
      }

      // Initialize Razorpay
      const razorpay = new (window as any).Razorpay(razorpayOptions)
      razorpay.open()

      return { success: true }
    } catch (error) {
      console.error('Payment initialization error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Payment failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    initializePayment,
    loading,
    error,
    clearError: () => setError(null),
  }
}
