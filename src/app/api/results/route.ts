import { NextRequest, NextResponse } from 'next/server';
import { saveResult, getAllResults, DbTestResult } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result: DbTestResult = {
      id: uuidv4(),
      ocean_o: body.scores.ocean.O,
      ocean_c: body.scores.ocean.C,
      ocean_e: body.scores.ocean.E,
      ocean_a: body.scores.ocean.A,
      ocean_n: body.scores.ocean.N,
      riasec_r: body.scores.riasec.R,
      riasec_i: body.scores.riasec.I,
      riasec_art: body.scores.riasec.Art,
      riasec_s: body.scores.riasec.S,
      riasec_ent: body.scores.riasec.Ent,
      riasec_con: body.scores.riasec.Con,
      context_time: body.context.time || '',
      context_budget: body.context.budget || '',
      context_activity: body.context.activity || '',
      recommended_hobbies: JSON.stringify(body.recommendedHobbies || []),
      answers: JSON.stringify(body.answers || []),
      created_at: new Date().toISOString(),
    };

    saveResult(result);

    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Error saving result:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save result' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const results = getAllResults();
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}
