import React, { useMemo } from 'react';
import type { Bet } from '../types/bet';

interface BettingStatsProps {
  bets: Bet[];
}

export function BettingStats({ bets }: BettingStatsProps) {
  const stats = useMemo(() => {
    const totalBets = bets.length;
    const wins = bets.filter(bet => bet.outcome === 'win').length;
    const losses = bets.filter(bet => bet.outcome === 'loss').length;
    const draws = bets.filter(bet => bet.outcome === 'draw').length;
    const winRate = totalBets > 0 ? (wins / totalBets) * 100 : 0;
    
    const totalProfit = bets.reduce((acc, bet) => {
      if (bet.outcome === 'win') {
        return acc + (bet.amount * bet.odds);
      } else if (bet.outcome === 'loss') {
        return acc - bet.amount;
      }
      return acc;
    }, 0);

    console.log('Betting Stats:', { totalBets, wins, losses, draws, winRate, totalProfit }); // Debugging: Log betting stats

    return { totalBets, wins, losses, draws, winRate, totalProfit };
  }, [bets]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Betting Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total Bets</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalBets}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600">Wins</p>
          <p className="text-2xl font-bold text-green-700">{stats.wins}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-red-600">Losses</p>
          <p className="text-2xl font-bold text-red-700">{stats.losses}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-yellow-600">Draws</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.draws}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600">Win Rate</p>
          <p className="text-2xl font-bold text-blue-700">{stats.winRate.toFixed(1)}%</p>
        </div>
        <div className={`${stats.totalProfit >= 0 ? 'bg-green-50' : 'bg-red-50'} p-4 rounded-lg`}>
          <p className={`text-sm ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>Total Profit</p>
          <p className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            ${stats.totalProfit.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}