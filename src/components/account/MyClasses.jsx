import { useEffect, useState } from 'react';
import { supabase } from '~/lib/supabaseClient';

export default function MyBookings() {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        setError('Please sign in to view your bookings.');
        setLoading(false);
        return;
      }

      const email = session.user.email;

      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('email', email)
        .order('date', { ascending: true });

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setClasses(data || []);
      }

      setLoading(false);
    }

    fetchBookings();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading your sessions...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">❌ {error}</p>;
  }

  if (!classes.length) {
    return <p className="text-gray-600 text-center">No sessions booked yet.</p>;
  }

  return (
    <div className="space-y-4 text-sm text-gray-800">
      {classes.map((c, idx) => (
        <div key={idx} className="border p-4 rounded shadow-sm bg-white">
          <p>
            <strong>Name:</strong> {c.name}
          </p>
          <p>
            <strong>Email:</strong> {c.email}
          </p>
          <p>
            <strong>Date:</strong> {c.date}
          </p>
          <p>
            <strong>Time:</strong> {c.time}
          </p>
        </div>
      ))}
    </div>
  );
}
