'use client';

import { useState, useEffect } from 'react';
import { Activity, TrendingUp, Zap, RefreshCw } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import PredictionCard from '@/components/PredictionCard';
import StatsOverview from '@/components/StatsOverview';
import { Prediction } from '@/lib/predictionEngine';

interface FeaturedMatch {
  home: string;
  away: string;
  competition: string;
  date: string;
  prediction: Prediction;
}

export default function Home() {
  const [featuredMatches, setFeaturedMatches] = useState<FeaturedMatch[]>([]);
  const [searchResult, setSearchResult] = useState<{ prediction: Prediction; home: string; away: string } | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'featured' | 'search'>('featured');

  const loadFeatured = () => {
    setIsLoading(true);
    fetch('/api/predict')
      .then(r => r.json())
      .then(d => {
        setFeaturedMatches(d.featured || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => { loadFeatured(); }, []);

  const handleSearch = async (home: string, away: string) => {
    setIsSearching(true);
    setSearchError(null);
    setSearchResult(null);
    setActiveTab('search');
    try {
      const res = await fetch(`/api/predict?home=${encodeURIComponent(home)}&away=${encodeURIComponent(away)}`);
      const data = await res.json();
      if (!res.ok) {
        setSearchError(data.error || 'Something went wrong');
      } else {
        setSearchResult({ prediction: data.prediction, home, away });
      }
    } catch {
      setSearchError('Failed to fetch prediction. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-lg">
              ⚽
            </div>
            <div>
              <div className="font-black text-white text-lg leading-none">Soccer Prophet</div>
              <div className="text-xs text-gray-500">AI-powered match predictions</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400">Live Model Active</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-xs text-blue-400 font-medium mb-5">
            <Zap className="w-3.5 h-3.5" />
            Powered by multi-factor statistical modeling
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
            Who&apos;s Winning{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              Tonight?
            </span>
          </h1>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Enter any match and get an instant prediction with squad strength, current form,
            head-to-head records, xG models, and years of historical data.
          </p>
        </div>

        {/* Search */}
        <div className="mb-10">
          <SearchBar onSearch={handleSearch} isLoading={isSearching} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit mx-auto">
          <button
            onClick={() => setActiveTab('featured')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'featured' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Featured Matches
              <span className="bg-gray-800 text-gray-400 text-xs rounded-full px-2 py-0.5">
                {featuredMatches.length}
              </span>
            </div>
          </button>
          {(searchResult || searchError || isSearching) && (
            <button
              onClick={() => setActiveTab('search')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'search' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Your Prediction
                {searchResult && <div className="w-2 h-2 bg-emerald-400 rounded-full" />}
              </div>
            </button>
          )}
        </div>

        {/* Search Tab Content */}
        {activeTab === 'search' && (
          <div className="max-w-2xl mx-auto mb-8">
            {isSearching && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                <div className="text-gray-500 text-sm">Analyzing match data...</div>
              </div>
            )}
            {searchError && !isSearching && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
                <div className="text-red-400 font-medium mb-1">Team Not Found</div>
                <div className="text-sm text-gray-500">{searchError}</div>
                <div className="mt-4 text-xs text-gray-600">
                  Try: Real Madrid, Barcelona, Manchester City, Liverpool, Bayern Munich, PSG, Inter Milan, Juventus...
                </div>
              </div>
            )}
            {searchResult && !isSearching && (
              <div>
                <div className="text-xs text-gray-500 mb-4 text-center font-medium uppercase tracking-wider">
                  Your Custom Prediction
                </div>
                <PredictionCard
                  prediction={searchResult.prediction}
                  competition="Custom Match"
                  isDetailed={true}
                />
              </div>
            )}
          </div>
        )}

        {/* Featured Tab Content */}
        {activeTab === 'featured' && (
          <>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                <div className="text-gray-500 text-sm">Loading predictions...</div>
              </div>
            ) : (
              <>
                <StatsOverview matches={featuredMatches} />

                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Upcoming Featured Games
                  </h2>
                  <button
                    onClick={loadFeatured}
                    className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-400 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {featuredMatches.map((match, i) => (
                    <PredictionCard
                      key={i}
                      prediction={match.prediction}
                      competition={match.competition}
                      date={match.date}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Bottom Info */}
        <div className="mt-16 border-t border-gray-800 pt-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: '📊', title: 'Historical Data', desc: 'Years of match records and outcomes' },
            { icon: '🎯', title: 'xG Model', desc: 'Expected goals per team per game' },
            { icon: '🔥', title: 'Current Form', desc: 'Last 10 matches weighted analysis' },
            { icon: '🏆', title: 'H2H Records', desc: 'Head-to-head history between clubs' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="text-2xl">{item.icon}</div>
              <div className="text-sm font-semibold text-gray-300">{item.title}</div>
              <div className="text-xs text-gray-600">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
