import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  Coins,
  RefreshCw,
  Calendar
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { CURRENCIES, formatCurrency } from '@/lib/zakat';
import { useMetalPrices, generatePriceHistory } from '@/hooks/useMetalPrices';
import { cn } from '@/lib/utils';

type TimeRange = '1D' | '1W' | '1M' | '1Y';

const timeRanges: { label: TimeRange; days: number }[] = [
  { label: '1D', days: 1 },
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '1Y', days: 365 },
];

export default function DashboardPage() {
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');

  const { prices, loading } = useMetalPrices(selectedCurrency.code);

  const goldHistory = useMemo(() => {
    const days = timeRanges.find(t => t.label === timeRange)?.days || 30;
    return generatePriceHistory(days, prices.gold, 0.015);
  }, [timeRange, prices.gold]);

  const silverHistory = useMemo(() => {
    const days = timeRanges.find(t => t.label === timeRange)?.days || 30;
    return generatePriceHistory(days, prices.silver, 0.02);
  }, [timeRange, prices.silver]);

  const goldChange = goldHistory.length > 1
    ? ((goldHistory[goldHistory.length - 1].price - goldHistory[0].price) / goldHistory[0].price) * 100
    : 0;

  const silverChange = silverHistory.length > 1
    ? ((silverHistory[silverHistory.length - 1].price - silverHistory[0].price) / silverHistory[0].price) * 100
    : 0;



  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Track your wealth and market trends</p>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center gap-2 flex-wrap">
              {CURRENCIES.slice(0, 5).map((currency) => (
                <Button
                  key={currency.code}
                  variant={selectedCurrency.code === currency.code ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedCurrency(currency)}
                  className="gap-1"
                >
                  <span>{currency.flag}</span>
                  <span>{currency.code}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Price Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Gold Card */}
            <Card variant="elevated" className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                        <Coins className="w-5 h-5 text-secondary-dark" />
                      </div>
                      <span className="font-semibold">Gold</span>
                    </div>
                    <p className="text-2xl md:text-3xl font-bold">
                      {formatCurrency(prices.gold, selectedCurrency)}
                      <span className="text-sm font-normal text-muted-foreground">/g</span>
                    </p>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium",
                    goldChange >= 0 ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                  )}>
                    {goldChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {Math.abs(goldChange).toFixed(2)}%
                  </div>
                </div>

                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={goldHistory}>
                      <defs>
                        <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(45, 80%, 50%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(45, 80%, 50%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="hsl(45, 80%, 50%)"
                        strokeWidth={2}
                        fill="url(#goldGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Silver Card */}
            <Card variant="elevated" className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-10 h-10 rounded-xl bg-silver/20 flex items-center justify-center">
                        <Coins className="w-5 h-5 text-silver" />
                      </div>
                      <span className="font-semibold">Silver</span>
                    </div>
                    <p className="text-2xl md:text-3xl font-bold">
                      {formatCurrency(prices.silver, selectedCurrency)}
                      <span className="text-sm font-normal text-muted-foreground">/g</span>
                    </p>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium",
                    silverChange >= 0 ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                  )}>
                    {silverChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {Math.abs(silverChange).toFixed(2)}%
                  </div>
                </div>

                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={silverHistory}>
                      <defs>
                        <linearGradient id="silverGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(210, 10%, 70%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(210, 10%, 70%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="hsl(210, 10%, 70%)"
                        strokeWidth={2}
                        fill="url(#silverGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Full Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Gold Chart */}
            <Card variant="elevated">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-secondary-dark" />
                  Gold Price History
                </CardTitle>
                <div className="flex items-center gap-1">
                  {timeRanges.map((range) => (
                    <Button
                      key={range.label}
                      variant={timeRange === range.label ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setTimeRange(range.label)}
                    >
                      {range.label}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={goldHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return timeRange === '1D'
                            ? date.toLocaleTimeString([], { hour: '2-digit' })
                            : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                        }}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${selectedCurrency.symbol}${value}`}
                        domain={['auto', 'auto']}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '12px',
                        }}
                        formatter={(value: number) => [formatCurrency(value, selectedCurrency), 'Price']}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="hsl(45, 80%, 50%)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6, fill: 'hsl(45, 80%, 50%)' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Silver Chart */}
            <Card variant="elevated">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-silver" />
                  Silver Price History
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Last updated: {prices.lastUpdated.toLocaleTimeString()}</span>
                  {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={silverHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return timeRange === '1D'
                            ? date.toLocaleTimeString([], { hour: '2-digit' })
                            : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                        }}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${selectedCurrency.symbol}${value}`}
                        domain={['auto', 'auto']}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '12px',
                        }}
                        formatter={(value: number) => [formatCurrency(value, selectedCurrency), 'Price']}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="hsl(210, 10%, 70%)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6, fill: 'hsl(210, 10%, 70%)' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
