import nodemailer from 'nodemailer';

// Email configuration
const emailConfig = {
  host: process.env.GMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.GMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER || '',
    pass: process.env.GMAIL_APP_PASSWORD || '', // Use App Password, not regular password
  },
};

// Sender configuration
const senderConfig = {
  name: process.env.EMAIL_SENDER_NAME || 'YSSVT',
  email: process.env.EMAIL_SENDER_EMAIL || process.env.GMAIL_USER || '',
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Verify transporter configuration
transporter.verify((error: any, success: any) => {
  if (error) {
    console.error('Email service configuration error:', error);
  } else {
    console.log('Email service is ready to send messages');
  }
});

// Email templates
const emailTemplates = {
  passwordReset: (resetLink: string, userName: string) => ({
    subject: 'Password Reset Request - YSSVT',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">YSSVT</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Yadav Samaj seva vikas Trust</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Hello ${userName},
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            We received a request to reset your password for your YSSVT account. 
            If you didn't make this request, you can safely ignore this email.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            This link will expire in 24 hours for security reasons.
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If the button above doesn't work, you can copy and paste this link into your browser:
          </p>
          
          <p style="background: #e9ecef; padding: 15px; border-radius: 5px; word-break: break-all; color: #495057; font-size: 14px;">
            ${resetLink}
          </p>
          
          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This is an automated email. Please do not reply to this message.
            If you need assistance, please contact our support team.
          </p>
        </div>
      </div>
    `,
    text: `
Password Reset Request - YSSVT

Hello ${userName},

We received a request to reset your password for your YSSVT account. 
If you didn't make this request, you can safely ignore this email.

Reset your password by clicking this link:
${resetLink}

This link will expire in 24 hours for security reasons.

If you need assistance, please contact our support team.

Best regards,
YSSVT Team
    `
  })
};

// Email service functions
export const emailService = {
  // Send password reset email
  async sendPasswordResetEmail(email: string, resetLink: string, userName: string) {
    try {
      const template = emailTemplates.passwordReset(resetLink, userName);
      
      const mailOptions = {
        from: `"${senderConfig.name}" <${senderConfig.email}>`,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Password reset email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  },
};

export default emailService;
