import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { addBooking } from '~/stores/bookingStore';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();

  const coachId = formData.get('coach_id') as string;
  const coachName = formData.get('coach_name') as string; // Now available
  const email = formData.get('email') as string;
  const name = formData.get('name') as string;
  const phone = formData.get('phone')?.toString().trim();
  const date = formData.get('date')?.toString();
  const time = formData.get('time')?.toString();

  const training_type = formData.get('training_type')?.toString();
  const concern = formData.get('concern')?.toString();
  const note = formData.get('note')?.toString();

  if (!name || !email || !date || !time || !coachId || !training_type) {
    const url = new URL('/messages/error-booking?reason=missing-fields', request.url);
    return Response.redirect(url.toString(), 302);
  }

  const result = await addBooking({ email, date, time, coach_id: coachId, training_type, concern, note });

  if (!result.success) {
    const url = new URL('/messages/error-booking', request.url);
    url.searchParams.set('reason', result.error || 'unknown');
    return Response.redirect(url.toString(), 302);
  }

  // ✅ Send confirmation emails to admin and client
  const adminEmail = import.meta.env.ADMIN_EMAIL;
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: adminEmail,
      pass: import.meta.env.ADMIN_EMAIL_APP_PASS,
    },
  });

  const subject = `✅ Varam Strength Session Booked - ${date} at ${time}`;
  const htmlMessage = `
    <p>Hi ${name},</p>
    <p>Your training session has been confirmed:</p>
    <ul>
      <li><strong>Date:</strong> ${date}</li>
      <li><strong>Time:</strong> ${time}</li>
      <li><strong>Coach Name:</strong> ${coachName}</li>
      <li><strong>Training Type:</strong> ${training_type}</li>
    </ul>
    ${note ? `<p><strong>Note:</strong> ${note}</p>` : ''}
    ${concern ? `<p><strong>Concern:</strong> ${concern}</p>` : ''}
    <p>We look forward to training with you!</p>
    <p>– Varam Strength</p>
  `;

  const from = `"Varam Strength" <${adminEmail}>`;
  try {
    await transporter.sendMail({
      from,
      to: adminEmail,
      replyTo: email,
      subject: `📥 New Booking from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nDate: ${date}\nTime: ${time}\nCoach: ${coachName}\nType: ${training_type}\nNote: ${note}\nConcern: ${concern}`,
    });

    await transporter.sendMail({
      from,
      to: email,
      subject,
      html: htmlMessage,
    });
  } catch (err) {
    console.error('❌ Failed to send booking emails:', err);
  }

  return new Response(null, {
    status: 302,
    headers: { Location: '/messages/success-booking' },
  });
};
