// src/pages/api/contact.ts
import type { APIRoute } from 'astro';
import { sendContactEmails } from '~/services/emailService';
import { validateEmailInquiry } from '~/utils/validation';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    const name = data.get('name')?.toString().trim();
    const email = data.get('email')?.toString().trim();
    const message = data.get('message')?.toString().trim();

    if (!name || !email || !message) {
      const url = new URL('/messages/error?reason=missing-fields', request.url);
      return Response.redirect(url.toString(), 302);
    }

    // Client-side validation
    const validation = validateEmailInquiry(email, message);
    if (!validation.allowed) {
      const url = new URL('/messages/error', request.url);
      url.searchParams.set('reason', validation.reason || 'blocked');
      return Response.redirect(url.toString(), 302);
    }

    // Send emails
    await sendContactEmails({
      name,
      email,
      message,
      adminEmail: import.meta.env.ADMIN_EMAIL,
    });

    // Redirect to success page
    const successUrl = new URL('/messages/success-message', request.url);
    return Response.redirect(successUrl.toString(), 302);
  } catch (err) {
    console.error('Contact form error:', err);
    const errorUrl = new URL('/messages/error', request.url);
    errorUrl.searchParams.set('reason', 'server-error');
    return Response.redirect(errorUrl.toString(), 302);
  }
};
