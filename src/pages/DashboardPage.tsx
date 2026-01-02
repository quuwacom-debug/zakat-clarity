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

  // Sample wealth data for the ring visualization
  const wealthData = {
    cash: 15000,
    gold: 25000,
    silver: 5000,
    investments: 30000,
    business: 20000,
    other: 5000,
  };
  
  const totalWealth = Object.values(wealthData).reduce((a, b) => a + b, 0);
  
  const wealthSegments = [
    { label: 'Cash & Bank', value: wealthData.cash, color: 'hsl(160, 84%, 25%)' },
    { label: 'Gold', value: wealthData.gold, color: 'hsl(45, 80%, 50%)' },
    { label: 'Silver', value: wealthData.silver, color: 'hsl(210, 10%, 70%)' },
    { label: 'Investments', value: wealthData.investments, color: 'hsl(160, 70%, 35%)' },
    { label: 'Business', value: wealthData.business, color: 'hsl(40, 75%, 40%)' },
    { label: 'Other', value: wealthData.other, color: 'hsl(160, 50%, 45%)' },
  ];
  
  // Calculate SVG arc paths for wealth ring
  const calculateArcs = () => {
    let currentAngle = -90; // Start from top
    const radius = 120;
    const strokeWidth = 24;
    
    return wealthSegments.map((segment) => {
      const percentage = (segment.value / totalWealth) * 100;
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
      
      return {
        ...segment,
        percentage,
        path: `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      };
    });
  };
  
  const arcs = calculateArcs();

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
          
          {/* Wealth Ring & Stats */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Wealth Ring */}
            <Card variant="elevated" className="lg:col-span-1">
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
                    {arcs.map((arc, index) => (
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
                    <p className="text-sm text-muted-foreground">Total Wealth</p>
                    <motion.p
                      className="text-2xl md:text-3xl font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.5 }}
                    >
                      {formatCurrency(totalWealth, selectedCurrency)}
                    </motion.p>
                    <p className="text-sm text-primary font-medium">
                      Zakat: {formatCurrency(totalWealth * 0.025, selectedCurrency)}
                    </p>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 mt-4">
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
            
            {/* Price Cards */}
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
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
                            <stop offset="5%" stopColor="hsl(45, 80%, 50%)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(45, 80%, 50%)" stopOpacity={0}/>
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
                            <stop offset="5%" stopColor="hsl(210, 10%, 70%)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(210, 10%, 70%)" stopOpacity={0}/>
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
