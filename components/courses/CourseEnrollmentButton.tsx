'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { CurrencyDollarIcon, PlayCircleIcon } from '@heroicons/react/24/outline'

interface CourseEnrollmentButtonProps {
  courseId: string
  courseTitle: string
  amount: number
  session: any
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CourseEnrollmentButton({ 
  courseId, 
  courseTitle, 
  amount, 
  session 
}: CourseEnrollmentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleEnrollment = async () => {
    if (!session?.user) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.href))
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Create Razorpay order
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'COURSE',
          itemId: courseId,
          itemTitle: courseTitle,
          itemType: 'COURSE',
          unitPrice: amount,
          currency: 'INR'
        })
      })

      if (!orderResponse.ok) {
        throw new Error('Failed to create order')
      }

      const orderData = await orderResponse.json()

      // Load Razorpay script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.razorpayOrder.amount,
          currency: orderData.razorpayOrder.currency,
          name: 'Kalpla',
          description: `Payment for ${courseTitle}`,
          order_id: orderData.razorpayOrder.id,
          handler: async function (response: any) {
            try {
              // Verify payment
              const verifyResponse = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  orderId: orderData.order.id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature
                })
              })

              if (verifyResponse.ok) {
                // Redirect to success page
                router.push(`/payment/success?courseId=${courseId}`)
              } else {
                throw new Error('Payment verification failed')
              }
            } catch (error) {
              console.error('Payment verification error:', error)
              router.push(`/payment/failed?courseId=${courseId}`)
            }
          },
          prefill: {
            name: session.user.name,
            email: session.user.email,
          },
          theme: {
            color: '#3B82F6'
          }
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
      }
      script.onerror = () => {
        setError('Failed to load payment gateway')
        setIsLoading(false)
      }
      document.body.appendChild(script)

    } catch (error) {
      console.error('Enrollment error:', error)
      setError('Failed to process enrollment. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleEnrollment}
        disabled={isLoading}
        className="w-full bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <PlayCircleIcon className="h-5 w-5" />
            <span>Enroll Now - ₹{amount?.toLocaleString() || '0'}</span>
          </>
        )}
      </button>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  )
}
