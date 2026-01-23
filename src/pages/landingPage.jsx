import { Link } from 'react-router-dom';
import { Shield, Terminal, Target, ChevronRight, Eye, Search, Globe, Lock } from 'lucide-react'; 
import { TerminalHeader} from "../component/TerminalHeader";

export const LandingPage = () => {
  return (
    <div className="min-h-screen matrix-bg">
      <TerminalHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Terminal Badge */}
            <div className="inline-flex items-center gap-2 bg-muted/50 border border-border rounded-full px-4 py-2 mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm text-muted-foreground font-mono">SYSTEM ONLINE</span>
            </div>

            {/* Main Title */}
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <span className="text-foreground">OSINT</span>
              <br />
              <span className="text-primary glow-text">TRAINING GROUND</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Master open-source intelligence techniques through immersive
              challenges. Track digital footprints. Uncover hidden information.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link
                to="/rooms"
                className="btn-terminal-filled flex items-center justify-center gap-2 text-lg"
              >
                <Target className="w-5 h-5" />
                Start Training
              </Link>
              <a
                href="#features"
                className="btn-terminal flex items-center justify-center gap-2 text-lg"
              >
                Learn More
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div>
                <div className="text-3xl font-display text-primary">10+</div>
                <div className="text-xs text-muted-foreground">CHALLENGES</div>
              </div>
              <div>
                <div className="text-3xl font-display text-secondary">OSINT</div>
                <div className="text-xs text-muted-foreground">FOCUSED</div>
              </div>
              <div>
                <div className="text-3xl font-display text-accent">FREE</div>
                <div className="text-xs text-muted-foreground">NO SIGNUP</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl text-primary mb-4">SKILL MODULES</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Train in real-world OSINT techniques used by investigators and security professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Search,
                title: 'Reverse Image',
                description: 'Track images across the web to find their origin and related content',
              },
              {
                icon: Globe,
                title: 'Social Media',
                description: 'Investigate digital footprints across social platforms',
              },
              {
                icon: Eye,
                title: 'Metadata Analysis',
                description: 'Extract hidden information from files and images',
              },
              {
                icon: Lock,
                title: 'Google Dorking',
                description: 'Master advanced search operators to find hidden data',
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="terminal-card p-6 hover:border-primary/50 transition-all group animate-fade-in"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <feature.icon className="w-10 h-10 text-primary mb-4 group-hover:text-secondary transition-colors" />
                <h3 className="font-display text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t border-border bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl text-primary mb-4">HOW IT WORKS</h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {[
              { step: '01', title: 'Choose a Room', desc: 'Select an investigation to begin your training' },
              { step: '02', title: 'Read the Brief', desc: 'Understand your mission objectives and gather intel' },
              { step: '03', title: 'Investigate', desc: 'Use OSINT techniques to find the answer' },
              { step: '04', title: 'Submit Flag', desc: 'Enter your findings in FLAG{} format to progress' },
            ].map((item, index) => (
              <div
                key={item.step}
                className="flex items-start gap-6 mb-8 last:mb-0 animate-slide-in"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="w-16 h-16 rounded bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-2xl text-primary">{item.step}</span>
                </div>
                <div className="pt-2">
                  <h3 className="font-display text-xl mb-1">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/rooms"
              className="btn-terminal-filled inline-flex items-center gap-2"
            >
              <Terminal className="w-5 h-5" />
              Begin Your Training
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-display text-sm text-muted-foreground">OSINT CTF</span>
            </div>
            <p className="text-xs text-muted-foreground">
              For educational purposes only. Practice ethical OSINT.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
