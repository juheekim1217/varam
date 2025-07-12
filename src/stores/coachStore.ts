// src/stores/coachStore.ts
import { atom } from 'nanostores';
import { supabase } from '~/lib/supabaseClient';

export interface Coach {
  id: string;
  full_name: string;
  bio: string;
  specialization?: string[];
  gender?: string;
  birthday?: string;
  neighborhood?: string;
  street?: string;
  city?: string;
  province?: string;
  country?: string;
  available_locations?: string[];
  availability?: Record<string, string[]>;
}

export const coaches = atom<{ id: string; full_name: string }[]>([]);
export const coachesLoading = atom(false);
export const coachesError = atom('');

export const coach = atom<Coach | null>(null);
export const loading = atom(false);
export const error = atom<string | null>(null);

// export const fetchCoaches = async () => {
//   coachesLoading.set(true);
//   coachesError.set('');
//   try {
//     const { data, error } = await supabase.from('coaches').select('id, full_name');
//     if (error) {
//       coachesError.set(error.message);
//     } else {
//       coaches.set(data || []);
//     }
//   } catch (err) {
//     coachesError.set((err as Error).message);
//   } finally {
//     coachesLoading.set(false);
//   }
// };

export const fetchCoachProfile = async (userId: string): Promise<Coach | null> => {
  try {
    loading.set(true);
    error.set(null);

    const { data, error: fetchError } = await supabase.from('coaches').select('*').eq('id', userId).single();

    if (fetchError) {
      error.set(fetchError.message);
      coach.set(null);
      return null;
    }

    coach.set(data);
    return data;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch coach profile';
    error.set(message);
    coach.set(null);
    return null;
  } finally {
    loading.set(false);
  }
};

export const fetchCoaches = async (): Promise<void> => {
  try {
    loading.set(true);
    error.set(null);

    const { data, error: fetchError } = await supabase.from('coaches').select('*').order('full_name');

    if (fetchError) {
      error.set(fetchError.message);
      coaches.set([]);
      return;
    }

    coaches.set(data || []);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch coaches';
    error.set(message);
    coaches.set([]);
  } finally {
    loading.set(false);
  }
};
