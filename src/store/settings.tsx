import React from 'react';
import type { BankrollSettings, OddsFormat } from '../types/bet';

interface Settings {
  theme: 'light' | 'dark';
  oddsFormat: OddsFormat;
  bankroll: BankrollSettings;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  updateBankroll: (bankroll: Partial<BankrollSettings>) => void;
  toggleTheme: () => void;
  changeOddsFormat: (format: OddsFormat) => void;
}

const defaultSettings: Settings = {
  theme: 'light',
  oddsFormat: 'decimal',
  bankroll: {
    totalBankroll: 1000,
    unitSize: 10,
    maxBetSize: 100,
    stopLoss: -200,
    stopWin: 500
  }
};

export const SettingsContext = React.createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  updateBankroll: () => {},
  toggleTheme: () => {},
  changeOddsFormat: () => {}
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<Settings>(() => {
    const savedSettings = localStorage.getItem('settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  React.useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
    
    // Apply theme
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateBankroll = (bankroll: Partial<BankrollSettings>) => {
    setSettings(prev => ({
      ...prev,
      bankroll: { ...prev.bankroll, ...bankroll }
    }));
  };

  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  const changeOddsFormat = (format: OddsFormat) => {
    setSettings(prev => ({ ...prev, oddsFormat: format }));
  };

  const contextValue = {
    settings,
    updateSettings,
    updateBankroll,
    toggleTheme,
    changeOddsFormat
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
} 