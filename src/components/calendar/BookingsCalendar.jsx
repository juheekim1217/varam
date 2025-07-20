// components/BookingCalendar.jsx
import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import {
  allBookings, // Changed from futureBookings
  allBookingsLoading, // Changed from futureBookingsLoading
  fetchAllBookings, // Changed from fetchFutureBookings
} from '~/stores/bookingStore';
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
} from 'date-fns';

export default function BookingCalendar() {
  const $user = useStore(user);
  const $allBookings = useStore(allBookings); // Changed
  const $loading = useStore(allBookingsLoading); // Changed
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cancellingBookingId, setCancellingBookingId] = useState(null);

  // Load all bookings when component mounts
  useEffect(() => {
    fetchAllBookings(); // Changed
  }, []);

  // Helper functions
  const getBookingsForDate = (date) => {
    const formatted = format(date, 'yyyy-MM-dd');
    const bookings = $allBookings.filter((b) => b.date === formatted); // Changed

    // For each booking, determine if it's in the past based on date AND time
    return bookings.map((booking) => {
      const bookingTime = booking.time || '00:00';
      const [hours, minutes] = bookingTime.split(':').map((num) => parseInt(num, 10));
      const bookingDateTime = new Date(booking.date);
      bookingDateTime.setHours(hours, minutes, 0, 0);

      const now = new Date();
      const isPast = isBefore(bookingDateTime, now);

      return {
        ...booking,
        isPast,
      };
    });
  };

  const handleDayClick = (date) => {
    // Create a new Date object to avoid any reference issues
    const clickedDate = new Date(date);
    setSelectedDate(clickedDate);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Render functions
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
        // Create a copy of the current day to avoid reference issues
        const currentDay = new Date(day);

        const formatted = format(currentDay, 'd');
        const isDisabled = !isSameMonth(currentDay, monthStart);
        const isSelected = selectedDate && isSameDay(currentDay, selectedDate);
        const isCurrentDay = isToday(currentDay);
        const dayBookings = getBookingsForDate(currentDay);

        // Only categorize by coaching sessions
        const yourCoachingSessions = dayBookings.filter((b) => b.coach_id === $user?.id);
        const otherCoachingSessions = dayBookings.filter((b) => b.coach_id !== $user?.id);

        days.push(
          <div
            key={currentDay.toString()}
            className={`p-2 text-sm border h-24 relative transition-colors ${
              isDisabled
                ? 'text-gray-400 bg-gray-50 dark:bg-gray-700 cursor-not-allowed'
                : dayBookings.length > 0
                  ? 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'
                  : 'text-gray-300'
            } ${isSelected ? 'bg-blue-500 text-white' : ''}
            ${isCurrentDay && !isSelected ? 'bg-blue-50 border-blue-300' : ''}`}
            onClick={() => !isDisabled && handleDayClick(currentDay)}
          >
            <div className="absolute top-1 left-1 font-medium">{formatted}</div>
            <div className="text-[11px] mt-4 space-y-0.5 overflow-hidden">
              {$loading ? (
                <div className="flex items-center justify-center h-8">
                  <div className="w-3 h-3 border border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  {/* Your upcoming coaching sessions */}
                  {yourCoachingSessions
                    .filter((booking) => !booking.isPast)
                    .slice(0, 2)
                    .map((booking) => (
                      <div
                        key={'your-coaching-' + booking.time}
                        className="bg-green-300 text-green-800 rounded px-1 py-0.5 text-[10px] truncate font-semibold"
                      >
                        {booking.time}
                      </div>
                    ))}

                  {/* Your past coaching sessions */}
                  {yourCoachingSessions
                    .filter((booking) => booking.isPast)
                    .slice(0, 2 - yourCoachingSessions.filter((b) => !b.isPast).length)
                    .map((booking) => (
                      <div
                        key={'past-your-coaching-' + booking.time}
                        className="bg-gray-100 text-gray-500 rounded px-1 py-0.5 text-[10px] truncate line-through opacity-60"
                      >
                        {booking.time}
                        <span className="ml-1 text-[8px] no-underline">✓</span>
                      </div>
                    ))}

                  {/* Other upcoming coaching sessions */}
                  {otherCoachingSessions
                    .filter((booking) => !booking.isPast)
                    .slice(0, 2 - Math.min(2, yourCoachingSessions.length))
                    .map((booking) => (
                      <div
                        key={'other-coaching-upcoming-' + booking.time}
                        className="bg-indigo-100 text-indigo-700 rounded px-1 py-0.5 text-[10px] truncate"
                      >
                        {booking.time}
                      </div>
                    ))}

                  {/* Other past coaching sessions */}
                  {otherCoachingSessions
                    .filter((booking) => booking.isPast)
                    .slice(
                      0,
                      2 -
                        Math.min(2, yourCoachingSessions.length + otherCoachingSessions.filter((b) => !b.isPast).length)
                    )
                    .map((booking) => (
                      <div
                        key={'other-coaching-past-' + booking.time}
                        className="bg-gray-100 text-gray-500 rounded px-1 py-0.5 text-[10px] truncate line-through opacity-60"
                      >
                        {booking.time}
                        <span className="ml-1 text-[8px] no-underline">✓</span>
                      </div>
                    ))}

                  {/* More indicator */}
                  {dayBookings.length > 2 && (
                    <div className="text-gray-600 text-[9px]">+{dayBookings.length - 2} more</div>
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

  // Modal for bookings detail and cancel
  const renderModal = () => {
    if (!selectedDate || !showModal) return <></>; // to avoid React Invalid hook call warning

    const dayBookings = getBookingsForDate(selectedDate);
    const yourCoachingSessions = dayBookings.filter((b) => b.coach_id === $user?.id);
    const otherCoachingSessions = dayBookings.filter((b) => b.coach_id !== $user?.id);

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
          await fetchAllBookings($user.email);
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
        <div className="bg-white rounded-lg w-full max-w-lg max-h-[85vh] shadow-2xl flex flex-col">
          {/* Fixed Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
            <h3 className="text-lg font-semibold">{format(selectedDate, 'EEEE, MMMM dd, yyyy')}</h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-xl">
              ×
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {yourCoachingSessions.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Your Coaching Sessions</h4>
                <div className="space-y-4">
                  {yourCoachingSessions.map((booking) => (
                    <div
                      key={`modal-your-coaching-${booking.id}`}
                      className={
                        booking.isPast
                          ? 'bg-gray-50 border border-gray-200 rounded-lg p-4 opacity-75'
                          : 'bg-green-50 border border-green-200 rounded-lg p-4'
                      }
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div
                          className={
                            booking.isPast
                              ? 'text-lg font-semibold text-gray-500 line-through'
                              : 'text-lg font-semibold text-green-800'
                          }
                        >
                          {booking.time}
                          {booking.isPast && (
                            <span className="ml-2 text-sm text-gray-400 no-underline">(Completed)</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">60 minutes</div>
                      </div>

                      {/* Booking Details Grid */}
                      <div className="grid grid-cols-1 gap-2 mb-3">
                        {/* Coach name */}
                        {booking.coach?.full_name && (
                          <div className={`text-sm ${booking.isPast ? 'text-gray-500' : 'text-gray-700'}`}>
                            <span className="font-medium">Coach:</span> {booking.coach?.full_name}
                          </div>
                        )}

                        {/* Client Information */}
                        <div className={`text-sm ${booking.isPast ? 'text-gray-500' : 'text-gray-700'}`}>
                          <span className="font-medium">Client Name:</span> {booking.name || 'Not provided'}
                        </div>

                        <div className={`text-sm ${booking.isPast ? 'text-gray-500' : 'text-gray-700'}`}>
                          <span className="font-medium">Client Email:</span> {booking.email || 'Not provided'}
                        </div>

                        {/* Training Type */}
                        {booking.training_type && (
                          <div className={`text-sm ${booking.isPast ? 'text-gray-500' : 'text-gray-700'}`}>
                            <span className="font-medium">Training Type:</span> {booking.training_type}
                          </div>
                        )}

                        {/* Health Concerns */}
                        {booking.concern && (
                          <div className={`text-sm ${booking.isPast ? 'text-gray-500' : 'text-gray-700'}`}>
                            <span className="font-medium">Health Concerns:</span> {booking.concern}
                          </div>
                        )}

                        {/* Notes */}
                        {booking.note && (
                          <div className={`text-sm ${booking.isPast ? 'text-gray-500' : 'text-gray-700'}`}>
                            <span className="font-medium">Notes:</span> {booking.note}
                          </div>
                        )}

                        {/* Booking ID */}
                        <div className={`text-xs ${booking.isPast ? 'text-gray-400' : 'text-gray-500'}`}>
                          <span className="font-medium">Booking ID:</span> {booking.id}
                        </div>

                        {/* Created Date */}
                        {booking.created_at && (
                          <div className={`text-xs ${booking.isPast ? 'text-gray-400' : 'text-gray-500'}`}>
                            <span className="font-medium">Booked on:</span>{' '}
                            {format(new Date(booking.created_at), 'PPp')}
                          </div>
                        )}
                      </div>

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
              </div>
            )}

            {otherCoachingSessions.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Other Coaches' Sessions</h4>
                <div className="space-y-4">
                  {otherCoachingSessions.map((booking) => (
                    <div
                      key={`modal-other-coaching-${booking.id}`}
                      className={
                        booking.isPast
                          ? 'bg-gray-50 border border-gray-200 rounded-lg p-4 opacity-75'
                          : 'bg-indigo-50 border border-indigo-200 rounded-lg p-4'
                      }
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div
                          className={
                            booking.isPast
                              ? 'text-lg font-semibold text-gray-500 line-through'
                              : 'text-lg font-semibold text-indigo-800'
                          }
                        >
                          {booking.time}
                          {booking.isPast && (
                            <span className="ml-2 text-sm text-gray-400 no-underline">(Completed)</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">60 minutes</div>
                      </div>

                      {/* Booking Details Grid */}
                      <div className="grid grid-cols-1 gap-2 mb-3">
                        {/* Coach Information */}
                        <div className={`text-sm ${booking.isPast ? 'text-gray-500' : 'text-gray-700'}`}>
                          <span className="font-medium">Coach:</span> {booking.coach?.full_name || 'Unknown Coach'}
                        </div>

                        {/* Coach ID */}
                        <div className={`text-xs ${booking.isPast ? 'text-gray-400' : 'text-gray-500'}`}>
                          <span className="font-medium">Coach ID:</span> {booking.coach_id || 'Not available'}
                        </div>

                        {/* Client Information */}
                        <div className={`text-sm ${booking.isPast ? 'text-gray-500' : 'text-gray-700'}`}>
                          <span className="font-medium">Client Name:</span> {booking.name || 'Not provided'}
                        </div>

                        <div className={`text-sm ${booking.isPast ? 'text-gray-500' : 'text-gray-700'}`}>
                          <span className="font-medium">Client Email:</span> {booking.email || 'Not provided'}
                        </div>

                        {/* Training Type */}
                        {booking.training_type && (
                          <div className={`text-sm ${booking.isPast ? 'text-gray-500' : 'text-gray-700'}`}>
                            <span className="font-medium">Training Type:</span> {booking.training_type}
                          </div>
                        )}

                        {/* Health Concerns */}
                        {booking.concern && (
                          <div className={`text-sm ${booking.isPast ? 'text-gray-500' : 'text-gray-700'}`}>
                            <span className="font-medium">Health Concerns:</span> {booking.concern}
                          </div>
                        )}

                        {/* Notes */}
                        {booking.note && (
                          <div className={`text-sm ${booking.isPast ? 'text-gray-500' : 'text-gray-700'}`}>
                            <span className="font-medium">Notes:</span> {booking.note}
                          </div>
                        )}

                        {/* Booking ID */}
                        <div className={`text-xs ${booking.isPast ? 'text-gray-400' : 'text-gray-500'}`}>
                          <span className="font-medium">Booking ID:</span> {booking.id}
                        </div>

                        {/* Created Date */}
                        {booking.created_at && (
                          <div className={`text-xs ${booking.isPast ? 'text-gray-400' : 'text-gray-500'}`}>
                            <span className="font-medium">Booked on:</span>{' '}
                            {format(new Date(booking.created_at), 'PPp')}
                          </div>
                        )}
                      </div>

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
              </div>
            )}

            {dayBookings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No coaching sessions scheduled for this date</p>
              </div>
            )}
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

  // Update the legend to reflect only coaching sessions
  const renderLegend = () => (
    <div className="flex items-center justify-end gap-4 text-xs text-gray-500 mb-2">
      <div className="flex items-center gap-1">
        <span className="w-3 h-3 rounded bg-green-300 border border-green-800"></span>
        Your Coaching Sessions
      </div>
      <div className="flex items-center gap-1">
        <span className="w-3 h-3 rounded bg-indigo-100 border border-indigo-700"></span>
        Other Coaches' Sessions
      </div>
      <div className="flex items-center gap-1">
        <span className="w-3 h-3 rounded bg-gray-100 border border-gray-400"></span>
        Past Sessions
      </div>
    </div>
  );

  return (
    <section className="max-w-3xl mx-auto p-6 border rounded-xl bg-white shadow dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Booking Calendar</h2>
        {$loading && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-4 h-4 border border-gray-300 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading...</span>
          </div>
        )}
      </div>
      {renderLegend()}
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {renderModal()}
    </section>
  );
}
