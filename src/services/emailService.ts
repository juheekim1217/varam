// src/utils/sendInquiryEmails.ts
import nodemailer from 'nodemailer';

interface SendContactEmailsArgs {
  name: string;
  email: string;
  message: string;
  adminEmail: string;
}

interface SendTrialEmailsArgs {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  adminEmail: string;
}

interface SendDeletionEmailArgs {
  email: string;
  adminEmail: string;
}

// 🔔 Send contact form emails
export async function sendContactEmails({ name, email, message, adminEmail }: SendContactEmailsArgs) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: adminEmail,
      pass: import.meta.env.ADMIN_EMAIL_APP_PASS,
    },
  });

  // 🔔 Email to Admin
  await transporter.sendMail({
    from: `"Varam Strength" <${adminEmail}>`,
    to: adminEmail,
    replyTo: email.toString(), // User's email
    subject: '📬 New Website Contact Submission',
    text: `You’ve received a new message through the website contact form.

Contact Details:
–––––––––––––––––––––––––––
Name:  ${name}
Email: ${email}

Message:
–––––––––––––––––––––––––––
${message}

–––––––––––––––––––––––––––
You can reply to this message directly.`,
  });

  // ✉️ Confirmation Email to User
  await transporter.sendMail({
    from: `"Varam Strength" <${adminEmail}>`,
    to: email.toString(),
    subject: '✅ Varam Strength – We’ve Received Your Message',
    text: `Hi ${name},

Thanks for reaching out to Varam Strength!

This email confirms we’ve received your message via our website contact form. One of our team members will review it and get back to you shortly.

Here’s a copy of what you sent us:

–––––––––––––––––––––––––––
${message}
–––––––––––––––––––––––––––

If you have any additional details to share, feel free to reply directly to this email.

Looking forward to connecting with you soon!

– The Varam Strength Team`,
  });
}

// 🔔 Send trial request emails
export async function sendTrialEmails({ firstName, lastName, email, phone, message, adminEmail }: SendTrialEmailsArgs) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: adminEmail,
      pass: import.meta.env.ADMIN_EMAIL_APP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Varam Strength" <${adminEmail}>`,
    to: adminEmail,
    replyTo: email,
    subject: `📥 Trial Request: ${firstName} ${lastName}`,
    text: `You’ve received a new trial request.

–––––––––––––––––––––––––––––
Name:   ${firstName} ${lastName}
Email:  ${email}
Phone:  ${phone}

Message:
${message}
–––––––––––––––––––––––––––––

Reply directly to respond.`,
  });

  // 📧 Confirmation Email to User
  await transporter.sendMail({
    from: `"Varam Strength" <${adminEmail}>`,
    to: email,
    subject: '✅ Trial Session Request Received – Varam Strength',
    text: `Hi ${firstName},

Thank you for requesting a trial session with Varam Strength!

We’ve received your message and will get back to you shortly.

Here’s what you submitted:
–––––––––––––––––––––––––––––
Name:   ${firstName} ${lastName}
Email:  ${email}
Phone:  ${phone}

Message:
${message}
–––––––––––––––––––––––––––––

Talk to you soon!
– Varam Strength Team`,
  });
}

// 🔔 Send account deletion confirmation email
export async function sendAccountDeletionEmail({ email, adminEmail }: SendDeletionEmailArgs) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: adminEmail,
      pass: import.meta.env.ADMIN_EMAIL_APP_PASS,
    },
  });

  // Send notification to admin
  await transporter.sendMail({
    from: `"Varam Strength" <${adminEmail}>`,
    to: adminEmail,
    replyTo: email,
    subject: '🗑️ Account Deletion Alert',
    text: `An account has been deleted from Varam Strength.

Account Details:
–––––––––––––––––––––––––––––
Email: ${email}
Time: ${new Date().toLocaleString()}
–––––––––––––––––––––––––––––

This is an automated notification.`,
  });

  // Send confirmation to user
  await transporter.sendMail({
    from: `"Varam Strength" <${adminEmail}>`,
    to: email,
    subject: 'Account Deleted - Varam Strength',
    text: `Hello,

Your account has been successfully deleted from Varam Strength.

If you didn't request this deletion, please contact us immediately at ${adminEmail}.

We're sorry to see you go. You're always welcome back if you change your mind.

– The Varam Strength Team`,
    html: `
      <p>Hello,</p>
      <p>Your account has been successfully deleted from Varam Strength.</p>
      <p>If you didn't request this deletion, please contact us immediately at <a href="mailto:${adminEmail}">${adminEmail}</a>.</p>
      <br/>
      <p>We're sorry to see you go. You're always welcome back if you change your mind.</p>
      <br/>
      <p>– The Varam Strength Team</p>
    `,
  });
}
