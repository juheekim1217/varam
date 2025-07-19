import { atom } from 'nanostores';
import { supabase } from '~/lib/supabaseClient';

// Types for type safety
interface Booking {
  id: string;
  name: string;
  date: string;
  time: string;
  training_type?: string;
  coach?: {
    full_name: string;
  };
  coach_id: string;
  concern?: string;
  note?: string;
  created_at?: string;
  email: string;
}

// Atoms with proper typing
export const futureBookings = atom<Booking[]>([]);
export const futureBookingsLoading = atom(false);
export const allBookings = atom<Booking[]>([]); // Added allBookings
export const allBookingsLoading = atom(false); // Added allBookingsLoading
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

// Fetch all bookings (including past ones)
export const fetchAllBookings = async () => {
  try {
    allBookingsLoading.set(true);
    error.set('');

    const { data, error: fetchError } = await supabase
      .from('bookings')
      .select(
        `
        *,
        coach:coach_id (
          id,
          full_name
        )
      `
      )
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (fetchError) throw fetchError;
    allBookings.set(data || []);
    return { success: true, data };
  } catch (err) {
    const errorMessage = `Failed to fetch all bookings: ${(err as Error).message}`;
    error.set(errorMessage);
    allBookings.set([]);
    return { success: false, error: errorMessage };
  } finally {
    allBookingsLoading.set(false);
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

// Fetch all user bookings (including past ones)
export const fetchAllUserBookings = async (userEmail: string) => {
  if (!userEmail) {
    error.set('No user email provided');
    return { success: false, error: 'No user email provided' };
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
    return { success: true, data: bookingData };
  } catch (err) {
    const errorMessage = `Failed to fetch all user bookings: ${(err as Error).message}`;
    error.set(errorMessage);
    userBookings.set([]);
    return { success: false, error: errorMessage };
  } finally {
    loading.set(false);
  }
};

// Fetch bookings by coach ID (for coaches to see their sessions)
export const fetchCoachBookings = async (coachId: string) => {
  if (!coachId) {
    error.set('No coach ID provided');
    return { success: false, error: 'No coach ID provided' };
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
      .eq('coach_id', coachId)
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (fetchError) throw fetchError;
    return { success: true, data: bookingData };
  } catch (err) {
    const errorMessage = `Failed to fetch coach bookings: ${(err as Error).message}`;
    error.set(errorMessage);
    return { success: false, error: errorMessage };
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

// Utility function to refresh all booking stores
export const refreshAllBookings = async () => {
  await Promise.all([fetchAllBookings(), fetchFutureBookings()]);
};
