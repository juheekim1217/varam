// src/components/dashboard/DashboardWrapper.jsx
import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { fetchUser, fetchFutureBookings, futureBookingsLoading, loading as userLoading } from '~/stores/bookingStore';

import UserInfo from '~/components/account/UserInfo.jsx';
import BookingCalendar from '~/components/calendar/BookingsCalendar';
import CoachInfo from '~/components/account/CoachInfo';
import CoachesInfo from '~/components/account/CoachesInfo';

export default function DashboardWrapper() {
  const $isFutureLoading = useStore(futureBookingsLoading);
  const $isUserLoading = useStore(userLoading);

  useEffect(() => {
    fetchUser().then(fetchFutureBookings);
  }, []);

  if ($isFutureLoading || $isUserLoading) {
    return (
      <div className="text-center py-16 text-gray-600 dark:text-gray-300">
        <div className="flex items-center justify-center space-x-2 text-sm">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-100 dark:bg-gray-900  dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">🧑 Account</h2>
          <UserInfo client:only="react" />
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">📌 Tips</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>✅ Only future sessions appear in the calendar.</li>
              <li>📆 Click a date to view available time slots.</li>
              <li>🗑️ Cancel or reschedule from the session list.</li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-100 dark:bg-gray-900 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">🎓 Coach Profile</h2>
          <CoachInfo client:only="react" />
        </div>
      </div>

      <div className="mb-8 bg-slate-100 dark:bg-gray-900 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">👥 All Coaches</h2>
        <CoachesInfo client:only="react" />
      </div>

      <div className="mb-8 bg-slate-100 dark:bg-gray-900 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">📅 Upcoming Bookings</h2>
        <BookingCalendar client:only="react" />
      </div>
    </>
  );
}
