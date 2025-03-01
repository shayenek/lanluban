import { NextResponse } from 'next/server';
import { supabase } from '@/utils/SupabaseClient';

export async function GET() {
  try {
    // Join player_match_score with players table to get player names
    const { data, error } = await supabase
      .from('player_match_score')
      .select('*, players(name)'); // This fetches all player_match_score fields + player name

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
