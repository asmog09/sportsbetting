import React, { useState, useContext } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { Bet, Fight, BetCategory, BetTag, BetStatus, BetOutcome } from '../types/bet';
import { SettingsContext } from '../store/settings';

interface BetFormProps {
  onSubmit: (bet: Omit<Bet, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function BetForm({ onSubmit }: BetFormProps) {
  const { settings } = useContext(SettingsContext);
  const [betType, setBetType] = useState<'straight' | 'parlay'>('straight');
  const [fights, setFights] = useState<Omit<Fight, 'odds'>[]>([{
    fighter1: '',
    fighter2: '',
    selectedFighter: '',
    event: '',
  }]);
  const [amount, setAmount] = useState('');
  const [odds, setOdds] = useState<string[]>(['']);
  const [outcome, setOutcome] = useState<BetOutcome>('win');
  const [category, setCategory] = useState<BetCategory>('UFC');
  const [tags, setTags] = useState<BetTag[]>([]);
  const [notes, setNotes] = useState('');

  const addFight = () => {
    setFights([...fights, {
      fighter1: '',
      fighter2: '',
      selectedFighter: '',
      event: '',
    }]);
    setOdds([...odds, '']);
  };

  const removeFight = (index: number) => {
    const newFights = [...fights];
    newFights.splice(index, 1);
    setFights(newFights);

    const newOdds = [...odds];
    newOdds.splice(index, 1);
    setOdds(newOdds);
  };

  const updateFight = (index: number, field: keyof Omit<Fight, 'odds'>, value: string) => {
    const newFights = [...fights];
    newFights[index] = { ...newFights[index], [field]: value };
    setFights(newFights);
  };

  const calculateTotalOdds = (): number => {
    if (betType === 'straight') return Number(odds[0]);
    
    let totalOdds = 1;
    odds.forEach(odd => {
      if (odd) totalOdds *= Number(odd);
    });
    return totalOdds;
  };

  const toggleTag = (tag: BetTag) => {
    setTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!amount || Number(amount) <= 0) {
      alert('Please enter a valid bet amount');
      return;
    }

    if (odds.some(odd => !odd || Number(odd) <= 0)) {
      alert('Please enter valid odds for all fights');
      return;
    }

    const fightsWithOdds: Fight[] = fights.map((fight, index) => ({
      ...fight,
      odds: Number(odds[index]),
    }));

    const newBet: Omit<Bet, 'id' | 'createdAt' | 'updatedAt'> = {
      type: betType,
      fights: fightsWithOdds,
      amount: Number(amount),
      totalOdds: calculateTotalOdds(),
      outcome,
      date: new Date().toISOString(),
      category,
      status: 'pending' as BetStatus,
      tags,
      notes,
      oddsFormat: settings.oddsFormat,
      units: Number(amount) / settings.bankroll.unitSize,
    };

    try {
      onSubmit(newBet);
      
      // Reset form
      setBetType('straight');
      setFights([{
        fighter1: '',
        fighter2: '',
        selectedFighter: '',
        event: '',
      }]);
      setAmount('');
      setOdds(['']);
      setOutcome('win');
      setCategory('UFC');
      setTags([]);
      setNotes('');
    } catch (error) {
      console.error('Error submitting bet:', error);
      alert('There was an error submitting your bet. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Record New Bet</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bet Type</label>
          <select
            value={betType}
            onChange={(e) => setBetType(e.target.value as 'straight' | 'parlay')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="straight">Straight</option>
            <option value="parlay">Parlay</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as BetCategory)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="UFC">UFC</option>
            <option value="Bellator">Bellator</option>
            <option value="ONE">ONE</option>
            <option value="PFL">PFL</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
        <div className="flex flex-wrap gap-2">
          {['knockout', 'submission', 'decision', 'distance', 'round_betting', 'prop'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag as BetTag)}
              className={`px-3 py-1 rounded-full text-sm ${
                tags.includes(tag as BetTag)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {fights.map((fight, index) => (
        <div key={index} className="mb-6 p-4 border rounded-lg dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Fight {index + 1}</h3>
            {betType === 'parlay' && fights.length > 1 && (
              <button
                type="button"
                onClick={() => removeFight(index)}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fighter 1</label>
              <input
                type="text"
                value={fight.fighter1}
                onChange={(e) => updateFight(index, 'fighter1', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fighter 2</label>
              <input
                type="text"
                value={fight.fighter2}
                onChange={(e) => updateFight(index, 'fighter2', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Selected Fighter</label>
              <select
                value={fight.selectedFighter}
                onChange={(e) => updateFight(index, 'selectedFighter', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                required
              >
                <option value="">Select Fighter</option>
                {fight.fighter1 && <option value={fight.fighter1}>{fight.fighter1}</option>}
                {fight.fighter2 && <option value={fight.fighter2}>{fight.fighter2}</option>}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Event Name</label>
              <input
                type="text"
                value={fight.event}
                onChange={(e) => updateFight(index, 'event', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Odds</label>
              <input
                type="number"
                value={odds[index]}
                onChange={(e) => {
                  const newOdds = [...odds];
                  newOdds[index] = e.target.value;
                  setOdds(newOdds);
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                required
                step="0.01"
              />
            </div>
          </div>
        </div>
      ))}

      {betType === 'parlay' && (
        <button
          type="button"
          onClick={addFight}
          className="mb-6 w-full flex justify-center items-center gap-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          <PlusCircle size={20} />
          Add Another Fight
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bet Amount ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            required
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Outcome</label>
          <select
            value={outcome}
            onChange={(e) => setOutcome(e.target.value as BetOutcome)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            required
          >
            <option value="win">Win</option>
            <option value="loss">Loss</option>
            <option value="draw">Draw</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          rows={3}
        />
      </div>

      <div className="mt-4 text-right">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Total Odds: {calculateTotalOdds().toFixed(2)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Units: {(Number(amount) / settings.bankroll.unitSize).toFixed(1)}
        </p>
      </div>

      <button
        type="submit"
        className="mt-6 w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        <PlusCircle size={20} />
        Add {betType === 'parlay' ? 'Parlay' : 'Bet'}
      </button>
    </form>
  );
}