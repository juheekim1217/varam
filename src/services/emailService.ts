// src/utils/sendInquiryEmails.ts
import nodemailer from 'nodemailer';

interface SendInquiryEmailsArgs {
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

export async function sendContactEmails({ name, email, message, adminEmail }: SendInquiryEmailsArgs) {
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
