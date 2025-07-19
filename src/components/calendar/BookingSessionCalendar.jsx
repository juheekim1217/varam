// components/BookingSessionCalendar.jsx

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
  isBefore,
  isToday,
} from 'date-fns';
import {
  minDateToBook,
  maxDateToBook,
  maxMonthToBook,
  minMonthToBook,
  getAvailableSlotsForDate,
} from '~/constants/bookingTimes';

export default function BookingSessionCalendar() {
  const $user = useStore(user);
  const $futureBookings = useStore(futureBookings);
  const $loading = useStore(futureBookingsLoading);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Helper functions
  const getBookingsForDate = (date) => {
    const formatted = format(date, 'yyyy-MM-dd');
    const bookings = $futureBookings.filter((b) => b.date === formatted);
    const userBookings = bookings.filter((b) => b.email === $user?.email).map((b) => b.time);
    const otherBookings = bookings.filter((b) => b.email !== $user?.email).map((b) => b.time);
    return { userBookings, otherBookings };
  };

  const getAvailableSlots = (date) => {
    const { userBookings, otherBookings } = getBookingsForDate(date);
    const availableForDay = getAvailableSlotsForDate(date);
    const allBookings = [...userBookings, ...otherBookings];
    return availableForDay.filter((slot) => !allBookings.includes(slot));
  };

  const isDayDisabled = (date) => {
    const isOutOfRange = isBefore(date, minDateToBook) || !isSameMonth(date, currentMonth);
    const isAfterMaxDate = date > maxDateToBook; // Add this check
    const hasNoAvailableSlots = getAvailableSlotsForDate(date).length === 0;
    return isOutOfRange || isAfterMaxDate || hasNoAvailableSlots;
  };

  const handleDayClick = (clickedDate) => {
    if (!isDayDisabled(clickedDate)) {
      setSelectedDate(clickedDate);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDate(null);
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      setCurrentMonth(subMonths(currentMonth, 1));
    } else {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  };

  const canNavigatePrev = () => {
    return !isBefore(currentMonth, addMonths(minMonthToBook, 1)) && !$loading;
  };

  const canNavigateNext = () => {
    return !isBefore(maxMonthToBook, addMonths(currentMonth, 1)) && !$loading;
  };

  // Render functions
  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <button
        onClick={() => navigateMonth('prev')}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!canNavigatePrev()}
      >
        &#8249;
      </button>
      <h2 className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
      <button
        onClick={() => navigateMonth('next')}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!canNavigateNext()}
      >
        &#8250;
      </button>
    </div>
  );

  const renderDaysHeader = () => {
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

  const renderDayCell = (date) => {
    const dayNumber = format(date, 'd');
    const isDisabled = isDayDisabled(date);
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    const isCurrentDay = isToday(date);

    const { userBookings, otherBookings } = getBookingsForDate(date);
    const availableSlots = !isDisabled ? getAvailableSlots(date) : [];

    const cellClasses = [
      'p-2 text-sm border h-24 relative transition-colors',
      isDisabled
        ? 'text-gray-400 bg-gray-50 dark:bg-gray-700 cursor-not-allowed'
        : 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer',
      isSelected && 'bg-blue-500 text-white',
      isCurrentDay && !isSelected && 'bg-blue-50 border-blue-300',
    ]
      .filter(Boolean)
      .join(' ');

    const totalDisplayedItems = userBookings.length + otherBookings.length;
    const maxDisplayItems = 2;
    const moreIndicatorCount = totalDisplayedItems + (availableSlots.length > 0 ? 1 : 0) - maxDisplayItems;
    return (
      <div key={date.toISOString()} className={cellClasses} onClick={() => handleDayClick(date)}>
        <div className="absolute top-1 left-1 font-medium">{dayNumber}</div>

        <div className="text-[11px] mt-4 space-y-0.5 overflow-hidden">
          {$loading ? (
            <div className="flex items-center justify-center h-8">
              <div className="w-3 h-3 border border-gray-300 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* User bookings */}
              {!isDisabled &&
                userBookings.slice(0, maxDisplayItems).map((time) => (
                  <div
                    key={`user-${time}`}
                    className="bg-blue-300 text-blue-800 rounded px-1 py-0.5 text-[10px] truncate"
                  >
                    {time}
                  </div>
                ))}

              {/* Unavailable */}
              {!isDisabled &&
                otherBookings.slice(0, Math.max(0, maxDisplayItems - userBookings.length)).map((time) => (
                  <div
                    key={`other-${time}`}
                    className="bg-gray-100 text-gray-700 rounded px-1 py-0.5 text-[10px] truncate"
                  >
                    {time}
                  </div>
                ))}

              {/* Available slots indicator */}
              {!isDisabled && availableSlots.length > 0 && totalDisplayedItems < maxDisplayItems && (
                <div className="bg-green-100 text-green-800 rounded px-1 py-0.5 text-[10px]">
                  {availableSlots.length} available
                </div>
              )}

              {/* More indicator */}
              {!isDisabled && moreIndicatorCount > 0 && (
                <div className="text-gray-600 text-[9px]">+{moreIndicatorCount} more</div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  const renderCalendarGrid = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      const week = [];

      for (let i = 0; i < 7; i++) {
        week.push(renderDayCell(currentDate));
        currentDate = addDays(currentDate, 1);
      }

      rows.push(
        <div key={currentDate.toISOString()} className="grid grid-cols-7">
          {week}
        </div>
      );
    }

    return <div>{rows}</div>;
  };

  const renderModal = () => {
    if (!selectedDate) return null;

    const { userBookings, otherBookings } = getBookingsForDate(selectedDate);
    const availableSlots = getAvailableSlots(selectedDate);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{format(selectedDate, 'EEEE, MMMM dd, yyyy')}</h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-xl">
              ×
            </button>
          </div>

          {/* Your Bookings */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Your Bookings</h4>
            {userBookings.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {userBookings.map((time) => (
                  <div key={`modal-user-${time}`} className="bg-blue-100 text-blue-800 rounded px-3 py-2 text-sm">
                    {time}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No bookings for this date</p>
            )}
          </div>

          {/* Unavailable */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Unavailable</h4>
            {otherBookings.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {otherBookings.map((time) => (
                  <div key={`modal-other-${time}`} className="bg-gray-100 text-gray-700 rounded px-3 py-2 text-sm">
                    {time}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No Unavailable</p>
            )}
          </div>

          {/* Available Slots */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">Available Slots</h4>
            {availableSlots.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {availableSlots.map((slot) => (
                  <div
                    key={`modal-available-${slot}`}
                    className="bg-green-100 text-green-800 rounded px-3 py-2 text-sm text-center hover:bg-green-200 cursor-pointer transition-colors"
                  >
                    {slot}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No available slots</p>
            )}
          </div>

          <button
            onClick={closeModal}
            className="w-full bg-gray-600 text-white rounded px-4 py-2 hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  const renderLegend = () => (
    <div className="flex items-center justify-end gap-4 text-xs text-gray-500 mb-4">
      <div className="flex items-center gap-1">
        <span className="w-3 h-3 rounded bg-green-100 border border-green-600"></span>
        Available
      </div>
      <div className="flex items-center gap-1">
        <span className="w-3 h-3 rounded bg-blue-300 border border-blue-600"></span>
        Your Booking
      </div>
      <div className="flex items-center gap-1">
        <span className="w-3 h-3 rounded bg-gray-100 border border-gray-600"></span>
        Unavailable
      </div>
    </div>
  );

  return (
    <section className="max-w-4xl mx-auto p-6 border rounded-xl bg-white shadow dark:bg-gray-800">
      {renderLegend()}

      {$loading && (
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
          <div className="w-4 h-4 border border-gray-300 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading bookings...</span>
        </div>
      )}

      {renderHeader()}
      {renderDaysHeader()}
      {renderCalendarGrid()}
      {showModal && renderModal()}
    </section>
  );
}
