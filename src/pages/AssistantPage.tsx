import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Send, 
  MessageCircle, 
  Sparkles,
  User,
  Bot,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Sample FAQ responses for demo (will be replaced with AI)
const sampleResponses: Record<string, string> = {
  'retirement': `Retirement savings are generally zakatable if you have access to withdraw them. Key considerations:

**Accessible Funds:** If you can withdraw without penalty, zakat is due on the full amount.

**Locked Funds:** For employer-controlled 401(k) or pension funds you cannot access, many scholars say zakat is due only when received.

**Recommendation:** Calculate your accessible retirement savings and include them in your zakatable wealth. For locked funds, consult a local scholar.`,

  'gold jewelry': `Gold jewelry is zakatable according to the majority of scholars. Here's what you need to know:

**Weight Matters:** Only the gold content counts. If your jewelry is 18K, it's 75% pure gold.

**Current Value:** Calculate based on today's gold price, not purchase price.

**Nisab:** If your total gold reaches 87.48 grams (~7.5 tola), zakat is due.

**Rate:** 2.5% of the gold's current market value.

Some scholars exclude jewelry worn regularly, but the safer opinion is to pay zakat on all gold.`,

  'business': `Zakat on business assets follows specific rules:

**Zakatable:**
- Inventory for sale
- Cash and receivables
- Raw materials for products

**Not Zakatable:**
- Fixed assets (machinery, buildings)
- Personal use items
- Vehicles used for business

**Calculation:**
1. Value your inventory at current sale price
2. Add cash and collectible receivables
3. Subtract business debts due within the year
4. Apply 2.5% to the net amount

The calculation date should be consistent each year.`,

  'stocks': `Stock investments are zakatable wealth. Here's how to calculate:

**Trading Stocks:** If you buy/sell frequently, zakat is due on the full market value.

**Long-term Holdings:** You can pay zakat on either:
- Full market value (simpler, recommended)
- Your share of the company's zakatable assets

**Calculation:**
1. Determine market value on your zakat date
2. Include dividends received
3. Apply 2.5%

Avoid stocks in haram industries, but if held, still pay zakat and seek repentance.`,

  'default': `I'm here to help you understand zakat rulings! I can answer questions about:

• **Eligibility:** Who must pay zakat?
• **Calculation:** How to calculate different assets
• **Nisab:** Current thresholds for gold and silver
• **Categories:** What types of wealth are zakatable
• **Distribution:** Who can receive zakat

Please ask your question, and I'll provide guidance based on Islamic principles. For complex personal situations, I recommend consulting with a qualified scholar.`
};

function getResponse(question: string): string {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('retirement') || lowerQuestion.includes('401k') || lowerQuestion.includes('pension')) {
    return sampleResponses['retirement'];
  }
  if (lowerQuestion.includes('gold') || lowerQuestion.includes('jewelry') || lowerQuestion.includes('jewellery')) {
    return sampleResponses['gold jewelry'];
  }
  if (lowerQuestion.includes('business') || lowerQuestion.includes('inventory') || lowerQuestion.includes('company')) {
    return sampleResponses['business'];
  }
  if (lowerQuestion.includes('stock') || lowerQuestion.includes('shares') || lowerQuestion.includes('investment')) {
    return sampleResponses['stocks'];
  }
  
  return sampleResponses['default'];
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Assalamu Alaikum! I'm your Zakat Assistant, here to help you understand Islamic rulings on zakat. 

Feel free to ask about:
- Zakat calculation on different assets
- Nisab thresholds
- Who is eligible to pay or receive zakat
- Specific scenarios and rulings

How can I assist you today?`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const response = getResponse(userMessage.content);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const suggestedQuestions = [
    "Is zakat due on my retirement savings?",
    "How do I calculate zakat on gold jewelry?",
    "What business assets are zakatable?",
    "How to pay zakat on stocks?",
  ];

  return (
    <Layout showFooter={false}>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col">
        {/* Header */}
        <div className="bg-background border-b border-border py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Zakat AI Assistant</h1>
                <p className="text-sm text-muted-foreground">Ask questions about zakat rulings</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-6">
          <div className="container mx-auto px-4 max-w-3xl">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={cn(
                    "flex gap-3 mb-6",
                    message.role === 'user' && "flex-row-reverse"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                    message.role === 'assistant' 
                      ? "gradient-primary" 
                      : "bg-secondary"
                  )}>
                    {message.role === 'assistant' 
                      ? <Bot className="w-5 h-5 text-primary-foreground" />
                      : <User className="w-5 h-5 text-foreground" />
                    }
                  </div>
                  
                  <Card variant={message.role === 'assistant' ? 'glass' : 'elevated'} className={cn(
                    "max-w-[80%]",
                    message.role === 'user' && "bg-primary text-primary-foreground border-primary"
                  )}>
                    <CardContent className="p-4">
                      <div className={cn(
                        "prose prose-sm max-w-none",
                        message.role === 'user' && "text-primary-foreground prose-headings:text-primary-foreground prose-strong:text-primary-foreground"
                      )}>
                        {message.content.split('\n').map((line, i) => (
                          <p key={i} className={cn(
                            "mb-2 last:mb-0",
                            line.startsWith('**') && "font-semibold"
                          )}>
                            {line.replace(/\*\*/g, '')}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 mb-6"
              >
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <Card variant="glass" className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </Card>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="container mx-auto px-4 max-w-3xl pb-4">
            <p className="text-sm text-muted-foreground mb-3">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInput(question);
                  }}
                  className="text-left"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {/* Input */}
        <div className="bg-background border-t border-border py-4">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about zakat rulings..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button 
                variant="hero" 
                size="icon" 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              This AI provides general guidance. For personal rulings, please consult a qualified scholar.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
