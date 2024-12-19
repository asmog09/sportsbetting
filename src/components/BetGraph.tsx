import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { Bet } from '../types/bet';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BetGraphProps {
  bets: Bet[];
}

export function BetGraph({ bets }: BetGraphProps) {
  const isDarkMode = document.documentElement.classList.contains('dark');

  const validBets = React.useMemo(() => {
    return bets.filter(bet => 
      bet.date && 
      bet.outcome && 
      typeof bet.amount === 'number' && 
      typeof bet.totalOdds === 'number' &&
      !isNaN(bet.amount) && 
      !isNaN(bet.totalOdds)
    );
  }, [bets]);

  const sortedBets = React.useMemo(() => {
    return [...validBets].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [validBets]);

  const data = React.useMemo(() => {
    let runningProfit = 0;
    const profitData = sortedBets.map(bet => {
      try {
        const profit = bet.outcome === 'win' 
          ? bet.amount * bet.totalOdds - bet.amount
          : -bet.amount;
        runningProfit += profit;
        return runningProfit;
      } catch (error) {
        console.error('Error calculating profit for bet:', bet, error);
        return runningProfit;
      }
    });

    const labels = sortedBets.map(bet => {
      try {
        return new Date(bet.date).toLocaleDateString();
      } catch (error) {
        console.error('Error formatting date for bet:', bet, error);
        return 'Invalid Date';
      }
    });

    return {
      labels,
      datasets: [
        {
          label: 'Profit/Loss ($)',
          data: profitData,
          borderColor: isDarkMode ? 'rgb(96, 165, 250)' : 'rgb(59, 130, 246)',
          backgroundColor: isDarkMode ? 'rgba(96, 165, 250, 0.5)' : 'rgba(59, 130, 246, 0.5)',
          tension: 0.1,
        },
      ],
    };
  }, [sortedBets, isDarkMode]);

  const options = React.useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDarkMode ? '#e5e7eb' : '#374151',
        },
      },
      title: {
        display: true,
        text: 'Betting Performance Over Time',
        color: isDarkMode ? '#e5e7eb' : '#374151',
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `$${context.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: (value: number) => `$${value.toFixed(2)}`,
          color: isDarkMode ? '#e5e7eb' : '#374151',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDarkMode ? '#e5e7eb' : '#374151',
        },
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  }), [isDarkMode]);

  if (validBets.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Performance Graph</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          {bets.length === 0 ? 'No betting data available yet.' : 'No valid betting data to display.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Performance Graph</h2>
      <div className="h-[400px]">
        <Line options={options} data={data} />
      </div>
    </div>
  );
} 