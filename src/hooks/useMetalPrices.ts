import { useState, useEffect } from 'react';
import { MetalPrice, Currency, CURRENCIES } from '@/lib/zakat';

// Mock exchange rates (relative to USD)
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

// Base prices in USD per gram
const BASE_GOLD_PRICE_USD = 75.5; // ~$2350/oz
const BASE_SILVER_PRICE_USD = 0.92; // ~$28.5/oz

export function useMetalPrices(currencyCode: string = 'USD') {
  const [prices, setPrices] = useState<MetalPrice>({
    gold: BASE_GOLD_PRICE_USD,
    silver: BASE_SILVER_PRICE_USD,
    lastUpdated: new Date(),
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate fetching live prices
    setLoading(true);
    
    const rate = EXCHANGE_RATES[currencyCode] || 1;
    
    // Add some random variation to simulate live prices
    const variation = 0.98 + Math.random() * 0.04;
    
    setTimeout(() => {
      setPrices({
        gold: BASE_GOLD_PRICE_USD * rate * variation,
        silver: BASE_SILVER_PRICE_USD * rate * variation,
        lastUpdated: new Date(),
      });
      setLoading(false);
    }, 500);
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
