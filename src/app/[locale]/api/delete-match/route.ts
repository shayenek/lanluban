import { NextResponse } from 'next/server';
import { supabase } from '@/utils/SupabaseClient'; // Adjust the path to your supabase client

// Exporting the POST method as a named export
export async function DELETE(request: Request) {
  try {
    const { matchId } = await request.json();

    // delete rows from player_matach_score table first
    const { error: playerMatchScoreError } = await supabase.from('player_match_score').delete().eq('match_id', matchId);

    if (playerMatchScoreError) {
      throw new Error(playerMatchScoreError.message);
    }
    
    const { data, error } = await supabase.from('matches').delete().eq('id', matchId);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
