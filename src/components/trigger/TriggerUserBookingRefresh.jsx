// src/components/TriggerUserBookingRefresh.jsx
import { useEffect } from 'react';
import { fetchUserBookings } from '~/stores/bookingStore';

export default function TriggerUserBookingRefresh() {
  useEffect(() => {
    fetchUserBookings();
  }, []);

  return <></>;
}
