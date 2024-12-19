import React from 'react';
import type { Bet } from '../types/bet';

interface BetStatsProps {
  bets: Bet[];
}

export function BetStats({ bets }: BetStatsProps) {
  const stats = React.useMemo(() => {
    try {
      const validBets = bets.filter(bet => 
        bet.outcome && 
        typeof bet.amount === 'number' && 
        typeof bet.totalOdds === 'number' &&
        !isNaN(bet.amount) && 
        !isNaN(bet.totalOdds)
      );

      const totalBets = validBets.length;
      const wins = validBets.filter(bet => bet.outcome === 'win').length;
      const losses = validBets.filter(bet => bet.outcome === 'loss').length;
      const draws = validBets.filter(bet => bet.outcome === 'draw').length;
      const winRate = totalBets > 0 ? (wins / totalBets) * 100 : 0;

      const totalAmount = validBets.reduce((sum, bet) => sum + bet.amount, 0);
      const winnings = validBets.reduce((sum, bet) => {
        if (bet.outcome === 'win') {
          return sum + (bet.amount * bet.totalOdds);
        }
        return sum;
      }, 0);
      const profit = winnings - totalAmount;
      const roi = totalAmount > 0 ? (profit / totalAmount) * 100 : 0;

      return {
        totalBets,
        wins,
        losses,
        draws,
        winRate,
        totalAmount,
        winnings,
        profit,
        roi,
        averageBet: totalBets > 0 ? totalAmount / totalBets : 0,
      };
    } catch (error) {
      console.error('Error calculating stats:', error);
      return {
        totalBets: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winRate: 0,
        totalAmount: 0,
        winnings: 0,
        profit: 0,
        roi: 0,
        averageBet: 0,
      };
    }
  }, [bets]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Betting Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">Total Bets</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalBets}</p>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            W: {stats.wins} L: {stats.losses} D: {stats.draws}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">Win Rate</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.winRate.toFixed(1)}%
          </p>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {stats.wins} wins out of {stats.totalBets} bets
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">Total Wagered</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            ${stats.totalAmount.toFixed(2)}
          </p>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Average: ${stats.averageBet.toFixed(2)}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">Profit/Loss</h3>
          <p className={`text-3xl font-bold ${stats.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${stats.profit.toFixed(2)}
          </p>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            ROI: {stats.roi.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
} 