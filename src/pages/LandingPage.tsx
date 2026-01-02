import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import {
  Calculator,
  TrendingUp,
  Shield,
  Globe,
  Sparkles,
  ArrowRight,
  Coins,
  BarChart3,
  MessageCircle,
  CheckCircle2
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center gradient-hero pattern-islamic overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div
                className="inline-flex items-center gap-2 bg-accent/50 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-foreground">Smart Islamic Finance</span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Calculate Your{' '}
                <span className="text-gradient-primary">Zakat</span>
                <br />
                with Clarity & Trust
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
                A modern platform to help Muslims fulfill their religious duty with accurate calculations,
                live market data, and AI-powered guidance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/calculate">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto gap-2">
                    Calculate Now
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="xl" className="w-full sm:w-auto">
                    View Dashboard
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <motion.div
                className="flex items-center gap-6 mt-10 justify-center lg:justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>Shariah Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>Live Prices</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Animated Ring */}
                <div className="absolute inset-0 wealth-ring rounded-full opacity-20" />
                <div className="absolute inset-4 bg-background rounded-full shadow-deep" />

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-arabic text-secondary mb-2">زكاة</span>
                  <span className="text-lg font-medium text-muted-foreground">Purification of Wealth</span>
                </div>

                {/* Floating Cards */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-card p-4 rounded-2xl shadow-elegant border border-border/50"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                      <Coins className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Gold Price</p>
                      <p className="font-bold text-foreground">$75.50/g</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 bg-card p-4 rounded-2xl shadow-elegant border border-border/50"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Calculator className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Zakat Rate</p>
                      <p className="font-bold text-foreground">2.5%</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for{' '}
              <span className="text-gradient-primary">Accurate Zakat</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform covers all aspects of zakat calculation with modern tools and trusted methodologies.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Calculator,
                title: 'Smart Calculator',
                description: 'Calculate zakat on cash, gold, silver, investments, business assets, and more.',
                color: 'bg-primary/10 text-primary',
                link: '/calculate'
              },
              {
                icon: TrendingUp,
                title: 'Live Market Data',
                description: 'Real-time gold and silver prices with historical charts and trends.',
                color: 'bg-secondary/20 text-secondary-dark',
                link: '/dashboard'
              },
              {
                icon: Globe,
                title: 'Global Currencies',
                description: 'Support for USD, EUR, BDT, INR, PKR, SAR, and many more currencies.',
                color: 'bg-accent text-primary',
                link: '/calculate'
              },
              {
                icon: Shield,
                title: 'Shariah Compliant',
                description: 'Calculations based on authentic Islamic rulings and nisab thresholds.',
                color: 'bg-primary/10 text-primary',
                link: '/assistant'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
              >
                <Link to={feature.link} className="block h-full">
                  <Card variant="elevated" className="p-6 h-full hover:shadow-glow transition-all duration-300 group cursor-pointer">
                    <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps to calculate your zakat obligation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                title: 'Enter Your Assets',
                description: 'Add your cash, gold, silver, investments, and other zakatable wealth.',
                icon: Coins
              },
              {
                step: '02',
                title: 'Check Nisab',
                description: 'We compare your wealth against live nisab thresholds automatically.',
                icon: BarChart3
              },
              {
                step: '03',
                title: 'Get Your Zakat',
                description: 'Receive a detailed breakdown of your 2.5% zakat obligation.',
                icon: Calculator
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <Link to="/calculate" className="block group cursor-pointer">
                  <div className="relative inline-block mb-6 transition-transform duration-300 group-hover:scale-110">
                    <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center shadow-glow">
                      <item.icon className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-foreground text-sm font-bold flex items-center justify-center shadow-gold">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant Preview */}
      <section className="py-20 bg-primary text-primary-foreground overflow-hidden relative">
        <div className="absolute inset-0 pattern-islamic opacity-10" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-primary-foreground/10 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium">AI-Powered</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ask the Zakat Assistant
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Have questions about zakat rulings? Our AI assistant is trained on Islamic finance principles
                to help you understand complex scenarios.
              </p>

              <Link to="/assistant">
                <Button variant="gold" size="lg" className="gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Start Conversation
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card variant="glass" className="bg-background/10 backdrop-blur-lg border-primary-foreground/20 p-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-foreground">You</span>
                    </div>
                    <div className="bg-primary-foreground/10 rounded-2xl rounded-tl-sm p-4">
                      <p className="text-sm">Is zakat due on my retirement savings?</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">AI</span>
                    </div>
                    <div className="bg-primary-foreground/10 rounded-2xl rounded-tl-sm p-4">
                      <p className="text-sm">
                        Retirement savings are generally zakatable if you have access to them.
                        The key factors are accessibility and ownership...
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Calculate Your Zakat?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of Muslims using Zakatify to fulfill their religious obligations with confidence.
            </p>
            <Link to="/calculate">
              <Button variant="hero" size="xl" className="gap-2">
                Start Free Calculation
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
