import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const firstName = data.get('firstName');
  const lastName = data.get('lastName');
  const email = data.get('email');
  const phone = data.get('phone');
  const message = data.get('message');

  if (!firstName || !lastName || !email || !phone || !message) {
    return new Response('Missing fields', { status: 400 });
  }

  // Gmail SMTP config
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'varamstrength@gmail.com',
      pass: import.meta.env.PUBLIC_EMAIL_APP_PASS, // set in your `.env`
    },
  });
    console.log('transporter created');
  try {
    await transporter.sendMail({
      from: `"Varam Website" <varamstrength@gmail.com>`,
      to: 'varamstrength@gmail.com',
      subject: 'New Trial Request from Website',
      text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
    });
    console.log('Email sent await');
    return new Response(null, {
      status: 302,
      headers: { Location: '/success' },
    });
  } catch (err) {
    console.error('Email send error:', err);
    return new Response('Email failed to send', { status: 500 });
  }
};
