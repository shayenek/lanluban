import { NextResponse } from 'next/server';
import { supabase } from '@/utils/SupabaseClient'; // Adjust the path to your supabase client

export async function GET() {
  try {
    const { data, error } = await supabase.from('matches').select('*');

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
