// Soccer Prediction Engine
// Uses historical team statistics, form, head-to-head records, and other factors

export interface TeamStats {
  name: string;
  shortName: string;
  league: string;
  country: string;
  founded: number;
  // Recent form (last 10 matches: W=3, D=1, L=0)
  formPoints: number;
  formResults: string[]; // ['W','W','D','L','W']
  // Season stats
  seasonWins: number;
  seasonDraws: number;
  seasonLosses: number;
  goalsScored: number;
  goalsConceded: number;
  // Historical stats
  historicalWinRate: number; // 0-1
  historicalDrawRate: number;
  // Attack / Defense ratings (0-100)
  attackRating: number;
  defenseRating: number;
  // Home/Away performance
  homeWinRate: number;
  awayWinRate: number;
  // Big game performance (vs top 6)
  bigGameWinRate: number;
  // European / Cup form bonus
  europeanPrestige: number; // 0-10
  // Squad strength (0-100)
  squadStrength: number;
  // Manager experience score
  managerScore: number;
}

export interface HeadToHead {
  team1Wins: number;
  team2Wins: number;
  draws: number;
  lastResults: string[]; // ['team1','draw','team2']
  avgGoals: number;
}

export interface Prediction {
  homeTeam: TeamStats;
  awayTeam: TeamStats;
  h2h: HeadToHead;
  homeWinProbability: number;
  drawProbability: number;
  awayWinProbability: number;
  predictedWinner: 'home' | 'away' | 'draw';
  confidence: 'Low' | 'Medium' | 'High' | 'Very High';
  predictedScore: string;
  keyFactors: string[];
  reasoning: string;
  expectedGoals: { home: number; away: number };
  bothTeamsToScore: boolean;
  over25Goals: boolean;
  riskLevel: 'Low' | 'Medium' | 'High';
}

// Comprehensive team database with historical data
export const TEAM_DATABASE: Record<string, TeamStats> = {
  // Premier League
  'manchester city': {
    name: 'Manchester City', shortName: 'MCI', league: 'Premier League', country: 'England',
    founded: 1880, formPoints: 25, formResults: ['W','W','W','D','W','W','L','W','W','W'],
    seasonWins: 24, seasonDraws: 5, seasonLosses: 4, goalsScored: 78, goalsConceded: 32,
    historicalWinRate: 0.68, historicalDrawRate: 0.18, attackRating: 95, defenseRating: 88,
    homeWinRate: 0.78, awayWinRate: 0.58, bigGameWinRate: 0.62, europeanPrestige: 9,
    squadStrength: 97, managerScore: 95
  },
  'arsenal': {
    name: 'Arsenal', shortName: 'ARS', league: 'Premier League', country: 'England',
    founded: 1886, formPoints: 23, formResults: ['W','W','D','W','W','L','W','W','W','D'],
    seasonWins: 22, seasonDraws: 6, seasonLosses: 5, goalsScored: 71, goalsConceded: 35,
    historicalWinRate: 0.63, historicalDrawRate: 0.20, attackRating: 91, defenseRating: 85,
    homeWinRate: 0.72, awayWinRate: 0.54, bigGameWinRate: 0.55, europeanPrestige: 8,
    squadStrength: 92, managerScore: 88
  },
  'liverpool': {
    name: 'Liverpool', shortName: 'LIV', league: 'Premier League', country: 'England',
    founded: 1892, formPoints: 24, formResults: ['W','W','W','W','D','W','W','L','W','W'],
    seasonWins: 23, seasonDraws: 5, seasonLosses: 5, goalsScored: 75, goalsConceded: 38,
    historicalWinRate: 0.65, historicalDrawRate: 0.19, attackRating: 93, defenseRating: 84,
    homeWinRate: 0.74, awayWinRate: 0.56, bigGameWinRate: 0.60, europeanPrestige: 10,
    squadStrength: 94, managerScore: 90
  },
  'chelsea': {
    name: 'Chelsea', shortName: 'CHE', league: 'Premier League', country: 'England',
    founded: 1905, formPoints: 18, formResults: ['W','D','L','W','W','D','W','L','W','D'],
    seasonWins: 17, seasonDraws: 9, seasonLosses: 7, goalsScored: 58, goalsConceded: 45,
    historicalWinRate: 0.58, historicalDrawRate: 0.22, attackRating: 82, defenseRating: 78,
    homeWinRate: 0.65, awayWinRate: 0.48, bigGameWinRate: 0.50, europeanPrestige: 9,
    squadStrength: 88, managerScore: 75
  },
  'manchester united': {
    name: 'Manchester United', shortName: 'MUN', league: 'Premier League', country: 'England',
    founded: 1878, formPoints: 15, formResults: ['L','W','D','L','W','D','W','L','D','W'],
    seasonWins: 14, seasonDraws: 7, seasonLosses: 12, goalsScored: 48, goalsConceded: 52,
    historicalWinRate: 0.60, historicalDrawRate: 0.20, attackRating: 73, defenseRating: 68,
    homeWinRate: 0.62, awayWinRate: 0.42, bigGameWinRate: 0.42, europeanPrestige: 10,
    squadStrength: 82, managerScore: 65
  },
  'tottenham': {
    name: 'Tottenham Hotspur', shortName: 'TOT', league: 'Premier League', country: 'England',
    founded: 1882, formPoints: 16, formResults: ['W','L','W','D','W','L','D','W','L','W'],
    seasonWins: 15, seasonDraws: 7, seasonLosses: 11, goalsScored: 55, goalsConceded: 50,
    historicalWinRate: 0.52, historicalDrawRate: 0.22, attackRating: 78, defenseRating: 70,
    homeWinRate: 0.60, awayWinRate: 0.44, bigGameWinRate: 0.45, europeanPrestige: 7,
    squadStrength: 83, managerScore: 72
  },
  'newcastle': {
    name: 'Newcastle United', shortName: 'NEW', league: 'Premier League', country: 'England',
    founded: 1892, formPoints: 20, formResults: ['W','W','D','W','W','D','W','W','L','W'],
    seasonWins: 19, seasonDraws: 6, seasonLosses: 8, goalsScored: 62, goalsConceded: 40,
    historicalWinRate: 0.55, historicalDrawRate: 0.21, attackRating: 83, defenseRating: 80,
    homeWinRate: 0.66, awayWinRate: 0.50, bigGameWinRate: 0.48, europeanPrestige: 6,
    squadStrength: 87, managerScore: 82
  },
  'aston villa': {
    name: 'Aston Villa', shortName: 'AVL', league: 'Premier League', country: 'England',
    founded: 1874, formPoints: 19, formResults: ['W','W','D','W','L','W','W','D','W','W'],
    seasonWins: 18, seasonDraws: 7, seasonLosses: 8, goalsScored: 65, goalsConceded: 42,
    historicalWinRate: 0.53, historicalDrawRate: 0.22, attackRating: 84, defenseRating: 79,
    homeWinRate: 0.65, awayWinRate: 0.48, bigGameWinRate: 0.46, europeanPrestige: 7,
    squadStrength: 86, managerScore: 85
  },
  // La Liga
  'real madrid': {
    name: 'Real Madrid', shortName: 'RMA', league: 'La Liga', country: 'Spain',
    founded: 1902, formPoints: 26, formResults: ['W','W','W','W','W','D','W','W','W','W'],
    seasonWins: 25, seasonDraws: 4, seasonLosses: 4, goalsScored: 82, goalsConceded: 30,
    historicalWinRate: 0.72, historicalDrawRate: 0.16, attackRating: 97, defenseRating: 90,
    homeWinRate: 0.82, awayWinRate: 0.62, bigGameWinRate: 0.70, europeanPrestige: 10,
    squadStrength: 98, managerScore: 92
  },
  'barcelona': {
    name: 'FC Barcelona', shortName: 'BAR', league: 'La Liga', country: 'Spain',
    founded: 1899, formPoints: 23, formResults: ['W','W','D','W','W','W','L','W','D','W'],
    seasonWins: 22, seasonDraws: 6, seasonLosses: 5, goalsScored: 76, goalsConceded: 35,
    historicalWinRate: 0.70, historicalDrawRate: 0.17, attackRating: 94, defenseRating: 85,
    homeWinRate: 0.78, awayWinRate: 0.60, bigGameWinRate: 0.65, europeanPrestige: 10,
    squadStrength: 95, managerScore: 85
  },
  'atletico madrid': {
    name: 'Atletico Madrid', shortName: 'ATM', league: 'La Liga', country: 'Spain',
    founded: 1903, formPoints: 21, formResults: ['W','D','W','W','D','W','W','D','W','L'],
    seasonWins: 20, seasonDraws: 8, seasonLosses: 5, goalsScored: 62, goalsConceded: 28,
    historicalWinRate: 0.60, historicalDrawRate: 0.25, attackRating: 82, defenseRating: 92,
    homeWinRate: 0.70, awayWinRate: 0.52, bigGameWinRate: 0.58, europeanPrestige: 9,
    squadStrength: 90, managerScore: 93
  },
  'sevilla': {
    name: 'Sevilla FC', shortName: 'SEV', league: 'La Liga', country: 'Spain',
    founded: 1890, formPoints: 15, formResults: ['D','W','L','D','W','D','L','W','D','W'],
    seasonWins: 13, seasonDraws: 9, seasonLosses: 11, goalsScored: 48, goalsConceded: 48,
    historicalWinRate: 0.52, historicalDrawRate: 0.24, attackRating: 74, defenseRating: 74,
    homeWinRate: 0.60, awayWinRate: 0.42, bigGameWinRate: 0.40, europeanPrestige: 8,
    squadStrength: 80, managerScore: 70
  },
  // Bundesliga
  'bayern munich': {
    name: 'Bayern Munich', shortName: 'BAY', league: 'Bundesliga', country: 'Germany',
    founded: 1900, formPoints: 27, formResults: ['W','W','W','W','W','W','W','D','W','W'],
    seasonWins: 26, seasonDraws: 3, seasonLosses: 3, goalsScored: 88, goalsConceded: 28,
    historicalWinRate: 0.75, historicalDrawRate: 0.14, attackRating: 96, defenseRating: 88,
    homeWinRate: 0.84, awayWinRate: 0.66, bigGameWinRate: 0.68, europeanPrestige: 10,
    squadStrength: 97, managerScore: 88
  },
  'borussia dortmund': {
    name: 'Borussia Dortmund', shortName: 'BVB', league: 'Bundesliga', country: 'Germany',
    founded: 1909, formPoints: 20, formResults: ['W','D','W','W','L','W','W','D','W','D'],
    seasonWins: 19, seasonDraws: 7, seasonLosses: 6, goalsScored: 68, goalsConceded: 42,
    historicalWinRate: 0.60, historicalDrawRate: 0.20, attackRating: 87, defenseRating: 78,
    homeWinRate: 0.70, awayWinRate: 0.52, bigGameWinRate: 0.52, europeanPrestige: 9,
    squadStrength: 88, managerScore: 78
  },
  'rb leipzig': {
    name: 'RB Leipzig', shortName: 'RBL', league: 'Bundesliga', country: 'Germany',
    founded: 2009, formPoints: 19, formResults: ['W','W','D','W','L','W','D','W','W','D'],
    seasonWins: 18, seasonDraws: 6, seasonLosses: 8, goalsScored: 62, goalsConceded: 40,
    historicalWinRate: 0.56, historicalDrawRate: 0.20, attackRating: 83, defenseRating: 80,
    homeWinRate: 0.64, awayWinRate: 0.50, bigGameWinRate: 0.48, europeanPrestige: 7,
    squadStrength: 87, managerScore: 82
  },
  // Serie A
  'inter milan': {
    name: 'Inter Milan', shortName: 'INT', league: 'Serie A', country: 'Italy',
    founded: 1908, formPoints: 24, formResults: ['W','W','W','D','W','W','W','D','W','W'],
    seasonWins: 23, seasonDraws: 5, seasonLosses: 5, goalsScored: 74, goalsConceded: 32,
    historicalWinRate: 0.64, historicalDrawRate: 0.20, attackRating: 90, defenseRating: 88,
    homeWinRate: 0.74, awayWinRate: 0.55, bigGameWinRate: 0.60, europeanPrestige: 10,
    squadStrength: 93, managerScore: 87
  },
  'juventus': {
    name: 'Juventus', shortName: 'JUV', league: 'Serie A', country: 'Italy',
    founded: 1897, formPoints: 20, formResults: ['W','W','D','W','D','W','L','W','W','D'],
    seasonWins: 19, seasonDraws: 7, seasonLosses: 7, goalsScored: 58, goalsConceded: 35,
    historicalWinRate: 0.65, historicalDrawRate: 0.21, attackRating: 82, defenseRating: 85,
    homeWinRate: 0.72, awayWinRate: 0.54, bigGameWinRate: 0.55, europeanPrestige: 10,
    squadStrength: 88, managerScore: 80
  },
  'ac milan': {
    name: 'AC Milan', shortName: 'MIL', league: 'Serie A', country: 'Italy',
    founded: 1899, formPoints: 18, formResults: ['W','D','L','W','W','D','W','W','L','W'],
    seasonWins: 17, seasonDraws: 8, seasonLosses: 8, goalsScored: 56, goalsConceded: 40,
    historicalWinRate: 0.60, historicalDrawRate: 0.22, attackRating: 80, defenseRating: 80,
    homeWinRate: 0.68, awayWinRate: 0.50, bigGameWinRate: 0.52, europeanPrestige: 10,
    squadStrength: 86, managerScore: 75
  },
  'napoli': {
    name: 'Napoli', shortName: 'NAP', league: 'Serie A', country: 'Italy',
    founded: 1926, formPoints: 22, formResults: ['W','W','W','D','W','W','D','W','W','L'],
    seasonWins: 21, seasonDraws: 6, seasonLosses: 6, goalsScored: 68, goalsConceded: 36,
    historicalWinRate: 0.58, historicalDrawRate: 0.22, attackRating: 86, defenseRating: 82,
    homeWinRate: 0.68, awayWinRate: 0.52, bigGameWinRate: 0.55, europeanPrestige: 8,
    squadStrength: 89, managerScore: 84
  },
  // Ligue 1
  'psg': {
    name: 'Paris Saint-Germain', shortName: 'PSG', league: 'Ligue 1', country: 'France',
    founded: 1970, formPoints: 26, formResults: ['W','W','W','W','D','W','W','W','W','W'],
    seasonWins: 25, seasonDraws: 4, seasonLosses: 4, goalsScored: 80, goalsConceded: 28,
    historicalWinRate: 0.70, historicalDrawRate: 0.16, attackRating: 93, defenseRating: 87,
    homeWinRate: 0.80, awayWinRate: 0.62, bigGameWinRate: 0.62, europeanPrestige: 9,
    squadStrength: 95, managerScore: 85
  },
  'paris saint-germain': {
    name: 'Paris Saint-Germain', shortName: 'PSG', league: 'Ligue 1', country: 'France',
    founded: 1970, formPoints: 26, formResults: ['W','W','W','W','D','W','W','W','W','W'],
    seasonWins: 25, seasonDraws: 4, seasonLosses: 4, goalsScored: 80, goalsConceded: 28,
    historicalWinRate: 0.70, historicalDrawRate: 0.16, attackRating: 93, defenseRating: 87,
    homeWinRate: 0.80, awayWinRate: 0.62, bigGameWinRate: 0.62, europeanPrestige: 9,
    squadStrength: 95, managerScore: 85
  },
  // Portugal
  'benfica': {
    name: 'SL Benfica', shortName: 'BEN', league: 'Primeira Liga', country: 'Portugal',
    founded: 1904, formPoints: 22, formResults: ['W','W','W','D','W','W','D','W','W','L'],
    seasonWins: 21, seasonDraws: 6, seasonLosses: 6, goalsScored: 65, goalsConceded: 32,
    historicalWinRate: 0.65, historicalDrawRate: 0.19, attackRating: 85, defenseRating: 82,
    homeWinRate: 0.74, awayWinRate: 0.56, bigGameWinRate: 0.58, europeanPrestige: 8,
    squadStrength: 86, managerScore: 80
  },
  'porto': {
    name: 'FC Porto', shortName: 'POR', league: 'Primeira Liga', country: 'Portugal',
    founded: 1893, formPoints: 21, formResults: ['W','W','D','W','W','L','W','D','W','W'],
    seasonWins: 20, seasonDraws: 6, seasonLosses: 7, goalsScored: 60, goalsConceded: 30,
    historicalWinRate: 0.63, historicalDrawRate: 0.20, attackRating: 83, defenseRating: 83,
    homeWinRate: 0.72, awayWinRate: 0.54, bigGameWinRate: 0.56, europeanPrestige: 8,
    squadStrength: 84, managerScore: 78
  },
  // Netherlands
  'ajax': {
    name: 'AFC Ajax', shortName: 'AJX', league: 'Eredivisie', country: 'Netherlands',
    founded: 1900, formPoints: 19, formResults: ['W','D','W','W','L','W','W','D','W','W'],
    seasonWins: 18, seasonDraws: 7, seasonLosses: 8, goalsScored: 62, goalsConceded: 40,
    historicalWinRate: 0.62, historicalDrawRate: 0.20, attackRating: 82, defenseRating: 76,
    homeWinRate: 0.70, awayWinRate: 0.52, bigGameWinRate: 0.52, europeanPrestige: 9,
    squadStrength: 82, managerScore: 75
  },
};

// Head-to-head database
const H2H_DATABASE: Record<string, HeadToHead> = {
  'real madrid_barcelona': { team1Wins: 96, team2Wins: 100, draws: 56, lastResults: ['team1','team1','draw','team2','team1'], avgGoals: 3.1 },
  'barcelona_real madrid': { team1Wins: 100, team2Wins: 96, draws: 56, lastResults: ['team2','team2','draw','team1','team2'], avgGoals: 3.1 },
  'manchester city_liverpool': { team1Wins: 52, team2Wins: 60, draws: 34, lastResults: ['team1','draw','team2','team1','team2'], avgGoals: 2.8 },
  'liverpool_manchester city': { team1Wins: 60, team2Wins: 52, draws: 34, lastResults: ['team2','draw','team1','team2','team1'], avgGoals: 2.8 },
  'manchester city_arsenal': { team1Wins: 62, team2Wins: 40, draws: 28, lastResults: ['team1','team1','draw','team1','team2'], avgGoals: 2.6 },
  'arsenal_manchester city': { team1Wins: 40, team2Wins: 62, draws: 28, lastResults: ['team2','team2','draw','team2','team1'], avgGoals: 2.6 },
  'manchester united_liverpool': { team1Wins: 80, team2Wins: 73, draws: 59, lastResults: ['team2','team2','team2','draw','team1'], avgGoals: 2.5 },
  'liverpool_manchester united': { team1Wins: 73, team2Wins: 80, draws: 59, lastResults: ['team1','team1','team1','draw','team2'], avgGoals: 2.5 },
  'inter milan_juventus': { team1Wins: 77, team2Wins: 86, draws: 68, lastResults: ['team1','draw','team2','team1','team1'], avgGoals: 2.3 },
  'juventus_inter milan': { team1Wins: 86, team2Wins: 77, draws: 68, lastResults: ['team2','draw','team1','team2','team2'], avgGoals: 2.3 },
  'real madrid_atletico madrid': { team1Wins: 78, team2Wins: 48, draws: 54, lastResults: ['team1','draw','team2','team1','draw'], avgGoals: 2.1 },
  'atletico madrid_real madrid': { team1Wins: 48, team2Wins: 78, draws: 54, lastResults: ['team2','draw','team1','team2','draw'], avgGoals: 2.1 },
  'barcelona_atletico madrid': { team1Wins: 82, team2Wins: 52, draws: 46, lastResults: ['team1','team2','team1','draw','team1'], avgGoals: 2.2 },
  'atletico madrid_barcelona': { team1Wins: 52, team2Wins: 82, draws: 46, lastResults: ['team2','team1','team2','draw','team2'], avgGoals: 2.2 },
  'bayern munich_borussia dortmund': { team1Wins: 78, team2Wins: 44, draws: 38, lastResults: ['team1','team1','team2','team1','team1'], avgGoals: 3.2 },
  'borussia dortmund_bayern munich': { team1Wins: 44, team2Wins: 78, draws: 38, lastResults: ['team2','team2','team1','team2','team2'], avgGoals: 3.2 },
  'psg_real madrid': { team1Wins: 5, team2Wins: 8, draws: 2, lastResults: ['team2','team1','team2','draw','team2'], avgGoals: 2.9 },
  'real madrid_psg': { team1Wins: 8, team2Wins: 5, draws: 2, lastResults: ['team1','team2','team1','draw','team1'], avgGoals: 2.9 },
  'ac milan_inter milan': { team1Wins: 74, team2Wins: 74, draws: 72, lastResults: ['team1','draw','team2','team1','draw'], avgGoals: 2.0 },
  'inter milan_ac milan': { team1Wins: 74, team2Wins: 74, draws: 72, lastResults: ['team2','draw','team1','team2','draw'], avgGoals: 2.0 },
};

function getH2H(home: string, away: string): HeadToHead {
  const key = `${home}_${away}`;
  const reverseKey = `${away}_${home}`;
  if (H2H_DATABASE[key]) return H2H_DATABASE[key];
  if (H2H_DATABASE[reverseKey]) {
    const r = H2H_DATABASE[reverseKey];
    return { team1Wins: r.team2Wins, team2Wins: r.team1Wins, draws: r.draws, lastResults: r.lastResults.map(x => x === 'team1' ? 'team2' : x === 'team2' ? 'team1' : x), avgGoals: r.avgGoals };
  }
  // Default H2H for unknown matchups
  return { team1Wins: 5, team2Wins: 4, draws: 3, lastResults: ['team1','draw','team2','draw','team1'], avgGoals: 2.3 };
}

function calcFormScore(results: string[]): number {
  return results.reduce((acc, r) => {
    if (r === 'W') return acc + 3;
    if (r === 'D') return acc + 1;
    return acc;
  }, 0);
}

export function predictMatch(homeTeamName: string, awayTeamName: string): Prediction | null {
  const homeLower = homeTeamName.toLowerCase().trim();
  const awayLower = awayTeamName.toLowerCase().trim();

  const homeTeam = TEAM_DATABASE[homeLower];
  const awayTeam = TEAM_DATABASE[awayLower];

  if (!homeTeam || !awayTeam) {
    return null;
  }

  const h2h = getH2H(homeLower, awayLower);

  // === Prediction Algorithm ===
  // Factor 1: Squad Strength (weight: 0.25)
  const strengthDiff = (homeTeam.squadStrength - awayTeam.squadStrength) / 100;

  // Factor 2: Current Form (weight: 0.25)
  const homeForm = calcFormScore(homeTeam.formResults) / 30;
  const awayForm = calcFormScore(awayTeam.formResults) / 30;
  const formDiff = homeForm - awayForm;

  // Factor 3: Home Advantage (weight: 0.15)
  const homeAdvantage = 0.08; // ~8% boost for home team

  // Factor 4: Attack vs Defense (weight: 0.20)
  const homeAttackVsAwayDef = (homeTeam.attackRating - awayTeam.defenseRating) / 200;
  const awayAttackVsHomeDef = (awayTeam.attackRating - homeTeam.defenseRating) / 200;
  const attackDefDiff = homeAttackVsAwayDef - awayAttackVsHomeDef;

  // Factor 5: H2H (weight: 0.10)
  const totalH2H = h2h.team1Wins + h2h.team2Wins + h2h.draws;
  const h2hHomeDominance = (h2h.team1Wins - h2h.team2Wins) / (totalH2H || 1);

  // Factor 6: Historical win rates (weight: 0.05)
  const historicalDiff = homeTeam.historicalWinRate - awayTeam.historicalWinRate;

  // Combined score
  const combinedScore = (strengthDiff * 0.25) + (formDiff * 0.25) + (homeAdvantage * 0.15) + (attackDefDiff * 0.20) + (h2hHomeDominance * 0.10) + (historicalDiff * 0.05);

  // Convert to probabilities using a logistic-style function
  const baseHomeWin = 0.45 + combinedScore * 1.2;
  const clampedHomeWin = Math.max(0.10, Math.min(0.80, baseHomeWin));

  // Draw probability based on how close teams are
  const closeness = 1 - Math.abs(combinedScore) * 2;
  const drawProb = Math.max(0.15, Math.min(0.35, 0.25 + closeness * 0.1));

  const remainingProb = 1 - drawProb;
  const homeWinProb = clampedHomeWin * remainingProb;
  const awayWinProb = (1 - clampedHomeWin) * remainingProb;

  // Normalize
  const total = homeWinProb + drawProb + awayWinProb;
  const finalHomeWin = homeWinProb / total;
  const finalDraw = drawProb / total;
  const finalAwayWin = awayWinProb / total;

  // Determine winner
  let predictedWinner: 'home' | 'away' | 'draw';
  let winProb: number;
  if (finalHomeWin >= finalDraw && finalHomeWin >= finalAwayWin) {
    predictedWinner = 'home';
    winProb = finalHomeWin;
  } else if (finalAwayWin >= finalHomeWin && finalAwayWin >= finalDraw) {
    predictedWinner = 'away';
    winProb = finalAwayWin;
  } else {
    predictedWinner = 'draw';
    winProb = finalDraw;
  }

  // Confidence level
  let confidence: 'Low' | 'Medium' | 'High' | 'Very High';
  if (winProb >= 0.65) confidence = 'Very High';
  else if (winProb >= 0.50) confidence = 'High';
  else if (winProb >= 0.38) confidence = 'Medium';
  else confidence = 'Low';

  // Expected goals
  const homeXG = ((homeTeam.attackRating / 100) * (1 - awayTeam.defenseRating / 200) * 2.5).toFixed(1);
  const awayXG = ((awayTeam.attackRating / 100) * (1 - homeTeam.defenseRating / 200) * 2.2).toFixed(1);
  const expectedGoals = { home: parseFloat(homeXG), away: parseFloat(awayXG) };

  // Predicted score
  const homeGoals = Math.round(expectedGoals.home);
  const awayGoals = Math.round(expectedGoals.away);
  const predictedScore = `${homeGoals}-${awayGoals}`;

  // BTTS and over 2.5
  const totalExpected = expectedGoals.home + expectedGoals.away;
  const bothTeamsToScore = expectedGoals.home >= 0.9 && expectedGoals.away >= 0.9;
  const over25Goals = totalExpected >= 2.5;

  // Risk level
  const riskLevel = confidence === 'Very High' || confidence === 'High' ? 'Low' :
    confidence === 'Medium' ? 'Medium' : 'High';

  // Key factors and reasoning
  const keyFactors: string[] = [];
  const reasoningParts: string[] = [];

  if (homeTeam.squadStrength > awayTeam.squadStrength + 5) {
    keyFactors.push(`${homeTeam.name} has superior squad quality (${homeTeam.squadStrength} vs ${awayTeam.squadStrength})`);
    reasoningParts.push(`superior squad depth`);
  } else if (awayTeam.squadStrength > homeTeam.squadStrength + 5) {
    keyFactors.push(`${awayTeam.name} has superior squad quality (${awayTeam.squadStrength} vs ${homeTeam.squadStrength})`);
    reasoningParts.push(`stronger squad`);
  }

  const homeFormScore = calcFormScore(homeTeam.formResults);
  const awayFormScore = calcFormScore(awayTeam.formResults);
  if (homeFormScore > awayFormScore + 3) {
    keyFactors.push(`${homeTeam.name} in exceptional recent form (${homeFormScore}/30 pts)`);
    reasoningParts.push(`excellent current form`);
  } else if (awayFormScore > homeFormScore + 3) {
    keyFactors.push(`${awayTeam.name} in excellent recent form (${awayFormScore}/30 pts)`);
    reasoningParts.push(`superior recent form`);
  }

  keyFactors.push(`Home advantage boosts ${homeTeam.name}'s win probability by ~8%`);

  if (h2h.team1Wins > h2h.team2Wins + 10) {
    keyFactors.push(`Strong historical dominance: ${homeTeam.name} leads H2H ${h2h.team1Wins}-${h2h.team2Wins}`);
    reasoningParts.push(`historical dominance in head-to-head`);
  } else if (h2h.team2Wins > h2h.team1Wins + 10) {
    keyFactors.push(`Historical advantage: ${awayTeam.name} leads H2H ${h2h.team2Wins}-${h2h.team1Wins}`);
    reasoningParts.push(`H2H historical advantage`);
  } else {
    keyFactors.push(`Closely contested H2H record (${h2h.team1Wins}-${h2h.team2Wins}-${h2h.draws})`);
  }

  if (homeTeam.attackRating > awayTeam.defenseRating + 8) {
    keyFactors.push(`${homeTeam.name}'s attack (${homeTeam.attackRating}) overwhelms ${awayTeam.name}'s defense (${awayTeam.defenseRating})`);
  }
  if (awayTeam.attackRating > homeTeam.defenseRating + 8) {
    keyFactors.push(`${awayTeam.name}'s attack (${awayTeam.attackRating}) threatens ${homeTeam.name}'s defense (${homeTeam.defenseRating})`);
  }

  keyFactors.push(`Expected goals: ${homeTeam.shortName} ${homeXG} xG vs ${awayTeam.shortName} ${awayXG} xG`);

  const winnerName = predictedWinner === 'home' ? homeTeam.name : predictedWinner === 'away' ? awayTeam.name : 'neither team';
  const winnerReasons = reasoningParts.length > 0 ? reasoningParts.join(', ') + ', and' : '';
  const reasoning = predictedWinner === 'draw'
    ? `This match looks very evenly matched. Both teams are closely rated in form and squad quality, making a draw the most likely outcome. The expected goals model shows a tight game with limited scoring opportunities on either side.`
    : `${winnerName} is predicted to win thanks to ${winnerReasons} home advantage and statistical modeling. Based on ${homeTeam.historicalWinRate * 100 | 0}% historical win rate for ${homeTeam.name} and season-long performance data, the xG model projects ${homeXG}-${awayXG} goals. ${awayTeam.name} will need to overcome a significant statistical deficit to get a result here.`;

  return {
    homeTeam, awayTeam, h2h,
    homeWinProbability: Math.round(finalHomeWin * 100),
    drawProbability: Math.round(finalDraw * 100),
    awayWinProbability: Math.round(finalAwayWin * 100),
    predictedWinner,
    confidence,
    predictedScore,
    keyFactors,
    reasoning,
    expectedGoals,
    bothTeamsToScore,
    over25Goals,
    riskLevel,
  };
}

export function findTeam(query: string): string | null {
  const lower = query.toLowerCase().trim();
  if (TEAM_DATABASE[lower]) return lower;
  // Partial match
  for (const key of Object.keys(TEAM_DATABASE)) {
    if (key.includes(lower) || lower.includes(key)) return key;
  }
  // Alias match
  const aliases: Record<string, string> = {
    'man city': 'manchester city', 'mcfc': 'manchester city', 'city': 'manchester city',
    'man utd': 'manchester united', 'man united': 'manchester united', 'mufc': 'manchester united', 'united': 'manchester united',
    'spurs': 'tottenham', 'thfc': 'tottenham',
    'blues': 'chelsea', 'cfc': 'chelsea',
    'gunners': 'arsenal', 'afc': 'arsenal',
    'reds': 'liverpool', 'lfc': 'liverpool',
    'barca': 'barcelona', 'fcb': 'barcelona',
    'rm': 'real madrid', 'los blancos': 'real madrid',
    'atleti': 'atletico madrid', 'atletico': 'atletico madrid',
    'bvb': 'borussia dortmund', 'dortmund': 'borussia dortmund',
    'bayern': 'bayern munich', 'fcb germany': 'bayern munich',
    'inter': 'inter milan', 'internazionale': 'inter milan',
    'milan': 'ac milan', 'rossoneri': 'ac milan',
    'juve': 'juventus', 'the old lady': 'juventus',
    'napoli': 'napoli',
    'paris': 'psg', 'saint-germain': 'psg',
    'magpies': 'newcastle', 'nufc': 'newcastle',
    'villa': 'aston villa', 'avfc': 'aston villa',
    'leipzig': 'rb leipzig',
  };
  if (aliases[lower]) return aliases[lower];
  return null;
}

// Featured upcoming matches
export const FEATURED_MATCHES = [
  { home: 'real madrid', away: 'barcelona', competition: 'El Clasico - La Liga', date: '2026-04-05' },
  { home: 'manchester city', away: 'liverpool', competition: 'Premier League', date: '2026-03-22' },
  { home: 'arsenal', away: 'manchester united', competition: 'Premier League', date: '2026-03-29' },
  { home: 'inter milan', away: 'juventus', competition: 'Derby d\'Italia - Serie A', date: '2026-04-12' },
  { home: 'bayern munich', away: 'borussia dortmund', competition: 'Der Klassiker - Bundesliga', date: '2026-04-01' },
  { home: 'real madrid', away: 'atletico madrid', competition: 'Madrid Derby - La Liga', date: '2026-04-19' },
  { home: 'psg', away: 'real madrid', competition: 'Champions League', date: '2026-03-18' },
  { home: 'barcelona', away: 'inter milan', competition: 'Champions League', date: '2026-03-25' },
  { home: 'liverpool', away: 'arsenal', competition: 'Premier League', date: '2026-04-08' },
  { home: 'ac milan', away: 'napoli', competition: 'Serie A', date: '2026-03-21' },
  { home: 'chelsea', away: 'newcastle', competition: 'Premier League', date: '2026-03-28' },
  { home: 'borussia dortmund', away: 'rb leipzig', competition: 'Bundesliga', date: '2026-03-15' },
];
