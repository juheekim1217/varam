import { useEffect, useState } from 'react';
import { supabase } from '~/lib/supabaseClient';

export default function MyBookings() {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

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
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setClasses(data || []);
    }

    setLoading(false);
  }

  async function handleCancel(id) {
    const confirmed = window.confirm('Are you sure you want to cancel this session?');
    if (!confirmed) return;

    setCancelingId(id);

    const { error: deleteError } = await supabase.from('bookings').delete().eq('id', id);

    if (deleteError) {
      alert(`Failed to cancel: ${deleteError.message}`);
    } else {
      setClasses((prev) => prev.filter((c) => c.id !== id));
    }

    setCancelingId(null);

    // Refresh the current page to show the updated bookings
    window.location.reload();
  }

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
    <div className="space-y-4 text-sm text-gray-800 dark:text-gray-200">
      {classes.map((c) => (
        <div key={c.id} className="border p-4 rounded shadow-sm bg-white dark:bg-gray-800">
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
          <button
            onClick={() => handleCancel(c.id)}
            disabled={cancelingId === c.id}
            className="mt-2 px-3 py-1.5 text-sm text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
          >
            {cancelingId === c.id ? 'Cancelling...' : 'Cancel'}
          </button>
        </div>
      ))}
    </div>
  );
}
