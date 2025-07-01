import { Resend } from 'resend';
const resend = new Resend(import.meta.env.RESEND_API_KEY);

// after Supabase insert:
await resend.emails.send({
  from: 'trainer@yourdomain.com',
  to: 'youremail@gmail.com',
  subject: 'New Training Session Booked',
  html: `

  `,
});