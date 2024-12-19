import React, { useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import type { Bet } from '../types/bet';

interface BetHistoryProps {
  bets: Bet[];
  onDeleteBet: (id: string) => void;
  onClearAll: () => void;
}

export function BetHistory({ bets, onDeleteBet, onClearAll }: BetHistoryProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Betting History</h2>
        {bets.length > 0 && (
          <button
            onClick={onClearAll}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Clear All History
          </button>
        )}
      </div>
      
      {bets.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No betting history yet.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fights</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Odds</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags & Notes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bets.map((bet) => {
              console.log('Bet:', bet);
              return (
                <tr key={bet.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(bet.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bet.type.charAt(0).toUpperCase() + bet.type.slice(1)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="space-y-2">
                      {bet.fights.map((fight, index) => (
                        <div key={index} className="border-b last:border-b-0 pb-2 last:pb-0">
                          <div className="font-medium">{fight.event}</div>
                          <div className="text-gray-600">
                            {fight.fighter1} vs {fight.fighter2}
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-600">Pick: {fight.selectedFighter}</span>
                            <span className="text-gray-500">Odds: {fight.odds}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${bet.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {bet.totalOdds.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        bet.outcome === 'win'
                          ? 'bg-green-100 text-green-800'
                          : bet.outcome === 'loss'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {bet.outcome.charAt(0).toUpperCase() + bet.outcome.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="space-y-2">
                      {bet.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {bet.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {bet.notes && (
                        <div className="text-gray-600 text-sm">
                          <p className="italic">{bet.notes}</p>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onDeleteBet(bet.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}