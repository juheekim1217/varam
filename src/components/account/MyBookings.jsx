import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { userBookings, loading, error, deleteBooking, fetchUserBookings } from '~/stores/bookingStore';

export default function MyBookings() {
  const $userBookings = useStore(userBookings);
  const $loading = useStore(loading);
  const $error = useStore(error);
  const [cancelingId, setCancelingId] = useState(null);

  async function handleCancel(id) {
    const confirmed = window.confirm('Are you sure you want to cancel this session?');
    if (!confirmed) return;

    setCancelingId(id);
    const result = await deleteBooking(id);
    if (!result.success) {
      alert(`Failed to cancel: ${result.error}`);
    } else {
      await fetchUserBookings();
    }
    setCancelingId(null);
  }

  if ($loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-500">Loading your sessions...</span>
        </div>
      </div>
    );
  }

  if ($error) {
    return <p className="text-red-500 text-center">❌ {$error}</p>;
  }

  if (!$userBookings.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400 mb-4">No sessions booked yet.</p>
        <p className="text-sm text-gray-500">Book your first session to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-sm text-gray-800 dark:text-gray-200">
      {$userBookings.map((booking) => {
        const createdAt = booking.created_at
          ? new Date(booking.created_at).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short',
            })
          : null;

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
            {createdAt && (
              <div className=" text-gray-400 text-[0.6rem] mt-2">
                Booking created at {createdAt} by {booking.email}
              </div>
            )}
            <div className="mt-4">
              <button
                onClick={() => handleCancel(booking.id)}
                disabled={cancelingId === booking.id}
                className="px-4 py-1.5 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {cancelingId === booking.id ? (
                  <span className="flex items-center justify-center">
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-2"></div>
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
