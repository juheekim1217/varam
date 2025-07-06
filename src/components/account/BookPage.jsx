import { useEffect, useState } from 'react';
import { supabase } from '~/lib/supabaseClient';

export default function BookPage() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndRole = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData?.session?.user;

      if (!currentUser) {
        setLoading(false);
        return;
      }

      setUser(currentUser);

      const { data: userRow, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (!error && userRow) {
        setRole(userRow.role);
      }

      setLoading(false);
    };

    fetchUserAndRole();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!user) return <p className="text-center">Please sign in to access this page.</p>;

  // 👇 Guest-specific layout
  if (role === 'guest') {
    return (
      <section className="max-w-xl mx-auto my-10 p-4 border rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Book a Trial Session</h2>
        <p className="mb-4 text-gray-600">
          You're currently signed in as a guest. Enjoy a free trial session to experience our training firsthand before
          getting started.
        </p>
        <a
          href="/forms/trial"
          className="btn mt-4 inline-block text-center bg-black text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Go to Trial Page
        </a>
      </section>
    );
  }

  // 👇 Member layout
  return (
    <section className="max-w-xl mx-auto my-10 p-4 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Book a Training Session</h2>
      <form method="POST" action="/api/book-session">
        <input type="text" name="name" placeholder="Your Name" required className="input" />
        <input type="email" name="email" placeholder="Your Email" required className="input" />
        <input type="date" name="date" required className="input" />
        <select name="time" required className="input">
          {[
            '6:00 AM',
            '7:00 AM',
            '8:00 AM',
            '9:00 AM',
            '10:00 AM',
            '11:00 AM',
            '1:00 PM',
            '2:00 PM',
            '3:00 PM',
            '4:00 PM',
            '5:00 PM',
            '6:00 PM',
            '7:00 PM',
            '8:00 PM',
          ].map((time) => (
            <option key={time}>{time}</option>
          ))}
        </select>
        <button type="submit" className="btn mt-4">
          Book Now
        </button>
      </form>
    </section>
  );
}
