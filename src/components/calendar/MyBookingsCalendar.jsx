// components/MyBookingsCalendar.jsx
import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { userBookings, loading } from '~/stores/bookingStore';
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
  isToday,
  isBefore,
  startOfDay,
} from 'date-fns';

import { fetchUserBookings } from '~/stores/bookingStore';
// Helper function to format date
export default function MyBookingsCalendar() {
  const $userBookings = useStore(userBookings);
  const $loading = useStore(loading);
  const $user = useStore(user);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cancellingBookingId, setCancellingBookingId] = useState(null); // New state for cancelling booking

  // Helper functions
  const getBookingsForDate = (date) => {
    const formatted = format(date, 'yyyy-MM-dd');
    const bookings = $userBookings.filter((b) => b.date === formatted);

    // Categorize bookings as past or upcoming
    const today = startOfDay(new Date());
    const bookingDate = startOfDay(date);
    const isPastDate = isBefore(bookingDate, today);

    return bookings.map((booking) => ({
      ...booking,
      isPast: isPastDate,
    }));
  };

  const handleDayClick = (clickedDate) => {
    const bookings = getBookingsForDate(clickedDate);
    if (bookings.length > 0) {
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

  // Render functions
  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <button
        onClick={() => navigateMonth('prev')}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={$loading}
      >
        &#8249;
      </button>
      <h2 className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
      <button
        onClick={() => navigateMonth('next')}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={$loading}
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
    const isDisabled = !isSameMonth(date, currentMonth);
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    const isCurrentDay = isToday(date);

    const dayBookings = getBookingsForDate(date);
    const hasBookings = dayBookings.length > 0;
    const hasUpcomingBookings = dayBookings.some((booking) => !booking.isPast);
    const hasOnlyPastBookings = hasBookings && !hasUpcomingBookings;

    const cellClasses = [
      'p-2 text-sm border h-24 relative transition-colors',
      isDisabled
        ? 'text-gray-400 bg-gray-50 dark:bg-gray-700 cursor-not-allowed'
        : hasBookings
          ? 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'
          : 'text-gray-300',
      isSelected && 'bg-blue-500 text-white',
      isCurrentDay && !isSelected && 'bg-blue-50 border-blue-300',
    ]
      .filter(Boolean)
      .join(' ');

    const maxDisplayItems = 2;

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
              {/* User bookings with blue styling for upcoming, gray for past */}
              {dayBookings.slice(0, maxDisplayItems).map((booking) => (
                <div
                  key={`booking-${booking.time}`}
                  className={
                    booking.isPast
                      ? 'bg-gray-100 text-gray-500 rounded px-1 py-0.5 text-[10px] truncate opacity-60 line-through'
                      : 'bg-blue-300 text-blue-800 rounded px-1 py-0.5 text-[10px] truncate' // Changed from green to blue
                  }
                >
                  {booking.time}
                  {booking.isPast && <span className="ml-1 text-[8px]">✓</span>}
                </div>
              ))}

              {/* More indicator */}
              {dayBookings.length > maxDisplayItems && (
                <div className={hasOnlyPastBookings ? 'text-gray-400 text-[9px]' : 'text-gray-600 text-[9px]'}>
                  +{dayBookings.length - maxDisplayItems} more
                </div>
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
    if (!selectedDate) return <></>; // to avoid React Invalid hook call warning

    const dayBookings = getBookingsForDate(selectedDate);

    async function handleCancel(booking) {
      try {
        const confirmed = window.confirm('Are you sure you want to cancel this session?');
        if (!confirmed) return;

        setCancellingBookingId(booking.id);
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

        // Call the API endpoint with FormData
        await fetch('/api/cancel-booking', {
          method: 'POST',
          body: formData, // No headers needed for FormData
        });
        if ($user?.email) {
          await fetchUserBookings($user.email);
        }
      } catch (err) {
        console.error('Failed to cancel booking:', err);
        alert(`Failed to cancel: ${err.message}`);
      } finally {
        setCancellingBookingId(null);
      }
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] shadow-2xl flex flex-col">
          {/* Fixed Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
            <h3 className="text-lg font-semibold">{format(selectedDate, 'EEEE, MMMM dd, yyyy')}</h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-xl">
              ×
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Your Training Sessions</h4>
              {dayBookings.length > 0 ? (
                <div className="space-y-3">
                  {dayBookings.map((booking) => (
                    <div
                      key={`modal-booking-${booking.time}`}
                      className={
                        booking.isPast
                          ? 'bg-gray-50 border border-gray-200 rounded-lg p-4 opacity-75'
                          : 'bg-blue-50 border border-blue-200 rounded-lg p-4' // Changed from green to blue
                      }
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div
                          className={
                            booking.isPast
                              ? 'text-lg font-semibold text-gray-500 line-through'
                              : 'text-lg font-semibold text-blue-800' // Changed from green to blue
                          }
                        >
                          {booking.time}
                          {booking.isPast && (
                            <span className="ml-2 text-sm text-gray-400 no-underline">(Completed)</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">60 minutes</div>
                      </div>

                      {booking.coach?.full_name && (
                        <div className={`text-sm mb-1 ${booking.isPast ? 'text-gray-500' : 'text-gray-700'}`}>
                          <span className="font-medium">Coach:</span> {booking.coach.full_name}
                        </div>
                      )}

                      {booking.training_type && (
                        <div className={`text-sm mb-1 ${booking.isPast ? 'text-gray-500' : 'text-gray-700'}`}>
                          <span className="font-medium">Type:</span> {booking.training_type}
                        </div>
                      )}

                      {booking.concern && (
                        <div className={`text-sm mb-1 ${booking.isPast ? 'text-gray-500' : 'text-gray-700'}`}>
                          <span className="font-medium">Health Concerns:</span> {booking.concern}
                        </div>
                      )}

                      {booking.note && (
                        <div className={`text-sm mb-2 ${booking.isPast ? 'text-gray-500' : 'text-gray-700'}`}>
                          <span className="font-medium">Notes:</span> {booking.note}
                        </div>
                      )}

                      {/* Cancel Button - only for upcoming sessions */}
                      <div className="flex justify-end mt-3">
                        {booking.isPast ? (
                          <span className="text-sm text-gray-400 px-3 py-1 bg-gray-100 rounded">✓ Completed</span>
                        ) : (
                          <button
                            onClick={() => handleCancel(booking)}
                            disabled={cancellingBookingId === booking.id}
                            className="text-sm bg-red-100 text-red-800 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded transition-colors"
                          >
                            {cancellingBookingId === booking.id ? 'Cancelling...' : 'Cancel Session'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No bookings for this date</p>
              )}
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="p-6 border-t border-gray-200 flex-shrink-0">
            <button
              onClick={closeModal}
              className="w-full bg-gray-600 text-white rounded px-4 py-2 hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderLegend = () => (
    <div className="flex items-center justify-end gap-4 text-xs text-gray-500 mb-4">
      <div className="flex items-center gap-1">
        <span className="w-3 h-3 rounded bg-blue-300 border border-blue-600"></span> {/* Changed from green to blue */}
        Upcoming Sessions
      </div>
      <div className="flex items-center gap-1">
        <span className="w-3 h-3 rounded bg-gray-100 border border-gray-400"></span>
        Past Sessions
      </div>
    </div>
  );

  return (
    <section className="max-w-4xl mx-auto p-6 border rounded-xl bg-white shadow dark:bg-gray-800">
      {renderLegend()}

      {$loading && (
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
          <div className="w-4 h-4 border border-gray-300 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading your bookings...</span>
        </div>
      )}

      {renderHeader()}
      {renderDaysHeader()}
      {renderCalendarGrid()}
      {showModal && renderModal()}
    </section>
  );
}
