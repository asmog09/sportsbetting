import React from 'react';
import { BetForm } from './components/BetForm';
import { BetHistory } from './components/BetHistory';
import { BetStats } from './components/BetStats';
import { BetGraph } from './components/BetGraph';
import { Logo } from './components/Logo';
import { SettingsProvider } from './store/settings';
import { Sun, Moon } from 'lucide-react';
import type { Bet } from './types/bet';
import { v4 as uuidv4 } from 'uuid';

function useBets() {
  const [bets, setBets] = React.useState<Bet[]>(() => {
    const savedBets = localStorage.getItem('bets');
    console.log('Loaded Bets:', savedBets); // Debugging: Log loaded bets
    return savedBets ? JSON.parse(savedBets) : [];
  });

  React.useEffect(() => {
    localStorage.setItem('bets', JSON.stringify(bets));
  }, [bets]);

  const addBet = (newBet: Omit<Bet, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const betWithId = {
      ...newBet,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    };
    setBets(prevBets => [...prevBets, betWithId]);
  };

  const deleteBet = (id: string) => {
    setBets(prevBets => prevBets.filter(bet => bet.id !== id));
  };

  const clearAllBets = () => {
    if (window.confirm('Are you sure you want to clear all betting history? This cannot be undone.')) {
      setBets([]);
    }
  };

  return {
    bets,
    addBet,
    deleteBet,
    clearAllBets,
  };
}

function App() {
  const {
    bets,
    addBet,
    deleteBet,
    clearAllBets,
  } = useBets();

  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <SettingsProvider>
      <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
        <nav className="bg-white shadow-md dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <Logo />
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isDarkMode ? <Sun className="text-white" /> : <Moon />}
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <BetForm onSubmit={addBet} />
          <BetStats bets={bets} />
          <BetGraph bets={bets} />
          <BetHistory
            bets={bets}
            onDeleteBet={deleteBet}
            onClearAll={clearAllBets}
          />
        </main>

        <footer className="bg-white dark:bg-gray-800 shadow-md mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} MMA Bet Tracker. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </SettingsProvider>
  );
}

export default App;