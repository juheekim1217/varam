import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const firstName = data.get('firstName')?.toString().trim();
  const lastName = data.get('lastName')?.toString().trim();
  const email = data.get('email')?.toString().trim();
  const phone = data.get('phone')?.toString().trim();
  const message = data.get('message')?.toString().trim();

  if (!firstName || !lastName || !email || !phone || !message) {
    return new Response('Missing fields', { status: 400 });
  }

  // 🔒 Edge Function to block spam
  const res = await fetch(`${import.meta.env.PUBLIC_SUPABASE_URL}/functions/v1/check-inquiry-blocked`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName, email, phone, message }),
  });

  const result = await res.json();

  if (!res.ok || result.allowed === false) {
    console.warn('Blocked trial request from:', email);
    return new Response(null, {
      status: 302,
      headers: { Location: '/flagged/inquiry-blocked' },
    });
  }

  const adminEmail = import.meta.env.ADMIN_EMAIL;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: adminEmail,
      pass: import.meta.env.ADMIN_EMAIL_APP_PASS,
    },
  });

  // 📧 Email to Admin
  try {
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

    return new Response(null, {
      status: 302,
      headers: { Location: '/messages/success-message' },
    });
  } catch (err) {
    console.error('Email send error:', err);
    return new Response('Email failed to send', { status: 500 });
  }
};
