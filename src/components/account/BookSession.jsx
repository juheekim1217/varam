import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { futureBookings, futureBookingsLoading } from '~/stores/bookingStore';
import { coaches, coachesLoading, fetchCoaches } from '~/stores/coachStore';
import { user } from '~/stores/authStore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { minDateToBook, maxDateToBook, getAvailableSlotsForDate } from '~/constants/bookingTimes';

export default function BookingSession() {
  const $user = useStore(user);
  const $futureBookings = useStore(futureBookings);
  const $loading = useStore(futureBookingsLoading);
  const $coaches = useStore(coaches);
  const $coachesLoading = useStore(coachesLoading);

  const [date, setDate] = useState(null);
  const [time, setTime] = useState('');
  const [selectedCoach, setSelectedCoach] = useState('');
  const [selectedCoachName, setSelectedCoachName] = useState('');
  const [selectedTrainingType, setSelectedTrainingType] = useState('');
  const [bookedTimes, setBookedTimes] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadCoaches = async () => {
      try {
        await fetchCoaches();
      } catch (err) {
        if (mounted) {
          console.error('Failed to fetch coaches:', err);
          // Handle error appropriately in UI
        }
      }
    };

    loadCoaches();

    return () => {
      mounted = false;
    };
  }, []); // Empty deps array because fetchCoaches is stable

  // Helper functions
  const getAvailableTimesForDate = (selectedDate) => {
    if (!selectedDate) return [];

    const formattedDate = selectedDate.toISOString().split('T')[0];

    // Get booked times for this date
    const dayBookings = $futureBookings.filter((b) => b.date === formattedDate).map((b) => b.time);

    // Get available times for this day of week
    const availableForDay = getAvailableSlotsForDate(selectedDate);

    // Return available times that aren't booked
    return availableForDay.filter((slot) => !dayBookings.includes(slot));
  };

  const handleDateChange = (selectedDate) => {
    const formatted = selectedDate.toISOString().split('T')[0];
    const dayBookings = $futureBookings.filter((b) => b.date === formatted).map((b) => b.time);
    setBookedTimes(dayBookings);
    setDate(selectedDate);
    setTime(''); // Reset time when date changes
  };

  const isAvailableDate = (d) => {
    const today = new Date();
    const isFuture = d >= today.setHours(0, 0, 0, 0);

    // Check if date has any available slots
    const availableSlots = getAvailableSlotsForDate(d);
    const hasAvailableSlots = availableSlots.length > 0;

    return isFuture && hasAvailableSlots;
  };

  if ($loading) return <p className="text-center mt-10 text-gray-600">Loading Booking...</p>;
  if (!$user) return <p className="text-center mt-10 text-gray-600">Loading User...</p>;

  if ($user.role === 'guest') {
    return (
      <section className="max-w-xl mx-auto p-6 bg-white border rounded-xl shadow dark:bg-gray-800">
        <h2 className="text-xl font-bold mb-2">Book a Trial Session</h2>
        <p className="text-gray-600 mb-4 dark:text-gray-400">
          You're currently signed in as a guest. Enjoy a free trial session to experience our training firsthand before
          committing.
        </p>
        <a
          href="/forms/trial"
          className="inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-900 transition"
        >
          Go to Trial Page
        </a>
      </section>
    );
  }

  return (
    <section className="max-w-xl mx-auto p-6 bg-white border rounded-xl shadow space-y-6 dark:bg-gray-800">
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Booking as <strong>{$user.email}</strong>
      </p>

      <p className="text-sm text-gray-600 dark:text-gray-300">
        Each session lasts <strong>60 minutes</strong>, with a 30-minute break between sessions.
      </p>

      <form
        method="POST"
        action="/api/book-session"
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (!date || !time || submitting) return;

          const formattedDate = date.toISOString().split('T')[0];
          const isDuplicate = $futureBookings.some((b) => b.date === formattedDate && b.time === time);
          if (isDuplicate) {
            alert('This time slot is already booked. Please choose another.');
            return;
          }

          setSubmitting(true);
          e.target.submit();
        }}
      >
        <input type="hidden" name="email" value={$user.email} />
        <input type="hidden" name="name" value={$user.fullName} />
        <input type="hidden" name="phone" value={$user.phone} />

        {/* Coach Selection with data attribute approach */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label htmlFor="coach" className="text-sm font-medium text-gray-700 w-32 shrink-0 dark:text-gray-300">
            Select Coach
          </label>
          <select
            name="coach_id"
            required
            value={selectedCoach}
            onChange={(e) => {
              setSelectedCoach(e.target.value);
              // Get the coach name from the selected option
              const selectedOption = e.target.options[e.target.selectedIndex];
              const coachName = selectedOption.text;
              setSelectedCoachName(coachName);
            }}
            className="input w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
          >
            <option value="" disabled hidden>
              Select a coach
            </option>
            {$coaches.map((coach) => (
              <option key={coach.id} value={coach.id}>
                {coach.full_name}
              </option>
            ))}
            {!$coaches.length && !$coachesLoading && <option disabled>No coaches available</option>}
          </select>
        </div>

        {/* Hidden input for coach name */}
        <input type="hidden" name="coach_name" value={selectedCoachName} />

        {/* Date Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 z-1000">
          <label htmlFor="date" className="text-sm font-medium text-gray-700 w-32 shrink-0 dark:text-gray-300">
            Select Date
          </label>
          <DatePicker
            selected={date}
            onChange={handleDateChange}
            filterDate={isAvailableDate}
            minDate={minDateToBook}
            maxDate={maxDateToBook}
            placeholderText="Select a date"
            name="date"
            required
            className="input w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
          />
        </div>

        {/* Time Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label htmlFor="time" className="text-sm font-medium text-gray-700 w-32 shrink-0 dark:text-gray-300">
            Select Time
          </label>
          <select
            name="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="input w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
          >
            <option value="" disabled hidden>
              Select a time
            </option>
            {date &&
              getAvailableSlotsForDate(date).map((slot) => {
                const isReserved = bookedTimes.includes(slot);

                return (
                  <option key={slot} value={slot} disabled={isReserved}>
                    {slot} {isReserved ? '(Unavailable)' : ''}
                  </option>
                );
              })}
            {!date && <option disabled>Please select a date first</option>}
          </select>
        </div>

        {/* Training Type Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label htmlFor="training_type" className="text-sm font-medium text-gray-700 w-32 shrink-0 dark:text-gray-300">
            Select Training Type
          </label>
          <select
            name="training_type"
            required
            value={selectedTrainingType}
            onChange={(e) => setSelectedTrainingType(e.target.value)}
            className="input w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
          >
            <option value="" disabled hidden>
              Select Training Type
            </option>
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="mobility">Mobility</option>
            <option value="rehab">Rehab</option>
            <option value="stretching">Stretching</option>
            <option value="HIIT">HIIT</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Health Concerns */}
        <div>
          <label htmlFor="concern" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Health or Physical Concerns
          </label>
          <textarea
            id="concern"
            name="concern"
            placeholder="E.g. knee pain, limited mobility, or chronic conditions"
            className="mt-1 p-2 border rounded w-full dark:bg-gray-700"
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notes for Your Coach
          </label>
          <textarea
            id="note"
            name="note"
            placeholder="Anything else you'd like your coach to know (optional)"
            className="p-2 border rounded w-full dark:bg-gray-700"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-900 transition disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          {submitting ? 'Booking...' : 'Book Now'}
        </button>
      </form>

      {/* Available Slots Info */}
      {date && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Available slots for {date.toLocaleDateString()}: {getAvailableTimesForDate(date).length} of{' '}
          {getAvailableSlotsForDate(date).length}
        </div>
      )}
    </section>
  );
}
