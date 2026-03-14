import { NextResponse } from 'next/server';
import { TEAM_DATABASE } from '@/lib/predictionEngine';

export async function GET() {
  const teams = Object.values(TEAM_DATABASE).map(t => ({
    name: t.name,
    league: t.league,
    country: t.country,
    shortName: t.shortName,
  }));
  // Deduplicate by name
  const unique = teams.filter((t, i, arr) => arr.findIndex(x => x.name === t.name) === i);
  return NextResponse.json({ teams: unique });
}
