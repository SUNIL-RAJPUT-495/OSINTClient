import { Link } from 'react-router-dom';
import { Shield, Target, ChevronRight, Trophy, Lock } from 'lucide-react';
import { cn } from '../lib/utils'; 

const difficultyColors = {
  Easy: 'text-success border-success/30 bg-success/10',
  Medium: 'text-warning border-warning/30 bg-warning/10',
  Hard: 'text-destructive border-destructive/30 bg-destructive/10',
  Expert: 'text-accent border-accent/30 bg-accent/10',
};

export const RoomCard = ({ room, progress }) => {
  const completedCount = progress?.completedLevels?.length || 0;
  const totalChallenges = room?.challenges?.length || 0;
  const progressPercent = totalChallenges > 0 ? (completedCount / totalChallenges) * 100 : 0;
  const isCompleted = progress?.completedAt !== undefined;
  const isStarted = progress !== null && progress !== undefined;

  return (
    <Link
      to={`/room/${room.id}`}
      className={cn(
        "terminal-card group block transition-all duration-300 relative",
        "hover:border-primary/50 hover:shadow-[0_0_30px_rgba(0,255,128,0.2)]",
        !room.isActive && "opacity-50 pointer-events-none"
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-lg group-hover:text-primary transition-colors glow-text">
                {room.name}
              </h3>
              <span className="text-xs text-muted-foreground font-mono uppercase">
                {room.category}
              </span>
            </div>
          </div>
          
          <span className={cn(
            "text-xs px-2 py-1 rounded border font-mono",
            difficultyColors[room.difficulty] || 'text-muted-foreground border-border'
          )}>
            {room.difficulty}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 font-mono">
          {room.description}
        </p>
      </div>

      {/* Stats & Progress */}
      <div className="p-4 bg-muted/20">
        <div className="flex items-center justify-between text-sm mb-3 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Target className="w-4 h-4" />
              {totalChallenges} TASK
            </span>
            <span className="flex items-center gap-1 text-secondary">
              <Trophy className="w-4 h-4" />
              {room.totalPoints} PTS
            </span>
          </div>
          
          {isCompleted ? (
            <span className="text-success text-xs flex items-center gap-1 font-bold">
              <Trophy className="w-3 h-3" />
              SOLVED
            </span>
          ) : isStarted ? (
            <span className="text-primary text-xs">
              {completedCount}/{totalChallenges}
            </span>
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
        </div>
        
        {/* Progress Bar Container */}
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out shadow-[0_0_10px_rgba(0,255,128,0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Locked Overlay */}
      {!room.isActive && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-[1px] z-10">
          <div className="flex flex-col items-center gap-2 text-muted-foreground animate-pulse">
            <Lock className="w-6 h-6" />
            <span className="font-display text-xs tracking-tighter">ENCRYPTED_DATA</span>
          </div>
        </div>
      )}
    </Link>
  );
};