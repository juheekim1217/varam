import { Resend } from 'resend';
const resend = new Resend(import.meta.env.RESEND_API_KEY);

// after Supabase insert:
await resend.emails.send({
  from: 'trainer@yourdomain.com',
  to: 'youremail@gmail.com',
  subject: 'New Training Session Booked',
  html: `
    <p><strong>${name}</strong> booked a session on <strong>${date}</strong> at <strong>${time}</strong>.</p>
    <p>Email: ${email}</p>
  `,
});