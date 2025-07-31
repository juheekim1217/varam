import type { APIRoute } from 'astro';
import { supabase } from '~/lib/supabaseClient';
import { sendBookingReminder } from '~/services/emailService';

export const GET: APIRoute = async ({ request }) => {
  // Verify the request is from Vercel Cron (optional security)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${import.meta.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Get today's date
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Fetch all bookings for today that haven't been reminded
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('date', todayString)
      .eq('reminder_sent', false);
    //.eq('status', 'confirmed'); // Only confirmed bookings

    if (error) {
      console.error('Error fetching bookings:', error);
      return new Response('Error fetching bookings', { status: 500 });
    }

    if (!bookings || bookings.length === 0) {
      return new Response('No reminders to send', { status: 200 });
    }

    // Send reminder emails
    type ReminderResult = { bookingId: number; status: string; error?: string };
    const results: ReminderResult[] = [];
    for (const booking of bookings) {
      try {
        await sendBookingReminder({
          bookingId: booking.id,
          name: '',
          email: booking.email,
          phone: '',
          date: booking.date,
          time: booking.time,
          coach_name: booking.coach_name,
          training_type: booking.training_type,
          adminEmail: import.meta.env.ADMIN_EMAIL,
        });

        // Mark reminder as sent
        await supabase.from('bookings').update({ reminder_sent: true }).eq('id', booking.id);

        results.push({ bookingId: booking.id, status: 'sent' });
      } catch (error: unknown) {
        console.error(`Error sending reminder for booking ${booking.id}:`, error);
        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        results.push({ bookingId: booking.id, status: 'failed', error: errorMessage });
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Reminder process completed',
        results,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Cron job error:', error);
    return new Response('Internal server error', { status: 500 });
  }
};
