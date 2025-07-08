import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const name = data.get('name');
  const email = data.get('email');
  const message = data.get('message');

  if (!name || !email || !message) {
    return new Response('Missing fields', { status: 400 });
  }

  // ✅ Step 1: Validate against spam filter
  const res = await fetch(`${import.meta.env.PUBLIC_SUPABASE_URL}/functions/v1/check-inquiry-blocked`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message }),
  });

  const result = await res.json();

  if (!res.ok || result.allowed === false) {
    console.warn('Blocked form submission:', email);
    return new Response(null, {
      status: 302,
      headers: { Location: '/flagged/inquiry-blocked' },
    });
  }

  // ✅ Step 2: Send email to admin + user
  const adminEmail = import.meta.env.ADMIN_EMAIL;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: adminEmail,
      pass: import.meta.env.ADMIN_EMAIL_APP_PASS,
    },
  });

  try {
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

    return new Response(null, {
      status: 302,
      headers: { Location: '/messages/success-message' },
    });
  } catch (err) {
    console.error('Email send error:', err);
    return new Response('Email failed to send', { status: 500 });
  }
};
