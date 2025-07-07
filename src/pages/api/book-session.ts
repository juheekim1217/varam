// src/pages/api/book-session.ts
import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { addBooking } from '~/stores/bookingStore';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get('name')?.toString();
  const email = formData.get('email')?.toString();
  const date = formData.get('date')?.toString();
  const time = formData.get('time')?.toString();

  if (!name || !email || !date || !time) {
    return new Response('Missing fields', { status: 400 });
  }

  try {
    const result = await addBooking({ name, email, date, time });
    if (!result.success) {
      return new Response(JSON.stringify({ error: result.error }), { status: 500 });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
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
    // To user
    await transporter.sendMail({
      from,
      to: email,
      subject,
      html: htmlMessage,
    });

    // To admin
    await transporter.sendMail({
      from,
      to: adminEmail,
      subject: `📥 New Booking from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nDate: ${date}\nTime: ${time}`,
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
