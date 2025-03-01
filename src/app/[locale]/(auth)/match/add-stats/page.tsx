import { supabase } from '@/utils/SupabaseClient';
import AddPlayerMatchStats from '@/components/AddPlayerMatchStats';

export default async function AddStats() {

  const { data: players, error } = await supabase.from('players').select('*');
  if (error) {
    console.error('Error fetching players:', error);
    return <p>Error loading users.</p>;
  }

  const { data: matches, error: errorMatches } = await supabase.from('matches').select('*');
  if (errorMatches) {
    console.error('Error fetching matches:', error);
    return <p>Error loading users.</p>;
  }

  return (
    <>

      <AddPlayerMatchStats players={players} matches={matches} />
    </>
  );
}
