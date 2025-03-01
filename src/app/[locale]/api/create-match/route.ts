import { NextResponse } from 'next/server';
import { supabase } from '@/utils/SupabaseClient'; // Adjust the path to your supabase client

// Exporting the POST method as a named export
export async function POST(request: Request) {
  try {
    const matchData = await request.json();
    const { map, team1, team2, score1, score2, winner } = matchData;

    const { data, error } = await supabase
      .from('matches')
      .insert([{ map, team1, team2, score1, score2, winner }]);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
