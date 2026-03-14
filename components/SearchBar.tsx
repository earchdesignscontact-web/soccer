'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';

interface Team {
  name: string;
  league: string;
  country: string;
  shortName: string;
}

interface Props {
  onSearch: (home: string, away: string) => void;
  isLoading: boolean;
}

const QUICK_MATCHUPS = [
  { home: 'Real Madrid', away: 'Barcelona', label: 'El Clasico' },
  { home: 'Manchester City', away: 'Liverpool', label: 'Man City vs Liverpool' },
  { home: 'Bayern Munich', away: 'Borussia Dortmund', label: 'Der Klassiker' },
  { home: 'Inter Milan', away: 'Juventus', label: 'Derby d\'Italia' },
  { home: 'PSG', away: 'Real Madrid', label: 'UCL Classic' },
  { home: 'Arsenal', away: 'Manchester United', label: 'North London vs Red Devils' },
];

export default function SearchBar({ onSearch, isLoading }: Props) {
  const [homeInput, setHomeInput] = useState('');
  const [awayInput, setAwayInput] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeField, setActiveField] = useState<'home' | 'away' | null>(null);
  const [suggestions, setSuggestions] = useState<Team[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/teams').then(r => r.json()).then(d => setTeams(d.teams || []));
  }, []);

  useEffect(() => {
    const query = activeField === 'home' ? homeInput : awayInput;
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }
    const filtered = teams.filter(t =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.shortName.toLowerCase().includes(query.toLowerCase()) ||
      t.league.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 6);
    setSuggestions(filtered);
  }, [homeInput, awayInput, activeField, teams]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveField(null);
        setSuggestions([]);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSuggestionClick = (team: Team) => {
    if (activeField === 'home') setHomeInput(team.name);
    else setAwayInput(team.name);
    setSuggestions([]);
    setActiveField(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (homeInput.trim() && awayInput.trim()) {
      onSearch(homeInput.trim(), awayInput.trim());
    }
  };

  const handleQuickMatch = (home: string, away: string) => {
    setHomeInput(home);
    setAwayInput(away);
    onSearch(home, away);
  };

  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 focus-within:border-blue-500/50 transition-colors">
          <div className="flex items-center gap-3">
            {/* Home Team Input */}
            <div className="flex-1 relative">
              <div className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Home Team</div>
              <div className="relative">
                <input
                  type="text"
                  value={homeInput}
                  onChange={e => setHomeInput(e.target.value)}
                  onFocus={() => setActiveField('home')}
                  placeholder="e.g. Real Madrid"
                  className="w-full bg-gray-800 text-white placeholder-gray-600 rounded-xl px-3 py-2.5 text-sm outline-none border border-gray-700 focus:border-blue-500/50 transition-colors pr-7"
                />
                {homeInput && (
                  <button type="button" onClick={() => setHomeInput('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* VS Divider */}
            <div className="flex-shrink-0 mt-6">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold text-gray-500 border border-gray-700">vs</div>
            </div>

            {/* Away Team Input */}
            <div className="flex-1 relative">
              <div className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Away Team</div>
              <div className="relative">
                <input
                  type="text"
                  value={awayInput}
                  onChange={e => setAwayInput(e.target.value)}
                  onFocus={() => setActiveField('away')}
                  placeholder="e.g. Barcelona"
                  className="w-full bg-gray-800 text-white placeholder-gray-600 rounded-xl px-3 py-2.5 text-sm outline-none border border-gray-700 focus:border-blue-500/50 transition-colors pr-7"
                />
                {awayInput && (
                  <button type="button" onClick={() => setAwayInput('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Search Button */}
            <div className="flex-shrink-0 mt-6">
              <button
                type="submit"
                disabled={isLoading || !homeInput.trim() || !awayInput.trim()}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm font-medium transition-all"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Predict
              </button>
            </div>
          </div>
        </div>

        {/* Autocomplete Dropdown */}
        {suggestions.length > 0 && activeField && (
          <div className="absolute z-50 left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-2xl">
            {suggestions.map((team, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSuggestionClick(team)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors text-left"
              >
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-xs font-bold text-gray-400 flex-shrink-0">{team.shortName}</div>
                <div>
                  <div className="text-sm text-white font-medium">{team.name}</div>
                  <div className="text-xs text-gray-500">{team.league} · {team.country}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 ml-auto" />
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Quick Matchups */}
      <div className="mt-4">
        <div className="text-xs text-gray-600 mb-2.5 text-center font-medium uppercase tracking-wider">Quick Matchups</div>
        <div className="flex flex-wrap gap-2 justify-center">
          {QUICK_MATCHUPS.map((m, i) => (
            <button
              key={i}
              onClick={() => handleQuickMatch(m.home, m.away)}
              className="text-xs bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 rounded-full px-3 py-1.5 transition-all"
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
