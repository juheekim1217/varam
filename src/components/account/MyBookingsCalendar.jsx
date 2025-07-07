import { useEffect, useState } from 'react';
import { supabase } from '~/lib/supabaseClient';
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

// const timeSlots = [
//   '6:00 AM',
//   '7:30 AM',
//   '9:00 AM',
//   '10:30 AM',
//   '12:00 PM',
//   '1:30 PM',
//   '3:00 PM',
//   '4:30 PM',
//   '6:00 PM',
//   '7:30 PM',
// ];

export default function BookingCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookings, setBookings] = useState([]);

  // useEffect(() => {
  //   const fetchBookings = async () => {
  //     const { data } = await supabase.from('bookings').select('date, time');
  //     setBookings(data || []);
  //   };
  //   fetchBookings();
  // }, []);
  useEffect(() => {
    const fetchBookings = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (sessionError || !user) {
        console.error('User not authenticated');
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('email', user.email)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (fetchError) {
        console.error('Failed to fetch bookings:', fetchError.message);
        return;
      }

      setBookings(data || []);
    };

    fetchBookings();
  }, []);

  const getBookingsForDate = (date) => {
    const formatted = format(date, 'yyyy-MM-dd');
    return bookings.filter((b) => b.date === formatted).map((b) => b.time);
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>&lt;</button>
      <h2 className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
      <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>&gt;</button>
    </div>
  );

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 text-center text-sm font-medium">
        {days.map((day) => (
          <div key={day}>{day}</div>
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
        const dayBookings = getBookingsForDate(day);

        days.push(
          <div
            key={day.toString()}
            className={`p-2 text-sm border h-24 relative cursor-pointer ${isDisabled ? 'text-gray-400 bg-gray-50 dark:bg-gray-700' : ''} ${isSelected ? 'bg-black text-white' : ''}`}
            onClick={() => setSelectedDate(day)}
          >
            <div className="absolute top-1 left-1">{formatted}</div>
            <div className="text-[12px] mt-4 space-y-0.5">
              {dayBookings.slice(0, 3).map((time) => (
                <div key={time} className="bg-green-100 text-green-800 rounded px-1 leading-none py-0.5">
                  {time}
                </div>
              ))}

              {dayBookings.length > 3 && <div>+{dayBookings.length - 3} more</div>}
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
    <section className="max-w-3xl mx-auto my-10 p-6 border rounded-xl bg-white shadow dark:bg-gray-800">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </section>
  );
}
