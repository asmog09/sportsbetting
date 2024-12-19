import type { OddsFormat } from '../types/bet';

export function convertOdds(odds: number, from: OddsFormat, to: OddsFormat): number {
  // First convert to decimal
  let decimal = odds;
  if (from === 'american') {
    decimal = odds > 0 ? (odds / 100) + 1 : (100 / Math.abs(odds)) + 1;
  } else if (from === 'fractional') {
    const [num, den] = odds.toString().split('/').map(Number);
    decimal = (num / den) + 1;
  }

  // Then convert to target format
  if (to === 'decimal') {
    return Number(decimal.toFixed(2));
  } else if (to === 'american') {
    return decimal >= 2
      ? Number(((decimal - 1) * 100).toFixed(0))
      : Number((-100 / (decimal - 1)).toFixed(0));
  } else {
    // Fractional odds are returned as a string in "X/Y" format
    const fracOdds = decimalToFraction(decimal - 1);
    return Number(fracOdds.replace('/', '.'));
  }
}

function decimalToFraction(decimal: number): string {
  const precision = 0.0001;
  let numerator = 1;
  let denominator = 1;
  let error = decimal - numerator / denominator;

  while (Math.abs(error) > precision) {
    if (error > 0) {
      numerator++;
    } else {
      denominator++;
    }
    error = decimal - numerator / denominator;
  }

  return `${numerator}/${denominator}`;
}

export function calculateKellyCriterion(
  probability: number,
  odds: number,
  format: OddsFormat = 'decimal'
): number {
  const decimalOdds = format === 'decimal' ? odds : convertOdds(odds, format, 'decimal');
  const q = 1 - probability;
  const b = decimalOdds - 1;
  
  const kelly = (b * probability - q) / b;
  return Math.max(0, Math.min(1, kelly));
}

export function calculateParleyOdds(odds: number[]): number {
  return odds.reduce((total, odd) => total * odd, 1);
}

export function calculatePotentialWinnings(stake: number, odds: number): number {
  return stake * odds;
}

export function calculateROI(totalWinnings: number, totalStake: number): number {
  if (totalStake === 0) return 0;
  return ((totalWinnings - totalStake) / totalStake) * 100;
}

export function formatOdds(odds: number, format: OddsFormat): string {
  const converted = convertOdds(odds, 'decimal', format);
  
  switch (format) {
    case 'american':
      return converted > 0 ? `+${converted}` : converted.toString();
    case 'fractional':
      return converted.toString().replace('.', '/');
    default:
      return converted.toFixed(2);
  }
}

export function calculateWinProbability(odds: number, format: OddsFormat = 'decimal'): number {
  const decimalOdds = format === 'decimal' ? odds : convertOdds(odds, format, 'decimal');
  return 1 / decimalOdds;
} 