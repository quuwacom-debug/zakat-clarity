import { useState, useEffect } from 'react';
import { MetalPrice, Currency, CURRENCIES } from '@/lib/zakat';

// TODO: Move to environment variable in production
const METALS_API_KEY = 'VIEADXWWLAOUODYS3YQT872YS3YQT';
const METALS_API_URL = 'https://api.metals.dev/v1/latest';
const CACHE_KEY = 'METAL_PRICES_CACHE';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Mock exchange rates (relative to USD) - used as fallback
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  BDT: 109.5,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.12,
  PKR: 278.5,
  SAR: 3.75,
  AED: 3.67,
  MYR: 4.47,
  IDR: 15650,
};

// Fallback base prices in USD per gram
const FALLBACK_GOLD_PRICE_USD = 75.5;
const FALLBACK_SILVER_PRICE_USD = 0.92;

interface CachedPrices {
  gold: number;
  silver: number;
  timestamp: number;
  currency: string;
}

// Fetch live metal prices from API
async function fetchLiveMetalPrices(currencyCode: string): Promise<{ gold: number; silver: number } | null> {
  try {
    const response = await fetch(
      `${METALS_API_URL}?api_key=${METALS_API_KEY}&currency=${currencyCode}&unit=g`
    );

    if (!response.ok) {
      console.error('Metals API error:', response.statusText);
      return null;
    }

    const data = await response.json();

    // Extract gold (XAU) and silver (XAG) prices per gram
    const gold = data.metals?.XAU;
    const silver = data.metals?.XAG;

    if (gold && silver) {
      return { gold, silver };
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch live metal prices:', error);
    return null;
  }
}

// Get cached prices if they're still valid
function getCachedPrices(currencyCode: string): CachedPrices | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data: CachedPrices = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid (< 24 hours old) and matches currency
    if (data.currency === currencyCode && (now - data.timestamp) < CACHE_DURATION) {
      return data;
    }

    return null;
  } catch (error) {
    console.error('Failed to read cached prices:', error);
    return null;
  }
}

// Save prices to cache
function setCachedPrices(gold: number, silver: number, currencyCode: string): void {
  try {
    const data: CachedPrices = {
      gold,
      silver,
      timestamp: Date.now(),
      currency: currencyCode,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to cache prices:', error);
  }
}

export function useMetalPrices(currencyCode: string = 'USD') {
  const [prices, setPrices] = useState<MetalPrice>({
    gold: FALLBACK_GOLD_PRICE_USD,
    silver: FALLBACK_SILVER_PRICE_USD,
    lastUpdated: new Date(),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrices = async () => {
      setLoading(true);

      // First, try to get cached prices
      const cached = getCachedPrices(currencyCode);
      if (cached) {
        setPrices({
          gold: cached.gold,
          silver: cached.silver,
          lastUpdated: new Date(cached.timestamp),
        });
        setLoading(false);
        return;
      }

      // Cache miss or expired - fetch live prices
      const livePrices = await fetchLiveMetalPrices(currencyCode);

      if (livePrices) {
        // Successfully fetched live prices
        setPrices({
          gold: livePrices.gold,
          silver: livePrices.silver,
          lastUpdated: new Date(),
        });
        setCachedPrices(livePrices.gold, livePrices.silver, currencyCode);
      } else {
        // API failed - use fallback prices with currency conversion
        const rate = EXCHANGE_RATES[currencyCode] || 1;
        const variation = 0.98 + Math.random() * 0.04;

        setPrices({
          gold: FALLBACK_GOLD_PRICE_USD * rate * variation,
          silver: FALLBACK_SILVER_PRICE_USD * rate * variation,
          lastUpdated: new Date(),
        });
      }

      setLoading(false);
    };

    loadPrices();
  }, [currencyCode]);

  return { prices, loading };
}

export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);

  return { currency, setCurrency, currencies: CURRENCIES };
}

// Generate historical price data for charts
export function generatePriceHistory(
  days: number,
  basePrice: number,
  volatility: number = 0.02
): { date: string; price: number }[] {
  const data = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Random walk with trend
    const trend = 1 + (days - i) * 0.0001;
    const noise = 1 + (Math.random() - 0.5) * volatility;
    const price = basePrice * trend * noise;

    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100,
    });
  }

  return data;
}
