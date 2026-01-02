import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Banknote,
  Building2,
  Coins,
  TrendingUp,
  Package,
  Wallet,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Check,
  Info,
  RefreshCw
} from 'lucide-react';
import {
  ZakatAssets,
  Currency,
  CURRENCIES,
  getDefaultAssets,
  calculateZakat,
  formatCurrency,
  NISAB,
  ZakatCalculation
} from '@/lib/zakat';
import { useMetalPrices } from '@/hooks/useMetalPrices';
import { cn } from '@/lib/utils';

const assetCategories = [
  {
    key: 'cash',
    label: 'Cash on Hand',
    icon: Banknote,
    description: 'Physical cash and currency you possess',
    placeholder: 'Enter amount'
  },
  {
    key: 'bankBalance',
    label: 'Bank Balance',
    icon: Building2,
    description: 'Savings, checking, and fixed deposits',
    placeholder: 'Enter amount'
  },
  {
    key: 'goldGrams',
    label: 'Gold (grams)',
    icon: Coins,
    description: 'Gold jewelry, coins, and bars',
    placeholder: 'Enter grams',
    isWeight: true
  },
  {
    key: 'silverGrams',
    label: 'Silver (grams)',
    icon: Coins,
    description: 'Silver jewelry, coins, and bars',
    placeholder: 'Enter grams',
    isWeight: true
  },
  {
    key: 'investments',
    label: 'Investments',
    icon: TrendingUp,
    description: 'Stocks, mutual funds, bonds',
    placeholder: 'Enter value'
  },
  {
    key: 'shares',
    label: 'Business Shares',
    icon: Package,
    description: 'Partnership shares and equity',
    placeholder: 'Enter value'
  },
  {
    key: 'businessAssets',
    label: 'Business Assets',
    icon: Building2,
    description: 'Inventory, receivables, raw materials',
    placeholder: 'Enter value'
  },
  {
    key: 'otherWealth',
    label: 'Other Wealth',
    icon: Wallet,
    description: 'Any other zakatable assets',
    placeholder: 'Enter amount'
  },
  {
    key: 'debts',
    label: 'Debts to Deduct',
    icon: CreditCard,
    description: 'Outstanding loans and liabilities',
    placeholder: 'Enter amount',
    isDeduction: true
  },
];

export default function CalculatePage() {
  const [step, setStep] = useState(0);
  const [assets, setAssets] = useState<ZakatAssets>(getDefaultAssets());
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(CURRENCIES[0]);
  const [calculation, setCalculation] = useState<ZakatCalculation | null>(null);

  const { prices, loading: pricesLoading } = useMetalPrices(selectedCurrency.code);

  // Calculate wealth distribution for the ring chart
  const wealthSegments = useMemo(() => {
    if (!calculation) return [];

    const cashValue = (assets.cash || 0) + (assets.bankBalance || 0);
    const goldValue = (assets.goldGrams || 0) * prices.gold;
    const silverValue = (assets.silverGrams || 0) * prices.silver;
    const investValue = (assets.investments || 0) + (assets.shares || 0);
    const businessValue = (assets.businessAssets || 0);
    const otherValue = (assets.otherWealth || 0);

    // Total raw wealth (before debts)
    const totalRawWealth = cashValue + goldValue + silverValue + investValue + businessValue + otherValue;

    if (totalRawWealth === 0) return [];

    const segments = [
      { label: 'Cash & Bank', value: cashValue, color: 'hsl(160, 84%, 25%)' },
      { label: 'Gold', value: goldValue, color: 'hsl(45, 80%, 50%)' },
      { label: 'Silver', value: silverValue, color: 'hsl(210, 10%, 70%)' },
      { label: 'Investments', value: investValue, color: 'hsl(160, 70%, 35%)' },
      { label: 'Business', value: businessValue, color: 'hsl(40, 75%, 40%)' },
      { label: 'Other', value: otherValue, color: 'hsl(160, 50%, 45%)' },
    ].filter(s => s.value > 0); // Only show segments with value

    // Calculate arcs
    let currentAngle = -90;
    const radius = 120;

    return segments.map((segment) => {
      const percentage = (segment.value / totalRawWealth) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = 150 + radius * Math.cos(startRad);
      const y1 = 150 + radius * Math.sin(startRad);
      const x2 = 150 + radius * Math.cos(endRad);
      const y2 = 150 + radius * Math.sin(endRad);

      const largeArc = angle > 180 ? 1 : 0;

      // Handle the case where a single segment is 100% (Draw a full circle)
      const path = percentage > 99.9
        ? `M 150, 30 A 120,120 0 1,1 149.9, 30`
        : `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;

      return {
        ...segment,
        percentage,
        path,
      };
    });
  }, [assets, prices, calculation]);

  const totalSteps = 3; // Currency, Assets, Results

  const handleAssetChange = (key: keyof ZakatAssets, value: string) => {
    const numValue = parseFloat(value) || 0;
    setAssets(prev => ({ ...prev, [key]: numValue }));
  };

  const handleCalculate = () => {
    const result = calculateZakat(assets, prices, selectedCurrency);
    setCalculation(result);
    setStep(2);
  };

  const handleReset = () => {
    setAssets(getDefaultAssets());
    setCalculation(null);
    setStep(0);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {['Currency', 'Assets', 'Results'].map((label, index) => (
                <div key={label} className="flex items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300",
                    index <= step
                      ? "gradient-primary text-primary-foreground shadow-glow"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {index < step ? <Check className="w-5 h-5" /> : index + 1}
                  </div>
                  <span className={cn(
                    "ml-2 font-medium hidden sm:inline",
                    index <= step ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {label}
                  </span>
                  {index < 2 && (
                    <div className={cn(
                      "w-12 md:w-24 h-1 mx-2 md:mx-4 rounded-full transition-all duration-300",
                      index < step ? "bg-primary" : "bg-muted"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Currency Selection */}
            {step === 0 && (
              <motion.div
                key="currency"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card variant="elevated" className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                    <CardTitle className="text-2xl">Select Your Currency</CardTitle>
                    <CardDescription>
                      Choose the currency for your zakat calculation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {CURRENCIES.map((currency) => (
                        <button
                          key={currency.code}
                          onClick={() => setSelectedCurrency(currency)}
                          className={cn(
                            "p-4 rounded-xl border-2 transition-all duration-200 text-left",
                            selectedCurrency.code === currency.code
                              ? "border-primary bg-primary/5 shadow-glow"
                              : "border-border hover:border-primary/50 hover:bg-accent/50"
                          )}
                        >
                          <span className="text-2xl mb-2 block">{currency.flag}</span>
                          <p className="font-bold">{currency.code}</p>
                          <p className="text-xs text-muted-foreground truncate">{currency.name}</p>
                        </button>
                      ))}
                    </div>

                    {/* Live Prices */}
                    <div className="mt-8 p-4 bg-accent/50 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <Info className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Live Metal Prices ({selectedCurrency.code})</span>
                        {pricesLoading && <RefreshCw className="w-4 h-4 animate-spin text-primary" />}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-background p-3 rounded-lg">
                          <p className="text-xs text-muted-foreground">Gold per gram</p>
                          <p className="text-lg font-bold text-secondary-dark">
                            {formatCurrency(prices.gold, selectedCurrency)}
                          </p>
                        </div>
                        <div className="bg-background p-3 rounded-lg">
                          <p className="text-xs text-muted-foreground">Silver per gram</p>
                          <p className="text-lg font-bold text-silver">
                            {formatCurrency(prices.silver, selectedCurrency)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <Button variant="hero" size="lg" onClick={() => setStep(1)} className="gap-2">
                        Continue
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Asset Entry */}
            {step === 1 && (
              <motion.div
                key="assets"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card variant="elevated" className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                    <CardTitle className="text-2xl">Enter Your Assets</CardTitle>
                    <CardDescription>
                      Add all your zakatable wealth in {selectedCurrency.name} ({selectedCurrency.symbol})
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {assetCategories.map((category) => (
                        <div
                          key={category.key}
                          className={cn(
                            "p-4 rounded-xl border transition-all duration-200",
                            category.isDeduction
                              ? "border-destructive/30 bg-destructive/5"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                              category.isDeduction
                                ? "bg-destructive/20 text-destructive"
                                : "bg-primary/10 text-primary"
                            )}>
                              <category.icon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-semibold">{category.label}</p>
                              <p className="text-xs text-muted-foreground">{category.description}</p>
                            </div>
                          </div>
                          <div className="relative">
                            {!category.isWeight && (
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                                {selectedCurrency.symbol}
                              </span>
                            )}
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder={category.placeholder}
                              value={assets[category.key as keyof ZakatAssets] || ''}
                              onChange={(e) => handleAssetChange(category.key as keyof ZakatAssets, e.target.value)}
                              className={cn(
                                "text-right font-medium",
                                !category.isWeight && "pl-12"
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between mt-8">
                      <Button variant="ghost" size="lg" onClick={() => setStep(0)} className="gap-2">
                        <ArrowLeft className="w-5 h-5" />
                        Back
                      </Button>
                      <Button variant="hero" size="lg" onClick={handleCalculate} className="gap-2">
                        Calculate Zakat
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Results */}
            {step === 2 && calculation && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="space-y-6">
                  {/* Main Result Card */}
                  <Card variant="elevated" className={cn(
                    "overflow-hidden text-center",
                    calculation.isEligible
                      ? "border-primary/30 bg-gradient-to-br from-primary/5 via-background to-secondary/5"
                      : "border-muted bg-muted/30"
                  )}>
                    <CardContent className="p-8 md:p-12">
                      {calculation.isEligible ? (
                        <>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", duration: 0.8 }}
                            className="w-32 h-32 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center shadow-glow animate-pulse-glow"
                          >
                            <span className="text-4xl font-arabic text-primary-foreground">زكاة</span>
                          </motion.div>

                          <h2 className="text-2xl md:text-3xl font-bold mb-2">Your Zakat Due</h2>
                          <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl md:text-5xl font-bold text-gradient-primary mb-4"
                          >
                            {formatCurrency(calculation.zakatAmount, selectedCurrency)}
                          </motion.p>
                          <p className="text-muted-foreground">
                            2.5% of your net zakatable wealth
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                            <Check className="w-16 h-16 text-muted-foreground" />
                          </div>
                          <h2 className="text-2xl md:text-3xl font-bold mb-2">No Zakat Due</h2>
                          <p className="text-muted-foreground">
                            Your wealth is below the nisab threshold
                          </p>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Wealth Overview Ring Chart */}
                  {wealthSegments.length > 0 && (
                    <Card variant="elevated">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <span className="text-2xl font-arabic text-secondary">ز</span>
                          Wealth Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="relative flex items-center justify-center">
                          <motion.svg
                            width="300"
                            height="300"
                            viewBox="0 0 300 300"
                            className="mx-auto"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            transition={{ duration: 1 }}
                          >
                            {wealthSegments.map((arc, index) => (
                              <motion.path
                                key={arc.label}
                                d={arc.path}
                                fill="none"
                                stroke={arc.color}
                                strokeWidth="24"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                              />
                            ))}
                          </motion.svg>

                          {/* Center Content */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <p className="text-sm text-muted-foreground">Total Assets</p>
                            <motion.p
                              className="text-2xl md:text-3xl font-bold"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", delay: 0.5 }}
                            >
                              {formatCurrency(calculation?.totalAssets || 0, selectedCurrency)}
                            </motion.p>
                          </div>
                        </div>

                        {/* Legend */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                          {wealthSegments.map((segment) => (
                            <div key={segment.label} className="flex items-center gap-2 text-sm">
                              <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: segment.color }}
                              />
                              <span className="text-muted-foreground truncate">{segment.label}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Breakdown */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Nisab Status */}
                    <Card variant="glass">
                      <CardHeader>
                        <CardTitle className="text-lg">Nisab Threshold</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-secondary/10 rounded-lg">
                          <span className="flex items-center gap-2">
                            <Coins className="w-4 h-4 text-secondary-dark" />
                            Gold Nisab ({NISAB.GOLD_GRAMS}g)
                          </span>
                          <span className="font-bold">{formatCurrency(calculation.nisabGold, selectedCurrency)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-silver/10 rounded-lg">
                          <span className="flex items-center gap-2">
                            <Coins className="w-4 h-4 text-silver" />
                            Silver Nisab ({NISAB.SILVER_GRAMS}g)
                          </span>
                          <span className="font-bold">{formatCurrency(calculation.nisabSilver, selectedCurrency)}</span>
                        </div>
                        <div className={cn(
                          "flex justify-between items-center p-3 rounded-lg",
                          calculation.isEligible ? "bg-primary/10" : "bg-muted"
                        )}>
                          <span>Your Net Worth</span>
                          <span className="font-bold">{formatCurrency(calculation.netWorth, selectedCurrency)}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Asset Summary */}
                    <Card variant="glass">
                      <CardHeader>
                        <CardTitle className="text-lg">Wealth Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Total Assets</span>
                          <span className="font-medium">{formatCurrency(calculation.totalAssets, selectedCurrency)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-destructive">
                          <span>Less: Debts</span>
                          <span className="font-medium">-{formatCurrency(calculation.totalDeductions, selectedCurrency)}</span>
                        </div>
                        <div className="border-t pt-3 flex justify-between font-bold">
                          <span>Net Zakatable Wealth</span>
                          <span>{formatCurrency(calculation.netWorth, selectedCurrency)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="outline" size="lg" onClick={handleReset} className="gap-2">
                      <RefreshCw className="w-5 h-5" />
                      Calculate Again
                    </Button>
                    <Button variant="hero" size="lg" onClick={() => window.print()} className="gap-2">
                      Download Report
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
