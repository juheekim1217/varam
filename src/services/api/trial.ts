import type { APIRoute } from 'astro';
import { sendTrialEmails } from '~/services/emailService';
import { validateEmailInquiry } from '~/utils/validation';

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

  // Client-side validation
  const validation = validateEmailInquiry(email, message);
  if (!validation.allowed) {
    const url = new URL('/messages/error', request.url);
    url.searchParams.set('reason', validation.reason || 'blocked');
    return Response.redirect(url.toString(), 302);
  }

  try {
    await sendTrialEmails({
      firstName,
      lastName,
      email,
      phone,
      message,
      adminEmail: import.meta.env.ADMIN_EMAIL,
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
