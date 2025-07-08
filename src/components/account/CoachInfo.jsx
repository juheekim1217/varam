import { useEffect, useState } from 'react';
import { supabase } from '~/lib/supabaseClient';
import { useStore } from '@nanostores/react';
import { user as userStore } from '~/stores/bookingStore';

export default function CoachInfo() {
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const $user = useStore(userStore);

  useEffect(() => {
    if (!$user?.id) return;

    const fetchCoach = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('coaches').select('*').eq('id', $user.id).single();

      if (error) {
        console.warn('Failed to load coach profile:', error.message);
      } else {
        setCoach(data);
      }

      setLoading(false);
    };

    fetchCoach();
  }, [$user?.id]);

  if (!$user) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">You are not signed in.</p>;
  }

  if (loading) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">Loading coach info...</p>;
  }

  if (!coach) {
    return <p className="text-sm text-gray-500">We couldn’t find a coach profile linked to your account.</p>;
  }

  return (
    <div className="p-4 border rounded-xl bg-white shadow-sm dark:bg-gray-800 space-y-2">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{coach.full_name}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">{coach.bio}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        <strong>Specialization:</strong> {coach.specialization?.join(', ')}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        <strong>Gender:</strong> {coach.gender}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        <strong>Birthday:</strong> {coach.birthday}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        <strong>Location:</strong>{' '}
        {[coach.neighborhood, coach.street, coach.city, coach.province, coach.country].filter(Boolean).join(', ')}
      </p>
      {coach.available_locations && coach.available_locations.length > 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <strong>Available At:</strong> {coach.available_locations.join(', ')}
        </p>
      )}
      {coach.availability && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <strong>Availability:</strong>
          <ul className="mt-1 space-y-1 ml-4 list-disc">
            {Object.entries(coach.availability).map(([day, slots]) => (
              <li key={day}>
                <span className="font-medium">{day}:</span> {slots.join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
