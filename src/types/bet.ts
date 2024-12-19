export type BetCategory = 'UFC' | 'Bellator' | 'ONE' | 'PFL' | 'Other';
export type BetStatus = 'pending' | 'completed';
export type BetTag = 'knockout' | 'submission' | 'decision' | 'distance' | 'round_betting' | 'prop';
export type OddsFormat = 'decimal' | 'american' | 'fractional';

export interface Fight {
  fighter1: string;
  fighter2: string;
  selectedFighter: string;
  odds: number;
  event: string;
  expectedOutcome?: BetTag;
  weightClass?: string;
}

export interface Bet {
  id: string;
  type: 'straight' | 'parlay';
  fights: Fight[];
  outcome: 'win' | 'loss' | 'draw';
  amount: number;
  totalOdds: number;
  date: string;
  category: BetCategory;
  status: BetStatus;
  tags: BetTag[];
  notes?: string;
  units?: number;
  oddsFormat: OddsFormat;
  createdAt: string;
  updatedAt: string;
}

export interface BankrollSettings {
  totalBankroll: number;
  unitSize: number;
  maxBetSize: number;
  stopLoss: number;
  stopWin: number;
}

export interface BetStats {
  totalBets: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  totalAmount: number;
  totalWinnings: number;
  profit: number;
  roi: number;
  averageBetSize: number;
  biggestWin: number;
  biggestLoss: number;
  currentStreak: number;
  longestWinStreak: number;
  longestLossStreak: number;
  profitByCategory: Record<BetCategory, number>;
  winRateByTag: Record<BetTag, number>;
}

export type BetOutcome = 'win' | 'loss' | 'draw';