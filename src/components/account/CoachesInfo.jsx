// src/components/CoachInfo.jsx
import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { user as userStore } from '~/stores/bookingStore';
import { supabase } from '~/lib/supabaseClient';

export default function CoachInfo() {
  const $user = useStore(userStore);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoaches = async () => {
      const { data, error } = await supabase.from('coaches').select('*').order('full_name');
      if (error) {
        console.error('Failed to load coaches:', error.message);
        setCoaches([]);
      } else {
        setCoaches(data);
      }
      setLoading(false);
    };

    fetchCoaches();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading coaches...</p>;

  return (
    <div className="space-y-6">
      {coaches.map((coach) => (
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
      ))}
    </div>
  );
}
