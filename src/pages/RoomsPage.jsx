import { TerminalHeader } from '../component/TerminalHeader';
import { RoomCard } from '../component/RoomCard';
import { sampleRooms } from '../data/sampleData';
import { useProgress } from '../hooks/useProgress';
import { Target, Filter } from 'lucide-react';

export const RoomsPage = () => {
  const { getRoomProgress } = useProgress();

  return (
    <div className="min-h-screen matrix-bg">
      <div className="scanline" />
      
      <TerminalHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-primary animate-pulse" />
            <h1 className="font-display text-2xl glow-text uppercase tracking-widest">
              AVAILABLE OPERATIONS
            </h1>
          </div>
          <p className="text-muted-foreground font-mono text-sm">
            [SYSTEM]: Select an operation to begin your OSINT investigation
          </p>
        </div>

        {/* Filters Section */}
        <div className="flex items-center gap-4 mb-6 border-b border-border/30 pb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
            <Filter className="w-4 h-4" />
            <span className="font-mono">FILTER: ALL_DIFFICULTIES</span>
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              // Progress fetching logic remains same
              progress={getRoomProgress(room.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {sampleRooms.length === 0 && (
          <div className="terminal-card p-12 text-center border-dashed border-2">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="font-display text-xl mb-2 text-muted-foreground">
              NO OPERATIONS_FOUND
            </h3>
            <p className="text-muted-foreground font-mono text-sm">
              Check back later for new encrypted challenges.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};