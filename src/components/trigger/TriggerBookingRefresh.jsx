// src/components/TriggerBookingRefresh.jsx
import { useEffect } from 'react';
import { fetchBookings } from '~/stores/bookingStore';

export default function TriggerBookingRefresh() {
  useEffect(() => {
    fetchBookings();
  }, []);

  return null;
}
