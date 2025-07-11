// components/BookingCalendar.jsx
import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { futureBookings, futureBookingsLoading } from '~/stores/bookingStore';
import { user } from '~/stores/authStore';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
} from 'date-fns';

export default function BookingCalendar() {
  const $user = useStore(user);
  const $futureBookings = useStore(futureBookings);
  const $loading = useStore(futureBookingsLoading);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  //   const getBookingsForDate = (date) => {
  //     const formatted = format(date, 'yyyy-MM-dd');
  //     return $futureBookings.filter((b) => b.date === formatted).map((b) => b.time);
  //   };

  const getFutureBookingsForDate = (date) => {
    const formatted = format(date, 'yyyy-MM-dd');
    const bookings = $futureBookings.filter((b) => b.date === formatted);
    const userBookings = bookings.filter((b) => b.email === $user?.email).map((b) => b.time);
    const otherBookings = bookings.filter((b) => b.email !== $user?.email).map((b) => b.time);
    return { userBookings, otherBookings };
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <button
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        disabled={$loading}
      >
        &lt;
      </button>
      <h2 className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
      <button
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        disabled={$loading}
      >
        &gt;
      </button>
    </div>
  );

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 text-center text-sm font-medium border-b">
        {days.map((day) => (
          <div key={day} className="p-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formatted = format(day, 'd');
        const isDisabled = !isSameMonth(day, monthStart);
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        //const dayBookings = getBookingsForDate(day);
        const { userBookings, otherBookings } = getFutureBookingsForDate(day);

        days.push(
          <div
            key={day.toString()}
            className={`p-2 text-sm border h-24 relative cursor-pointer transition-colors ${
              isDisabled ? 'text-gray-400 bg-gray-50 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            } ${isSelected ? 'bg-blue-500 text-white' : ''}`}
            onClick={() => !isDisabled && setSelectedDate(day)}
          >
            <div className="absolute top-1 left-1 font-medium">{formatted}</div>
            <div className="text-[12px] mt-4 space-y-0.5">
              {$loading ? (
                <div className="flex items-center justify-center h-8">
                  <div className="w-3 h-3 border border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  {/* {dayBookings.slice(0, 3).map((time) => (
                    <div key={time} className="bg-green-100 text-green-800 rounded px-1 leading-none py-0.5">
                      {time}
                    </div>
                  ))}
                  {dayBookings.length > 3 && (
                    <div className="text-gray-600 text-[10px]">+{dayBookings.length - 3} more</div>
                  )} */}

                  {userBookings.slice(0, 2).map((time) => (
                    <div
                      key={'user-' + time}
                      className="bg-teal-300 text-teal-800 rounded px-1 leading-none py-0.5 font-semibold"
                    >
                      {time}
                    </div>
                  ))}
                  {otherBookings.slice(0, 2 - userBookings.length).map((time) => (
                    <div key={time} className="bg-indigo-50 text-gray-600 rounded px-1 leading-none py-0.5">
                      {time}
                    </div>
                  ))}
                  {userBookings.length + otherBookings.length > 3 && (
                    <div className="text-gray-600 text-[10px]">
                      +{userBookings.length + otherBookings.length - 3} more
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }

    return <div>{rows}</div>;
  };

  return (
    <section className="max-w-3xl mx-auto p-6 border rounded-xl bg-white shadow dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        {/* <h2 className="text-l font-semibold text-gray-600 dark:text-gray-300">My Training Schedule</h2> */}
        {$loading && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-4 h-4 border border-gray-300 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading...</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-end gap-4 text-xs text-gray-500 mb-2">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-teal-300 border border-teal-800"></span>
          Your Booking
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-indigo-50 border border-gray-600 "></span>
          Other Booking
        </div>
      </div>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </section>
  );
}
