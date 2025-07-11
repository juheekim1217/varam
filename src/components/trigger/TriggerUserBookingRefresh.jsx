// src/components/TriggerUserBookingRefresh.jsx
import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { fetchUserBookings, loading } from '~/stores/bookingStore';

export default function TriggerUserBookingRefresh() {
  const $loading = useStore(loading);
  useEffect(() => {
    fetchUserBookings();
  }, []);

  if ($loading) {
    return <div className="text-center py-12 text-gray-600 dark:text-gray-300">Loading bookings...</div>;
  }

  return null; // This component does not render anything
}
