// src/pages/api/book-session.ts
import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { addBooking } from '~/stores/bookingStore';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const date = formData.get('date')?.toString();
  const time = formData.get('time')?.toString();

  if (!name || !email || !date || !time) {
    const url = new URL('/messages/error-booking?reason=missing-fields', request.url);
    return Response.redirect(url.toString(), 302);
  }

  const result = await addBooking({ name, email, date, time });
  if (!result.success) {
    const url = new URL('/messages/error-booking', request.url);
    url.searchParams.set('reason', result.error);
    return Response.redirect(url.toString(), 302);
  }

  // ✅ Step 2: Send confirmation emails
  const adminEmail = import.meta.env.ADMIN_EMAIL;
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: adminEmail,
      pass: import.meta.env.ADMIN_EMAIL_APP_PASS, // App password from Gmail
    },
  });

  const subject = `✅ Varam Strength Session Booked - ${date} at ${time}`;
  const htmlMessage = `
    <p>Hi ${name},</p>
    <p>Your training session has been confirmed:</p>
    <ul>
      <li><strong>Date:</strong> ${date}</li>
      <li><strong>Time:</strong> ${time}</li>
    </ul>
    <p>We look forward to training with you!</p>
    <p>– Varam Strength</p>
  `;

  const from = `"Varam Strength" <${adminEmail}>`;
  try {
    // 📧 Email To admin
    await transporter.sendMail({
      from,
      to: adminEmail,
      replyTo: email,
      subject: `📥 New Booking from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nDate: ${date}\nTime: ${time}`,
    });

    // 📧 Email To user
    await transporter.sendMail({
      from,
      to: email,
      subject,
      html: htmlMessage,
    });
  } catch (err) {
    console.error('❌ Failed to send booking emails:', err);
    // Don't block user if email fails
  }

  return new Response(null, {
    status: 302,
    headers: { Location: '/messages/success-booking' },
  });
};
