import { useState, useMemo, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { userBookings, loading, error, deleteBooking, fetchUserBookings } from '~/stores/bookingStore';
import { user } from '~/stores/authStore';

const LoadingSpinner = () => (
  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-2" />
);

export default function MyBookings() {
  // 1. Hooks first - maintain consistent order
  const $user = useStore(user);
  const $userBookings = useStore(userBookings);
  const $loading = useStore(loading);
  const $error = useStore(error);
  const [cancelingId, setCancelingId] = useState(null);

  // 2. useMemo hooks
  const sortedBookings = useMemo(() => {
    return [...($userBookings || [])].sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      return dateCompare !== 0 ? dateCompare : a.time.localeCompare(b.time);
    });
  }, [$userBookings]);

  const formattedBookings = useMemo(
    () =>
      sortedBookings.map((booking) => ({
        ...booking,
        formattedDate:
          booking.created_at?.toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
          }) || null,
      })),
    [sortedBookings]
  );

  // 3. useEffect hooks
  useEffect(() => {
    if ($user?.email) {
      fetchUserBookings($user.email);
    }
  }, [$user]);

  // 4. Event handlers
  async function handleCancel(booking) {
    try {
      const confirmed = window.confirm('Are you sure you want to cancel this session?');
      if (!confirmed) return;

      setCancelingId(booking.id);
      // const result = await deleteBooking(booking.id);

      // Create FormData instead of JSON
      const formData = new FormData();
      formData.append('bookingId', booking.id);
      formData.append('name', booking.name || '');
      formData.append('email', booking.email || '');
      formData.append('date', booking.date || '');
      formData.append('time', booking.time || '');
      formData.append('coach_name', booking.coach?.full_name || '');
      formData.append('training_type', booking.training_type || '');
      console.log(booking);
      console.log(booking.coach?.full_name, booking.training_type);
      // Call the API endpoint with FormData
      const response = await fetch('/api/cancel-booking', {
        method: 'POST',
        body: formData, // No headers needed for FormData
      });

      // if (!response.success) {
      //   throw new Error(response.error);
      // }

      if ($user?.email) {
        await fetchUserBookings($user.email);
      }
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      alert(`Failed to cancel: ${err.message}`);
    } finally {
      setCancelingId(null);
    }
  }

  // 5. Early returns
  if (!$user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">Please sign in to view your bookings.</p>
      </div>
    );
  }

  if ($loading) {
    return (
      <div className="text-center py-8">
        <LoadingSpinner />
        <p>Loading your bookings...</p>
      </div>
    );
  }

  if ($error) {
    return <p className="text-red-500 text-center">❌ {$error}</p>;
  }

  if (!sortedBookings.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400 mb-4">No sessions booked yet.</p>
        <p className="text-sm text-gray-500">Book your first session to get started!</p>
      </div>
    );
  }

  // 6. Main render
  return (
    <div className="space-y-4 text-sm text-gray-800 dark:text-gray-200">
      {formattedBookings.map((booking) => {
        return (
          <div
            key={booking.id}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">Date:</span> {booking.date}
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">Time:</span> {booking.time}
              </div>
              <div className=" text-gray-600 dark:text-gray-300">
                <span className="font-medium">Training Type:</span> {booking.training_type || '–'}
              </div>
              <div className=" text-gray-600 dark:text-gray-300">
                <span className="font-medium">Coach:</span> {booking.coach?.full_name || '–'}
              </div>
              {booking.concern && (
                <div className="col-span-2 text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Concern:</span> {booking.concern}
                </div>
              )}
              {booking.note && (
                <div className="col-span-2 text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Note:</span> {booking.note}
                </div>
              )}
            </div>
            {booking.formattedDate && (
              <div className=" text-gray-400 text-[0.6rem] mt-2">
                Booking created at {booking.formattedDate} by {booking.email}
              </div>
            )}
            <div className="mt-4">
              <button
                onClick={() => handleCancel(booking)}
                disabled={cancelingId === booking.id}
                className="px-4 py-1.5 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {cancelingId === booking.id ? (
                  <span className="flex items-center justify-center">
                    <LoadingSpinner />
                    Cancelling...
                  </span>
                ) : (
                  'Cancel'
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
