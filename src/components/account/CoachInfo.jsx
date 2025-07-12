import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { user } from '~/stores/authStore';
import { coach, loading, error, fetchCoachProfile } from '~/stores/coachStore';

export default function CoachInfo() {
  const $user = useStore(user);
  const $coach = useStore(coach);
  const $loading = useStore(loading);
  const $error = useStore(error);

  useEffect(() => {
    if (!$user?.id) return;
    fetchCoachProfile($user.id);
  }, [$user?.id]);

  if (!$user) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">You are not signed in.</p>;
  }

  if ($loading) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">Loading coach info...</p>;
  }

  if ($error) {
    return <p className="text-sm text-red-500 dark:text-red-400">Error: {$error}</p>;
  }

  if (!$coach) {
    return <p className="text-sm text-gray-500">We couldn't find a coach profile linked to your account.</p>;
  }

  return (
    <div className="p-4 border rounded-xl bg-white shadow-sm dark:bg-gray-800 space-y-2">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{$coach.full_name}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">{$coach.bio}</p>
      {$coach.specialization && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <strong>Specialization:</strong> {$coach.specialization.join(', ')}
        </p>
      )}
      {$coach.gender && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <strong>Gender:</strong> {$coach.gender}
        </p>
      )}
      {$coach.birthday && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <strong>Birthday:</strong> {$coach.birthday}
        </p>
      )}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        <strong>Location:</strong>{' '}
        {[$coach.neighborhood, $coach.street, $coach.city, $coach.province, $coach.country].filter(Boolean).join(', ')}
      </p>
      {$coach.available_locations?.length > 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <strong>Available At:</strong> {$coach.available_locations.join(', ')}
        </p>
      )}
      {$coach.availability && Object.keys($coach.availability).length > 0 && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <strong>Availability:</strong>
          <ul className="mt-1 space-y-1 ml-4 list-disc">
            {Object.entries($coach.availability).map(([day, slots]) => (
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
