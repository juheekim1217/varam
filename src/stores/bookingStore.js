import { atom } from 'nanostores';
import { supabase } from '~/lib/supabaseClient';

// ─────────── Atoms ───────────
export const user = atom(null); // { id, email, fullName, role }
export const futureBookings = atom([]);
export const futureBookingsLoading = atom(false);
export const userBookings = atom([]); // List of bookings for the user
export const loading = atom(false); // Global loading state for booking-related operations
export const error = atom(''); // Holds error messages
export const bookingsCount = atom(0); // Derived: total number of bookings

// ─────────── Fetch User ───────────
export const fetchUser = async () => {
  try {
    loading.set(true);
    error.set('');

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    const currentUser = sessionData?.session?.user;

    if (sessionError || !currentUser) {
      user.set(null);
      userBookings.set([]);
      bookingsCount.set(0);
      error.set('Please sign in.');
      return;
    }

    const { data: userRow, error: userFetchError } = await supabase
      .from('users')
      .select('role')
      .eq('id', currentUser.id)
      .maybeSingle();

    if (userFetchError) {
      console.warn('Could not fetch user role:', userFetchError.message);
    }

    user.set({
      id: currentUser.id,
      email: currentUser.email,
      fullName: currentUser.user_metadata?.full_name || currentUser.email.split('@')[0],
      role: userRow?.role || null,
    });
  } catch (err) {
    error.set('Failed to fetch user: ' + err.message);
    user.set(null);
  } finally {
    loading.set(false);
  }
};

// ─────────── Fetch Future Bookings ───────────
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

    if (fetchError) {
      error.set(fetchError.message);
      futureBookings.set([]);
    } else {
      futureBookings.set(data || []);
    }
  } catch (err) {
    error.set('Failed to fetch future bookings: ' + err.message);
    futureBookings.set([]);
  } finally {
    futureBookingsLoading.set(false);
  }
};

// ─────────── Fetch User Bookings ───────────
export const fetchUserBookings = async () => {
  try {
    loading.set(true);
    error.set('');

    const currentUser = user.get();
    if (!currentUser) {
      error.set('No user session found.');
      userBookings.set([]);
      return;
    }

    const { data: bookingData, error: fetchError } = await supabase
      .from('bookings')
      .select('*') // Replace with '*' if full details are needed
      .eq('email', currentUser.email)
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (fetchError) {
      error.set(fetchError.message);
      userBookings.set([]);
    } else {
      userBookings.set(bookingData || []);
      bookingsCount.set(bookingData?.length || 0);
    }
  } catch (err) {
    error.set('Failed to fetch bookings: ' + err.message);
    userBookings.set([]);
  } finally {
    loading.set(false);
  }
};

// ─────────── Add Booking ───────────
export const addBooking = async ({ name, email, date, time }) => {
  try {
    // Check for existing booking at the same date and time
    const { data: existing, error: checkError } = await supabase
      .from('bookings')
      .select('id')
      .eq('date', date)
      .eq('time', time)
      .maybeSingle();

    if (checkError) {
      throw new Error('Failed to check existing bookings: ' + checkError.message);
    }

    if (existing) {
      return {
        success: false,
        error: 'This time slot is already booked. Please choose another.',
        status: 409, // Conflict
      };
    }

    // Proceed to insert new booking
    const { error: insertError } = await supabase.from('bookings').insert([{ name, email, date, time }]);

    if (insertError) {
      throw new Error('Failed to create booking: ' + insertError.message);
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Unknown error occurred while booking.',
      status: 500,
    };
  }
};

// ─────────── Delete Booking ───────────
export const deleteBooking = async (id) => {
  try {
    const { error: deleteError } = await supabase.from('bookings').delete().eq('id', id);
    if (deleteError) {
      throw new Error(deleteError.message);
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// ─────────── Initialize ───────────
let initialized = false;
if (!initialized && typeof window !== 'undefined') {
  fetchUser().then(fetchUserBookings); // Fetch user first, then bookings
  initialized = true;
}

// ─────────── Auth Change Listener ───────────
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN') {
      fetchUser().then(fetchUserBookings);
    } else if (event === 'SIGNED_OUT') {
      user.set(null);
      userBookings.set([]);
      bookingsCount.set(0);
      error.set('');
      loading.set(false);
    }
  });
}
