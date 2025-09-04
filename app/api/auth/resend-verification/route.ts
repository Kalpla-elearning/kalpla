import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.isVerified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      )
    }

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const verificationCodeExpiry = new Date(Date.now() + 600000) // 10 minutes

    // Update user with new verification code
    await prisma.user.update({
      where: { email },
      data: {
        verificationCode,
        verificationCodeExpiry,
      },
    })

    // Send verification email
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Verify Your Email Address</h2>
        <p>Hello ${user.name},</p>
        <p>Please use the following verification code to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; display: inline-block;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #333;">${verificationCode}</span>
          </div>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't create an account with Kalpla, please ignore this email.</p>
        <p>Best regards,<br>The Kalpla Team</p>
      </div>
    `

    await sendEmail(email, 'Verify Your Email - Kalpla', emailContent)

    return NextResponse.json(
      { message: 'Verification code sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'An error occurred while sending the verification code.' },
      { status: 500 }
    )
  }
}
