// src/pages/api/contact.ts
import type { APIRoute } from 'astro';
import { checkContactInquiryBlocked } from '~/services/edgeFunctionService';
import { sendContactEmails } from '~/services/emailService';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const name = data.get('name')?.toString();
  const email = data.get('email')?.toString();
  const message = data.get('message')?.toString();

  if (!name || !email || !message) {
    return new Response('Missing fields', { status: 400 });
  }

  const result = await checkContactInquiryBlocked({ name, email, message });
  if (!result.allowed) {
    return new Response(null, {
      status: 302,
      headers: { Location: '/flagged/inquiry-blocked' },
    });
  }

  try {
    await sendContactEmails({
      name,
      email,
      message,
      adminEmail: import.meta.env.ADMIN_EMAIL,
    });

    return new Response(null, {
      status: 302,
      headers: { Location: '/messages/success-message' },
    });
  } catch (err) {
    console.error('Email error:', err);
    return new Response('Email failed', { status: 500 });
  }
};
