import type { APIRoute } from 'astro';
import { supabase } from '~/lib/supabaseClient';
import { sendEarlyBookingReminder } from '~/services/emailService';

export const GET: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${import.meta.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    // Only get bookings between 6:00 AM and 8:00 AM for early reminder
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('date', todayString)
      .eq('reminder_sent', false)
      .gte('time', '06:00') // From 6:00 AM
      .lt('time', '09:00'); // Before 9:00 AM

    if (error) {
      console.error('Error fetching early bookings:', error);
      return new Response('Error fetching bookings', { status: 500 });
    }

    if (!bookings || bookings.length === 0) {
      return new Response('No early bookings to remind', { status: 200 });
    }

    // Send early reminder emails with different message
    type ReminderResult = { bookingId: number; status: string; error?: string };
    const results: ReminderResult[] = [];
    for (const booking of bookings) {
      try {
        await sendEarlyBookingReminder({
          bookingId: booking.id,
          name: booking.name,
          email: booking.email,
          date: booking.date,
          time: booking.time,
          coach_name: booking.coach_name,
          training_type: booking.training_type,
          adminEmail: import.meta.env.ADMIN_EMAIL,
        });

        await supabase.from('bookings').update({ reminder_sent: true }).eq('id', booking.id);

        results.push({ bookingId: booking.id, status: 'sent' });
      } catch (error) {
        // Fixed: Use structured logging instead of string interpolation
        console.error('Error sending early reminder for booking:', {
          bookingId: booking.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        results.push({
          bookingId: booking.id,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Early morning reminders sent',
        results,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Early reminder cron error:', error);
    return new Response('Internal server error', { status: 500 });
  }
};
