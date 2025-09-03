import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export async function sendEmail(to: string, subject: string, html: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export async function sendWelcomeEmail(userEmail: string, userName: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: 'Welcome to Kalpla!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to Kalpla!</h1>
        <p>Hi ${userName},</p>
        <p>Thank you for joining our e-learning platform. We're excited to have you on board!</p>
        <p>You can now:</p>
        <ul>
          <li>Browse our course catalog</li>
          <li>Enroll in courses that interest you</li>
          <li>Track your learning progress</li>
          <li>Connect with instructors and fellow students</li>
        </ul>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Happy learning!</p>
        <p>Best regards,<br>The Kalpla Team</p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Error sending welcome email:', error)
  }
}

export async function sendPasswordResetEmail(userEmail: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: 'Reset Your Password - Kalpla',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Reset Your Password</h1>
        <p>You requested a password reset for your Kalpla account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Reset Password
        </a>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>The Kalpla Team</p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Error sending password reset email:', error)
  }
}

export async function sendCourseEnrollmentEmail(userEmail: string, userName: string, courseTitle: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: `Welcome to ${courseTitle} - Kalpla`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to ${courseTitle}!</h1>
        <p>Hi ${userName},</p>
        <p>Congratulations! You've successfully enrolled in <strong>${courseTitle}</strong>.</p>
        <p>You can now access your course materials and start learning immediately.</p>
        <p>Here's what you can do next:</p>
        <ul>
          <li>Review the course syllabus</li>
          <li>Watch the first video lesson</li>
          <li>Complete the first assignment</li>
          <li>Join course discussions</li>
        </ul>
        <p>Happy learning!</p>
        <p>Best regards,<br>The Kalpla Team</p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Error sending course enrollment email:', error)
  }
}

export async function sendPaymentConfirmationEmail(userEmail: string, userName: string, courseTitle: string, amount: number) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: 'Payment Confirmation - Kalpla',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Payment Confirmed!</h1>
        <p>Hi ${userName},</p>
        <p>Thank you for your purchase! Your payment has been successfully processed.</p>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Details:</h3>
          <p><strong>Course:</strong> ${courseTitle}</p>
          <p><strong>Amount:</strong> ₹${amount}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <p>You now have full access to the course content. Start learning today!</p>
        <p>Best regards,<br>The Kalpla Team</p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Error sending payment confirmation email:', error)
  }
}
