// Currency and Metal Price Types
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', flag: '🇧🇩' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', flag: '🇵🇰' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
];

export interface MetalPrice {
  gold: number; // per gram
  silver: number; // per gram
  lastUpdated: Date;
}

// Zakat Asset Categories
export interface ZakatAssets {
  cash: number;
  bankBalance: number;
  goldGrams: number;
  silverGrams: number;
  investments: number;
  shares: number;
  businessAssets: number;
  otherWealth: number;
  debts: number;
}

export interface ZakatCalculation {
  totalAssets: number;
  totalDeductions: number;
  netWorth: number;
  nisabGold: number;
  nisabSilver: number;
  isEligible: boolean;
  zakatAmount: number;
  breakdown: ZakatBreakdown;
}

export interface ZakatBreakdown {
  cash: number;
  bank: number;
  gold: number;
  silver: number;
  investments: number;
  shares: number;
  business: number;
  other: number;
  debts: number;
}

// Nisab threshold constants (in grams)
export const NISAB = {
  GOLD_GRAMS: 87.48, // ~7.5 tola
  SILVER_GRAMS: 612.36, // ~52.5 tola
};

export const ZAKAT_RATE = 0.025; // 2.5%

// Calculate Zakat
export function calculateZakat(
  assets: ZakatAssets,
  metalPrices: MetalPrice,
  currency: Currency
): ZakatCalculation {
  const goldValue = assets.goldGrams * metalPrices.gold;
  const silverValue = assets.silverGrams * metalPrices.silver;
  
  const totalAssets = 
    assets.cash +
    assets.bankBalance +
    goldValue +
    silverValue +
    assets.investments +
    assets.shares +
    assets.businessAssets +
    assets.otherWealth;
  
  const totalDeductions = assets.debts;
  const netWorth = totalAssets - totalDeductions;
  
  // Calculate Nisab thresholds
  const nisabGold = NISAB.GOLD_GRAMS * metalPrices.gold;
  const nisabSilver = NISAB.SILVER_GRAMS * metalPrices.silver;
  
  // Use silver nisab (lower threshold, more conservative)
  const isEligible = netWorth >= nisabSilver;
  const zakatAmount = isEligible ? netWorth * ZAKAT_RATE : 0;
  
  return {
    totalAssets,
    totalDeductions,
    netWorth,
    nisabGold,
    nisabSilver,
    isEligible,
    zakatAmount,
    breakdown: {
      cash: assets.cash * ZAKAT_RATE,
      bank: assets.bankBalance * ZAKAT_RATE,
      gold: goldValue * ZAKAT_RATE,
      silver: silverValue * ZAKAT_RATE,
      investments: assets.investments * ZAKAT_RATE,
      shares: assets.shares * ZAKAT_RATE,
      business: assets.businessAssets * ZAKAT_RATE,
      other: assets.otherWealth * ZAKAT_RATE,
      debts: -assets.debts * ZAKAT_RATE,
    },
  };
}

// Format currency
export function formatCurrency(amount: number, currency: Currency): string {
  return `${currency.symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// Get default assets
export function getDefaultAssets(): ZakatAssets {
  return {
    cash: 0,
    bankBalance: 0,
    goldGrams: 0,
    silverGrams: 0,
    investments: 0,
    shares: 0,
    businessAssets: 0,
    otherWealth: 0,
    debts: 0,
  };
}
