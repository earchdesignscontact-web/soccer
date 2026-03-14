'use client';

import { Prediction } from '@/lib/predictionEngine';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Trophy, TrendingUp, Shield, Zap, Target, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Props {
  prediction: Prediction;
  competition?: string;
  date?: string;
  isDetailed?: boolean;
}

const confidenceColor: Record<string, string> = {
  'Very High': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  'High': 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  'Medium': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  'Low': 'text-red-400 bg-red-400/10 border-red-400/30',
};

const riskColor: Record<string, string> = {
  'Low': 'text-emerald-400',
  'Medium': 'text-yellow-400',
  'High': 'text-red-400',
};

export default function PredictionCard({ prediction, competition, date, isDetailed = false }: Props) {
  const [expanded, setExpanded] = useState(isDetailed);
  const { homeTeam, awayTeam, h2h } = prediction;

  const radarData = [
    { subject: 'Attack', home: homeTeam.attackRating, away: awayTeam.attackRating },
    { subject: 'Defense', home: homeTeam.defenseRating, away: awayTeam.defenseRating },
    { subject: 'Form', home: Math.round(homeTeam.formPoints / 30 * 100), away: Math.round(awayTeam.formPoints / 30 * 100) },
    { subject: 'Squad', home: homeTeam.squadStrength, away: awayTeam.squadStrength },
    { subject: 'Big Game', home: Math.round(homeTeam.bigGameWinRate * 100), away: Math.round(awayTeam.bigGameWinRate * 100) },
    { subject: 'Prestige', home: homeTeam.europeanPrestige * 10, away: awayTeam.europeanPrestige * 10 },
  ];

  const winnerTeam = prediction.predictedWinner === 'home' ? homeTeam : prediction.predictedWinner === 'away' ? awayTeam : null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all duration-300 shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-gray-400 font-medium">{competition || 'Friendly'}</span>
        </div>
        <div className="flex items-center gap-2">
          {date && <span className="text-xs text-gray-500">{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
          <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${confidenceColor[prediction.confidence]}`}>
            {prediction.confidence} Confidence
          </span>
        </div>
      </div>

      {/* Teams + Score */}
      <div className="px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          {/* Home Team */}
          <div className={`flex-1 text-center transition-all ${prediction.predictedWinner === 'home' ? 'opacity-100' : 'opacity-70'}`}>
            <div className={`text-3xl mb-1 ${prediction.predictedWinner === 'home' ? 'grayscale-0' : 'grayscale'}`}>⚽</div>
            <div className="font-bold text-white text-sm leading-tight">{homeTeam.name}</div>
            <div className="text-xs text-gray-500 mt-0.5">{homeTeam.league}</div>
            {prediction.predictedWinner === 'home' && (
              <div className="mt-1.5 flex items-center justify-center gap-1 text-yellow-400">
                <Trophy className="w-3 h-3" />
                <span className="text-xs font-bold">PREDICTED WIN</span>
              </div>
            )}
          </div>

          {/* Score Prediction */}
          <div className="flex-shrink-0 text-center">
            <div className="bg-gray-800 rounded-xl px-4 py-3 border border-gray-700">
              <div className="text-2xl font-black text-white tracking-widest">{prediction.predictedScore}</div>
              <div className="text-xs text-gray-500 mt-1">Predicted Score</div>
            </div>
            <div className="mt-2 text-xs text-gray-600 font-medium">vs</div>
          </div>

          {/* Away Team */}
          <div className={`flex-1 text-center transition-all ${prediction.predictedWinner === 'away' ? 'opacity-100' : 'opacity-70'}`}>
            <div className={`text-3xl mb-1 ${prediction.predictedWinner === 'away' ? 'grayscale-0' : 'grayscale'}`}>⚽</div>
            <div className="font-bold text-white text-sm leading-tight">{awayTeam.name}</div>
            <div className="text-xs text-gray-500 mt-0.5">{awayTeam.league}</div>
            {prediction.predictedWinner === 'away' && (
              <div className="mt-1.5 flex items-center justify-center gap-1 text-yellow-400">
                <Trophy className="w-3 h-3" />
                <span className="text-xs font-bold">PREDICTED WIN</span>
              </div>
            )}
          </div>
        </div>

        {prediction.predictedWinner === 'draw' && (
          <div className="mt-2 text-center text-yellow-400 text-xs font-bold flex items-center justify-center gap-1">
            <Trophy className="w-3 h-3" />
            PREDICTED DRAW
          </div>
        )}
      </div>

      {/* Probability Bar */}
      <div className="px-5 pb-4">
        <div className="flex rounded-full overflow-hidden h-7">
          <div
            className="bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center text-xs font-bold text-white transition-all duration-500"
            style={{ width: `${prediction.homeWinProbability}%` }}
          >
            {prediction.homeWinProbability >= 12 && `${prediction.homeWinProbability}%`}
          </div>
          <div
            className="bg-gray-600 flex items-center justify-center text-xs font-bold text-white transition-all duration-500"
            style={{ width: `${prediction.drawProbability}%` }}
          >
            {prediction.drawProbability >= 10 && `${prediction.drawProbability}%`}
          </div>
          <div
            className="bg-gradient-to-l from-red-600 to-red-500 flex items-center justify-center text-xs font-bold text-white transition-all duration-500"
            style={{ width: `${prediction.awayWinProbability}%` }}
          >
            {prediction.awayWinProbability >= 12 && `${prediction.awayWinProbability}%`}
          </div>
        </div>
        <div className="flex justify-between mt-1.5 text-xs text-gray-500">
          <span className="text-blue-400 font-medium">{homeTeam.shortName} Win</span>
          <span>Draw</span>
          <span className="text-red-400 font-medium">{awayTeam.shortName} Win</span>
        </div>
      </div>

      {/* Betting Markets Quick View */}
      <div className="px-5 pb-4 grid grid-cols-3 gap-2">
        <div className={`rounded-lg px-2 py-2 text-center border ${prediction.over25Goals ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-gray-800 border-gray-700'}`}>
          <div className={`text-xs font-bold ${prediction.over25Goals ? 'text-emerald-400' : 'text-gray-500'}`}>Over 2.5</div>
          <div className={`text-xs mt-0.5 ${prediction.over25Goals ? 'text-emerald-300' : 'text-gray-600'}`}>{prediction.over25Goals ? '✓ Likely' : '✗ Unlikely'}</div>
        </div>
        <div className={`rounded-lg px-2 py-2 text-center border ${prediction.bothTeamsToScore ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-gray-800 border-gray-700'}`}>
          <div className={`text-xs font-bold ${prediction.bothTeamsToScore ? 'text-emerald-400' : 'text-gray-500'}`}>BTTS</div>
          <div className={`text-xs mt-0.5 ${prediction.bothTeamsToScore ? 'text-emerald-300' : 'text-gray-600'}`}>{prediction.bothTeamsToScore ? '✓ Yes' : '✗ No'}</div>
        </div>
        <div className={`rounded-lg px-2 py-2 text-center border bg-gray-800 border-gray-700`}>
          <div className={`text-xs font-bold ${riskColor[prediction.riskLevel]}`}>Risk</div>
          <div className={`text-xs mt-0.5 ${riskColor[prediction.riskLevel]}`}>{prediction.riskLevel}</div>
        </div>
      </div>

      {/* Expand Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-2 py-2.5 border-t border-gray-800 text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 transition-all"
      >
        {expanded ? <><ChevronUp className="w-3.5 h-3.5" />Less Details</> : <><ChevronDown className="w-3.5 h-3.5" />Full Analysis</>}
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-800 bg-gray-950/50">
          {/* Form */}
          <div className="px-5 py-4 grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Recent Form - {homeTeam.shortName}</div>
              <div className="flex gap-1">
                {homeTeam.formResults.slice(-5).map((r, i) => (
                  <span key={i} className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold ${r === 'W' ? 'bg-emerald-500/20 text-emerald-400' : r === 'D' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{r}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Recent Form - {awayTeam.shortName}</div>
              <div className="flex gap-1">
                {awayTeam.formResults.slice(-5).map((r, i) => (
                  <span key={i} className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold ${r === 'W' ? 'bg-emerald-500/20 text-emerald-400' : r === 'D' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{r}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="px-5 py-2">
            <div className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">Team Comparison</div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                  <Radar name={homeTeam.shortName} dataKey="home" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
                  <Radar name={awayTeam.shortName} dataKey="away" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} />
                  <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 justify-center mt-2">
              <div className="flex items-center gap-1.5 text-xs text-blue-400"><div className="w-3 h-0.5 bg-blue-400 rounded" />{homeTeam.shortName}</div>
              <div className="flex items-center gap-1.5 text-xs text-red-400"><div className="w-3 h-0.5 bg-red-400 rounded" />{awayTeam.shortName}</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="px-5 py-4 grid grid-cols-3 gap-2 text-center">
            <div className="bg-gray-900 rounded-xl p-3">
              <div className="text-xs text-gray-500 mb-1">xG</div>
              <div className="text-base font-bold text-white">{prediction.expectedGoals.home}</div>
              <div className="text-xs text-gray-600">vs {prediction.expectedGoals.away}</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-3">
              <div className="text-xs text-gray-500 mb-1">H2H</div>
              <div className="text-base font-bold text-white">{h2h.team1Wins}-{h2h.draws}-{h2h.team2Wins}</div>
              <div className="text-xs text-gray-600">W-D-W</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-3">
              <div className="text-xs text-gray-500 mb-1">Avg Goals</div>
              <div className="text-base font-bold text-white">{h2h.avgGoals}</div>
              <div className="text-xs text-gray-600">per game</div>
            </div>
          </div>

          {/* Key Factors */}
          <div className="px-5 py-4 border-t border-gray-800">
            <div className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />Key Factors
            </div>
            <ul className="space-y-2">
              {prediction.keyFactors.map((factor, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                  {factor}
                </li>
              ))}
            </ul>
          </div>

          {/* Reasoning */}
          <div className="px-5 py-4 border-t border-gray-800">
            <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />AI Analysis
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{prediction.reasoning}</p>
          </div>

          {/* Season Stats */}
          <div className="px-5 py-4 border-t border-gray-800 grid grid-cols-2 gap-4">
            {[homeTeam, awayTeam].map((team, idx) => (
              <div key={idx}>
                <div className="text-xs text-gray-500 mb-2 font-medium">{team.shortName} Season</div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Record</span>
                    <span className="text-white font-medium">{team.seasonWins}W {team.seasonDraws}D {team.seasonLosses}L</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Goals For</span>
                    <span className="text-emerald-400 font-medium">{team.goalsScored}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Goals Against</span>
                    <span className="text-red-400 font-medium">{team.goalsConceded}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Attack</span>
                    <span className="text-blue-400 font-medium">{team.attackRating}/100</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Defense</span>
                    <span className="text-purple-400 font-medium">{team.defenseRating}/100</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
