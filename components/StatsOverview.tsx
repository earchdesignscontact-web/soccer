'use client';

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { TrendingUp, Trophy, Target, Activity } from 'lucide-react';

interface FeaturedMatch {
  home: string;
  away: string;
  competition: string;
  date: string;
  prediction: {
    homeWinProbability: number;
    drawProbability: number;
    awayWinProbability: number;
    predictedWinner: string;
    confidence: string;
    predictedScore: string;
    homeTeam: { name: string; shortName: string };
    awayTeam: { name: string; shortName: string };
  };
}

interface Props {
  matches: FeaturedMatch[];
}

export default function StatsOverview({ matches }: Props) {
  const homeWins = matches.filter(m => m.prediction?.predictedWinner === 'home').length;
  const awayWins = matches.filter(m => m.prediction?.predictedWinner === 'away').length;
  const draws = matches.filter(m => m.prediction?.predictedWinner === 'draw').length;
  const highConf = matches.filter(m => m.prediction?.confidence === 'High' || m.prediction?.confidence === 'Very High').length;

  const outcomeData = [
    { name: 'Home Win', value: homeWins, color: '#3B82F6' },
    { name: 'Draw', value: draws, color: '#6B7280' },
    { name: 'Away Win', value: awayWins, color: '#EF4444' },
  ];

  const stats = [
    { label: 'Games Analyzed', value: matches.length, icon: <Activity className="w-4 h-4" />, color: 'text-blue-400' },
    { label: 'Home Wins Predicted', value: homeWins, icon: <Trophy className="w-4 h-4" />, color: 'text-emerald-400' },
    { label: 'High Confidence', value: highConf, icon: <Target className="w-4 h-4" />, color: 'text-yellow-400' },
    { label: 'Draws Predicted', value: draws, icon: <TrendingUp className="w-4 h-4" />, color: 'text-purple-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {stats.map((s, i) => (
        <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
          <div className={`${s.color} opacity-80`}>{s.icon}</div>
          <div>
            <div className="text-2xl font-black text-white">{s.value}</div>
            <div className="text-xs text-gray-500 leading-tight">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
