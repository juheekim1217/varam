import type { APIRoute } from 'astro';
import { checkTrialInquiryBlocked } from '~/services/edgeFunctionService';
import { sendTrialEmails } from '~/services/emailService';

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
  // const res = await fetch(`${import.meta.env.PUBLIC_SUPABASE_URL}/functions/v1/check-inquiry-blocked`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ firstName, lastName, email, phone, message }),
  // });

  // const result = await res.json();

  // if (!res.ok || result.allowed === false) {
  //   console.warn('Blocked trial request from:', email);
  //   return new Response(null, {
  //     status: 302,
  //     headers: { Location: '/flagged/inquiry-blocked' },
  //   });
  // }
  const result = await checkTrialInquiryBlocked({ firstName, lastName, email, phone, message });
  if (!result.allowed) {
    return new Response(null, {
      status: 302,
      headers: { Location: '/flagged/inquiry-blocked' },
    });
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
