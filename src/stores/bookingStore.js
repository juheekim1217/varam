import { atom } from 'nanostores';
import { supabase } from '~/lib/supabaseClient';

// ─────────── Atoms ───────────
export const user = atom(null); // { id, email, fullName, role }
export const bookings = atom([]); // List of bookings for the user
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
      bookings.set([]);
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

// ─────────── Fetch Bookings ───────────
export const fetchBookings = async () => {
  try {
    loading.set(true);
    error.set('');

    const currentUser = user.get();
    if (!currentUser) {
      error.set('No user session found.');
      bookings.set([]);
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
      bookings.set([]);
    } else {
      bookings.set(bookingData || []);
      bookingsCount.set(bookingData?.length || 0);
    }
  } catch (err) {
    error.set('Failed to fetch bookings: ' + err.message);
    bookings.set([]);
  } finally {
    loading.set(false);
  }
};

// ─────────── Add Booking ───────────
export const addBooking = async ({ name, email, date, time }) => {
  const { error } = await supabase.from('bookings').insert([{ name, email, date, time }]);

  if (error) {
    throw new Error(error.message);
  }

  // ✅ Re-fetch to get updated list from DB
  //await fetchBookings(); // Trigger fetches explicitly from the client, not automatically inside store actions.

  return { success: true };
};

// ─────────── Delete Booking ───────────
export const deleteBooking = async (id) => {
  try {
    const { error: deleteError } = await supabase.from('bookings').delete().eq('id', id);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    // ✅ Re-fetch to get updated list from DB
    //await fetchBookings(); // Trigger fetches explicitly from the client, not automatically inside store actions.

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// ─────────── Initialize ───────────
let initialized = false;
if (!initialized && typeof window !== 'undefined') {
  fetchUser().then(fetchBookings); // Fetch user first, then bookings
  initialized = true;
}

// ─────────── Auth Change Listener ───────────
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN') {
      fetchUser().then(fetchBookings);
    } else if (event === 'SIGNED_OUT') {
      user.set(null);
      bookings.set([]);
      bookingsCount.set(0);
      error.set('');
      loading.set(false);
    }
  });
}
