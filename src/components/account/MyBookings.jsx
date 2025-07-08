// components/MyBookings.jsx
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
      await fetchUserBookings(); // manually refresh bookings list
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
      {$userBookings.map((booking) => (
        <div key={booking.id} className="border p-4 rounded-xl shadow-sm bg-white dark:bg-gray-800">
          <p>
            <strong>Name:</strong> {booking.name}
          </p>
          <p>
            <strong>Email:</strong> {booking.email}
          </p>
          <p>
            <strong>Date:</strong> {booking.date}
          </p>
          <p>
            <strong>Time:</strong> {booking.time}
          </p>
          <button
            onClick={() => handleCancel(booking.id)}
            disabled={cancelingId === booking.id}
            className="mt-2 px-3 py-1.5 text-sm text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {cancelingId === booking.id ? (
              <span className="flex items-center">
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Cancelling...
              </span>
            ) : (
              'Cancel'
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
