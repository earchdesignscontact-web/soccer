import { NextRequest, NextResponse } from 'next/server';
import { predictMatch, findTeam, FEATURED_MATCHES } from '@/lib/predictionEngine';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const home = searchParams.get('home');
  const away = searchParams.get('away');

  if (!home || !away) {
    // Return featured matches with predictions
    const predictions = FEATURED_MATCHES.map(match => {
      const prediction = predictMatch(match.home, match.away);
      return { ...match, prediction };
    }).filter(m => m.prediction !== null);
    return NextResponse.json({ featured: predictions });
  }

  const homeKey = findTeam(home);
  const awayKey = findTeam(away);

  if (!homeKey) {
    return NextResponse.json({ error: `Team not found: "${home}". Try searching by full name or common alias.` }, { status: 404 });
  }
  if (!awayKey) {
    return NextResponse.json({ error: `Team not found: "${away}". Try searching by full name or common alias.` }, { status: 404 });
  }

  const prediction = predictMatch(homeKey, awayKey);
  if (!prediction) {
    return NextResponse.json({ error: 'Could not generate prediction.' }, { status: 500 });
  }

  return NextResponse.json({ prediction });
}
