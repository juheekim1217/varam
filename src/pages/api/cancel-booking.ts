import type { APIRoute } from 'astro';
import { deleteBooking } from '~/stores/bookingStore';
import { sendDeleteBookingEmails } from '~/services/emailService';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const bookingId = formData.get('bookingId')?.toString();
    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString();
    const date = formData.get('date')?.toString();
    const time = formData.get('time')?.toString();
    const coach_name = formData.get('coach_name')?.toString();
    const training_type = formData.get('training_type')?.toString();

    if (!bookingId) {
      const url = new URL('/messages/error-cancellation?reason=missing-booking-id', request.url);
      return Response.redirect(url.toString(), 302);
    }

    // Delete the booking
    const deleteResult = await deleteBooking(bookingId);

    if (!deleteResult.success) {
      const url = new URL('/messages/error-cancellation', request.url);
      url.searchParams.set('reason', deleteResult.error || 'unknown');
      return Response.redirect(url.toString(), 302);
    }

    // Send cancellation emails
    try {
      await sendDeleteBookingEmails({
        bookingId: bookingId,
        name: name ?? '',
        email: email ?? '',
        date: date ?? '',
        time: time ?? '',
        coach_name: coach_name ?? '',
        training_type: training_type ?? '',
        adminEmail: import.meta.env.ADMIN_EMAIL || 'admin@varamstrength.com',
      });
    } catch (emailError) {
      console.error('❌ Failed to send cancellation emails:', emailError);
    }

    return new Response(null, {
      status: 302,
      headers: { Location: '/messages/success-cancellation' },
    });
  } catch (error) {
    console.error('❌ Error cancelling booking:', error);
    const url = new URL('/messages/error-cancellation?reason=server-error', request.url);
    return Response.redirect(url.toString(), 302);
  }
};
