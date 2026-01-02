import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <span className="text-foreground font-bold text-lg">ز</span>
              </div>
              <span className="text-xl font-bold">ZAKAT</span>
            </div>
            <p className="text-primary-foreground/80 max-w-sm">
              Calculate your zakat with clarity, trust, and precision. Powered by Islamic finance principles and modern technology.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><Link to="/calculate" className="hover:text-secondary transition-colors">Calculator</Link></li>
              <li><Link to="/dashboard" className="hover:text-secondary transition-colors">Dashboard</Link></li>
              <li><Link to="/assistant" className="hover:text-secondary transition-colors">AI Assistant</Link></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-secondary transition-colors">Zakat Guide</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60 text-sm">
          <p>© {new Date().getFullYear()} ZAKAT. Built with ❤️ for the Muslim community.</p>
        </div>
      </div>
    </footer>
  );
}
