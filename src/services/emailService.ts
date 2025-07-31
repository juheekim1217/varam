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

interface SendDeleteBookingEmailsArgs {
  bookingId: string;
  name: string;
  email: string;
  date: string;
  time: string;
  coach_name?: string;
  training_type?: string;
  adminEmail: string;
}

interface SendBookingReminderArgs {
  bookingId: string;
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  coach_name?: string;
  training_type?: string;
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

// ✅ Send booking deletion emails
export async function sendDeleteBookingEmails({
  bookingId,
  name,
  email,
  date,
  time,
  coach_name,
  training_type,
  adminEmail,
}: SendDeleteBookingEmailsArgs) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: adminEmail,
      pass: import.meta.env.ADMIN_EMAIL_APP_PASS,
    },
  });

  // 🔔 Email to Admin about cancellation
  await transporter.sendMail({
    from: `"Varam Strength" <${adminEmail}>`,
    to: adminEmail,
    replyTo: email,
    subject: `❌ Booking Cancelled - ${name} (${date} at ${time})`,
    text: `A training session has been cancelled.

Cancellation Details:
–––––––––––––––––––––––––––
Booking ID: ${bookingId}
Client:     ${name}
Email:      ${email}
Date:       ${date}
Time:       ${time}
${coach_name ? `Coach:      ${coach_name}` : ''}
${training_type ? `Type:       ${training_type}` : ''}

–––––––––––––––––––––––––––
The time slot is now available for rebooking.`,
  });

  // ✉️ Confirmation Email to User
  await transporter.sendMail({
    from: `"Varam Strength" <${adminEmail}>`,
    to: email,
    subject: '❌ Training Session Cancelled – Varam Strength',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Session Cancelled</h2>
        
        <p>Hi ${name},</p>
        
        <p>Your training session has been successfully cancelled:</p>
        
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #dc2626;">Cancelled Session</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li><strong>Date:</strong> ${date}</li>
            <li><strong>Time:</strong> ${time}</li>
            ${coach_name ? `<li><strong>Coach:</strong> ${coach_name}</li>` : ''}
            ${training_type ? `<li><strong>Training Type:</strong> ${training_type}</li>` : ''}
          </ul>
        </div>
        
        <p>If you'd like to reschedule or book a new session, you can do so through your account dashboard.</p>
        
        <p>If you have any questions or need assistance, feel free to reply to this email.</p>
        
        <p>Thank you for choosing Varam Strength!</p>
        
        <p>– The Varam Strength Team</p>
      </div>
    `,
    text: `Hi ${name},

Your training session has been successfully cancelled:

Cancelled Session:
–––––––––––––––––––––––––––
Date: ${date}
Time: ${time}
${coach_name ? `Coach: ${coach_name}` : ''}
${training_type ? `Training Type: ${training_type}` : ''}
–––––––––––––––––––––––––––

If you'd like to reschedule or book a new session, you can do so through your account dashboard.

If you have any questions or need assistance, feel free to reply to this email.

Thank you for choosing Varam Strength!

– The Varam Strength Team`,
  });
}

// 🔔 Send booking reminder email
export async function sendBookingReminder({
  name,
  email,
  phone,
  date,
  time,
  coach_name,
  training_type,
  adminEmail,
}: SendBookingReminderArgs) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: adminEmail,
      pass: import.meta.env.ADMIN_EMAIL_APP_PASS,
    },
  });

  // Format the date nicely
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  await transporter.sendMail({
    from: `"Varam Strength" <${adminEmail}>`,
    to: email,
    subject: '⏰ Reminder: Your Training Session is Today!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Training Session Reminder</h2>
        
        <p>Hi ${name},</p>
        
        <p>This is a friendly reminder that you have a training session scheduled for <strong>today</strong>!</p>
        
        <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #059669; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #059669;">Session Details</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li><strong>Date:</strong> ${formattedDate}</li>
            <li><strong>Time:</strong> ${time}</li>
            ${phone ? `<li><strong>Phone:</strong> ${phone}</li>` : ''}
            ${coach_name ? `<li><strong>Coach:</strong> ${coach_name}</li>` : ''}
            ${training_type ? `<li><strong>Training Type:</strong> ${training_type}</li>` : ''}
          </ul>
        </div>
        
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>💡 Tips for your session:</strong></p>
          <ul style="margin: 10px 0 0 0; padding-left: 20px;">
            <li>Arrive 5-10 minutes early</li>
            <li>Bring water and a towel</li>
            <li>Wear comfortable workout clothes</li>
          </ul>
        </div>
        
        <p>If you need to cancel or reschedule, please do so as soon as possible through your account dashboard or by replying to this email.</p>
        
        <p>Looking forward to seeing you today!</p>
        
        <p>– The Varam Strength Team</p>
      </div>
    `,
    text: `Hi ${name},

This is a friendly reminder that you have a training session scheduled for today!

Session Details:
–––––––––––––––––––––––––––
Date: ${formattedDate}
Time: ${time}
${phone ? `Phone: ${phone}` : ''}
${coach_name ? `Coach: ${coach_name}` : ''}
${training_type ? `Training Type: ${training_type}` : ''}
–––––––––––––––––––––––––––

Tips for your session:
• Arrive 5-10 minutes early
• Bring water and a towel
• Wear comfortable workout clothes

If you need to cancel or reschedule, please do so as soon as possible through your account dashboard or by replying to this email.

Looking forward to seeing you today!

– The Varam Strength Team`,
  });
}

// Early morning reminder email
export async function sendEarlyBookingReminder({
  bookingId,
  name,
  email,
  date,
  time,
  coach_name,
  training_type,
  adminEmail,
}: SendBookingReminderArgs) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: adminEmail,
      pass: import.meta.env.ADMIN_EMAIL_APP_PASS,
    },
  });

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  await transporter.sendMail({
    from: `"Varam Strength" <${adminEmail}>`,
    to: email,
    subject: '🌅 Early Morning Session Reminder - Today!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Good Morning! Your Early Session is Today</h2>
        
        <p>Hi ${name},</p>
        
        <p>This is your <strong>early morning reminder</strong> for your training session today!</p>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #f59e0b;">⏰ Early Session Details</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li><strong>Date:</strong> ${formattedDate}</li>
            <li><strong>Time:</strong> ${time}</li>
            ${coach_name ? `<li><strong>Coach:</strong> ${coach_name}</li>` : ''}
            ${training_type ? `<li><strong>Training Type:</strong> ${training_type}</li>` : ''}
          </ul>
        </div>
        
        <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>🌅 Early Morning Tips:</strong></p>
          <ul style="margin: 10px 0 0 0; padding-left: 20px;">
            <li>Set multiple alarms to ensure you wake up</li>
            <li>Prepare your workout clothes the night before</li>
            <li>Have a light snack or coffee if needed</li>
            <li>Arrive 10 minutes early for your early session</li>
          </ul>
        </div>
        
        <p>We appreciate you choosing our early morning slot! Your coach will be ready and energized to help you start your day strong.</p>
        
        <p>See you bright and early!</p>
        
        <p>– The Varam Strength Team</p>
      </div>
    `,
    text: `Good morning ${name}!

This is your early morning reminder for your training session today!

Early Session Details:
–––––––––––––––––––––––––––
Date: ${formattedDate}
Time: ${time}
${coach_name ? `Coach: ${coach_name}` : ''}
${training_type ? `Training Type: ${training_type}` : ''}
–––––––––––––––––––––––––––

Early Morning Tips:
• Set multiple alarms to ensure you wake up
• Prepare your workout clothes the night before
• Have a light snack or coffee if needed
• Arrive 10 minutes early for your early session

We appreciate you choosing our early morning slot! Your coach will be ready and energized to help you start your day strong.

See you bright and early!

– The Varam Strength Team`,
  });
}
