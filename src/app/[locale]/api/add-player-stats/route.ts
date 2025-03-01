import { NextResponse } from 'next/server';
import { supabase } from '@/utils/SupabaseClient'; // Adjust the path to your supabase client

// Exporting the POST method as a named export
export async function POST(request: Request) {
  try {
    const playerStatsData = await request.json();

    const { data, error } = await supabase.from('player_match_score').insert(playerStatsData.playerStats);
    const { error: matchError } = await supabase.from('matches').update({ stats_finished: true }).eq('id', playerStatsData.selectedMatchId);
    
    if (matchError) {
      throw new Error(matchError.message);
    }

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
