import { atom } from 'nanostores';
import { supabase } from '~/lib/supabaseClient';

// Types for type safety
interface Booking {
  id: string;
  date: string;
  time: string;
  training_type?: string;
  coach?: {
    full_name: string;
  };
  concern?: string;
  note?: string;
  created_at?: string;
  email: string;
}

// Atoms with proper typing
export const futureBookings = atom<Booking[]>([]);
export const futureBookingsLoading = atom(false);
export const userBookings = atom<Booking[]>([]);
export const loading = atom(false);
export const error = atom('');
export const bookingsCount = atom(0);

// Fetch future bookings
export const fetchFutureBookings = async () => {
  try {
    futureBookingsLoading.set(true);
    error.set('');

    const today = new Date().toISOString().split('T')[0];
    const { data, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .gte('date', today)
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (fetchError) throw fetchError;
    futureBookings.set(data || []);
  } catch (err) {
    error.set(`Failed to fetch future bookings: ${(err as Error).message}`);
    futureBookings.set([]);
  } finally {
    futureBookingsLoading.set(false);
  }
};

// Fetch user bookings
export const fetchUserBookings = async (userEmail: string) => {
  if (!userEmail) {
    error.set('No user email provided');
    return;
  }

  try {
    loading.set(true);
    error.set('');

    const { data: bookingData, error: fetchError } = await supabase
      .from('bookings')
      .select(
        `
        *,
        coach:coach_id (full_name)
      `
      )
      .eq('email', userEmail)
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (fetchError) throw fetchError;
    userBookings.set(bookingData || []);
    bookingsCount.set(bookingData?.length || 0);
  } catch (err) {
    error.set(`Failed to fetch bookings: ${(err as Error).message}`);
    userBookings.set([]);
  } finally {
    loading.set(false);
  }
};

// Add booking with type safety
export const addBooking = async (booking: Omit<Booking, 'id'>) => {
  try {
    const { data: existing, error: checkError } = await supabase
      .from('bookings')
      .select('id')
      .eq('date', booking.date)
      .eq('time', booking.time)
      .maybeSingle();

    if (checkError) throw new Error(`Failed to check existing bookings: ${checkError.message}`);
    if (existing) {
      return {
        success: false,
        error: 'This time slot is already booked. Please choose another.',
        status: 409,
      };
    }

    const { error: insertError } = await supabase.from('bookings').insert([booking]);

    if (insertError) throw new Error(`Failed to create booking: ${insertError.message}`);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message || 'Unknown error occurred while booking.',
      status: 500,
    };
  }
};

// Delete booking
export const deleteBooking = async (id: string) => {
  try {
    const { error: deleteError } = await supabase.from('bookings').delete().eq('id', id);

    if (deleteError) throw new Error(deleteError.message);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message,
    };
  }
};
