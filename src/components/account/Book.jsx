import { useEffect, useState } from 'react';
import { supabase } from '~/lib/supabaseClient';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const timeSlots = [
  '6:00 AM',
  '7:30 AM',
  '9:00 AM',
  '10:30 AM',
  '12:00 PM',
  '1:30 PM',
  '3:00 PM',
  '4:30 PM',
  '6:00 PM',
  '7:30 PM',
];

// disable certain hours for specific days
// Example: Tuesday 6:00 AM, 7:30 AM, 9:
const unavailableHours = {
  2: ['6:00 AM', '7:30 AM', '9:00 AM'], // Tuesday
  3: ['6:00 AM', '7:30 AM', '9:00 AM'], // Wednesday
  4: ['4:30 PM', '6:00 PM', '7:30 PM'], // Thursday
  5: ['6:00 AM', '7:30 AM', '9:00 AM'], // Friday
  6: ['9:00 AM', '10:30 AM', '12:00 PM'], // Saturday
};

export default function Book() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]);

  useEffect(() => {
    const fetchUserAndRole = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData?.session?.user;
      if (!currentUser) {
        setLoading(false);
        return;
      }
      setUser(currentUser);

      const { data: userRow } = await supabase.from('users').select('role').eq('id', currentUser.id).maybeSingle();

      if (userRow) setRole(userRow.role);

      const { data: bookingsData } = await supabase.from('bookings').select('date,time');
      setBookings(bookingsData || []);
      setLoading(false);
    };

    fetchUserAndRole();
  }, []);

  const getBookedDates = () => {
    const grouped = bookings.reduce((acc, { date, time }) => {
      acc[date] = acc[date] ? [...acc[date], time] : [time];
      return acc;
    }, {});
    return Object.entries(grouped)
      .filter(([_, times]) => times.length >= timeSlots.length)
      .map(([date]) => date);
  };

  const handleDateChange = (selectedDate) => {
    const formatted = selectedDate.toISOString().split('T')[0];
    const dayBookings = bookings.filter((b) => b.date === formatted).map((b) => b.time);
    setBookedTimes(dayBookings);
    setDate(selectedDate);
  };

  const isAvailableDate = (d) => {
    const today = new Date();
    const isFuture = d >= today.setHours(0, 0, 0, 0);
    //const notWeekend = d.getDay() !== 0 && d.getDay() !== 6;
    const notAvailableDay = d.getDay() !== 1; // diable monday
    const notFullyBooked = !getBookedDates().includes(d.toISOString().split('T')[0]);
    return isFuture && notAvailableDay && notFullyBooked;
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  if (!user) return <p className="text-center mt-10 text-gray-600">Please sign in to continue.</p>;

  if (role === 'guest') {
    return (
      <section className="max-w-xl mx-auto my-12 p-6 bg-white border rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-2">Book a Trial Session</h2>
        <p className="text-gray-600 mb-4">
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
    <section className="max-w-xl mx-auto my-12 p-6 bg-white border rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-bold">Book a Training Session</h2>

      <p className="text-sm text-gray-500">
        Booking as <strong>{user.email}</strong>
      </p>

      <p className="text-sm text-gray-600">
        Each session lasts <strong>60 minutes</strong>, with a 30-minute break between sessions.
      </p>

      <form method="POST" action="/api/book-session" className="space-y-6">
        <input type="hidden" name="email" value={user.email} />
        <input type="hidden" name="name" value={user.user_metadata?.full_name || user.email.split('@')[0]} />

        {/* Select Date */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 z-1000">
          <label htmlFor="date" className="text-sm font-medium text-gray-700 w-32 shrink-0">
            Select Date
          </label>
          <DatePicker
            selected={date}
            onChange={handleDateChange}
            filterDate={isAvailableDate}
            minDate={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)} // disable today + 1 days
            maxDate={new Date(Date.now() + 120 * 24 * 60 * 60 * 1000)} // Today + 120 days (~4 months)
            placeholderText="Select a date"
            name="date"
            required
            className="input w-full border rounded px-3 py-2"
          />
        </div>

        {/* Select Time (always below date) */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label htmlFor="time" className="text-sm font-medium text-gray-700 w-32 shrink-0">
            Select Time
          </label>
          <select name="time" required className="input w-full border rounded px-3 py-2 bg-white">
            {/* {timeSlots.map((time) => (
              <option key={time} value={time} disabled={bookedTimes.includes(time)}>
                {time} {bookedTimes.includes(time) ? '(Reserved)' : ''}
              </option>
            ))} */}
            {timeSlots.map((time) => {
              const day = date?.getDay(); // 0 = Sunday, 6 = Saturday
              const isUnavailable = unavailableHours[day]?.includes(time);
              const isReserved = bookedTimes.includes(time);
              return (
                <option key={time} value={time} disabled={isUnavailable || isReserved}>
                  {time} {isUnavailable || isReserved ? '(Reserved)' : ''}
                </option>
              );
            })}
          </select>
        </div>

        <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-900 transition">
          Book Now
        </button>
      </form>
    </section>
  );
}
