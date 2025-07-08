import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { fetchFutureBookings, futureBookingsLoading, fetchUser, loading } from '~/stores/bookingStore';
import BookSessionComponent from '~/components/account/BookSession.jsx';
import FutureBookingsCalendarComponent from '~/components/calendar/FutureBookingsCalendar.jsx';

export default function AdminBookingWrapper() {
  const $futureBookingsLoading = useStore(futureBookingsLoading);
  const $loading = useStore(loading);

  useEffect(() => {
    fetchFutureBookings();
    fetchUser();
  }, []);

  if ($futureBookingsLoading || $loading) {
    return <div className="text-center py-12 text-gray-600 dark:text-gray-300">Loading bookings...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="order-1 lg:order-1">
        <div className="rounded-xl bg-slate-100 shadow p-4 dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">✏️ Book Your Training Session</h2>
          <BookSessionComponent client:load />
        </div>
      </div>

      <div className="order-2 lg:order-2">
        <div className="rounded-xl bg-slate-100 shadow p-4 dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">📅 All Bookings</h2>
          <FutureBookingsCalendarComponent client:load />
        </div>
      </div>
    </div>
  );
}
