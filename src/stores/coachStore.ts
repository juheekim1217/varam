// src/stores/coachStore.ts
import { atom } from 'nanostores';
import { supabase } from '~/lib/supabaseClient';

export const coaches = atom<{ id: string; full_name: string }[]>([]);
export const coachesLoading = atom(false);
export const coachesError = atom('');

export const fetchCoaches = async () => {
  coachesLoading.set(true);
  coachesError.set('');
  try {
    const { data, error } = await supabase.from('coaches').select('id, full_name');
    if (error) {
      coachesError.set(error.message);
    } else {
      coaches.set(data || []);
    }
  } catch (err) {
    coachesError.set((err as Error).message);
  } finally {
    coachesLoading.set(false);
  }
};
