import { Terminal, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';


export const TerminalHeader = ({ title = 'OSINT CTF', showNav = true }) => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Shield className="w-8 h-8 text-primary group-hover:text-secondary transition-colors" />
             
              <div className="absolute inset-0 blur-sm bg-primary/30 group-hover:bg-secondary/30 transition-colors" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold tracking-wider text-primary glow-text">
                {title}
              </h1>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Terminal className="w-3 h-3" />
                <span>v1.0.0</span>
              </div>
            </div>
          </Link>
          
          {showNav && (
            <nav className="flex items-center gap-6">
              <Link 
                to="/" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/rooms" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Challenges
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};