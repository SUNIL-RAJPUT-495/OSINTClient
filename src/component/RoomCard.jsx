import { Link } from 'react-router-dom';
import { Shield, Target, ChevronRight, Trophy, Lock, Edit, Trash2 } from 'lucide-react';
import { cn } from "../lib/utils";

export const RoomCard = ({ room, type = "user", onEdit, onDelete }) => {
  
  const difficultyColors = {
    Beginner: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
    Intermediate: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
    Advanced: "text-orange-500 border-orange-500/30 bg-orange-500/10",
    Expert: "text-red-500 border-red-500/30 bg-red-500/10",
  };

  const totalChallenges = room.targetChallenges || room.challenges?.length || 0;
  const totalPoints = room.pointsReward || room.totalPoints || 0;
  
  // Progress Logic
  const completedCount = 0; 
  const progressPercent = totalChallenges > 0 ? (completedCount / totalChallenges) * 100 : 0;
  const isStarted = completedCount > 0;
  const isCompleted = completedCount === totalChallenges && totalChallenges > 0;
  const isActive = room.isActive !== false; 

  const isAdmin = type === 'admin';

  // --- LOGIC CHANGE HERE ---
  // Agar Admin hai to alag link, User hai to alag link
  const cardLink = isAdmin 
    ? `/admin/room/${room._id}`  // Admin Manage Page Path
    : `/room/${room._id}`;       // User Game Path

  // Admin Actions wrapper (Button click par card open na ho)
  const handleAdminAction = (e, action) => {
    e.preventDefault(); 
    e.stopPropagation();
    action();
  };

  return (
    <Link
      to={cardLink} // <--- Yahan Dynamic Link use kiya hai
      className={cn(
        "terminal-card group block transition-all duration-300 relative h-full flex flex-col justify-between",
        "hover:border-primary/50 hover:shadow-[0_0_30px_rgba(0,255,128,0.2)]",
        (!isActive && !isAdmin) && "opacity-50 pointer-events-none grayscale"
      )}
    >
      {/* Header Section */}
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
              {room.category && (
                <span className="text-xs text-muted-foreground font-mono uppercase">
                  {room.category}
                </span>
              )}
            </div>
          </div>
          
          <span className={cn(
            "text-xs px-2 py-1 rounded border font-mono uppercase tracking-wider",
            difficultyColors[room.difficulty] || 'text-muted-foreground border-border'
          )}>
            {room.difficulty}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 font-mono h-10">
          {room.description}
        </p>
      </div>

      {/* Footer Section */}
      <div className="p-4 bg-muted/20">
        
        <div className="flex items-center justify-between text-sm mb-3 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Target className="w-4 h-4" />
              {totalChallenges} TASK
            </span>
            <span className="flex items-center gap-1 text-secondary">
              <Trophy className="w-4 h-4" />
              {totalPoints} PTS
            </span>
          </div>

          {!isAdmin && (
             isCompleted ? (
              <span className="text-success text-xs flex items-center gap-1 font-bold">
                <Trophy className="w-3 h-3" /> SOLVED
              </span>
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors transform group-hover:translate-x-1 duration-300" />
            )
          )}
        </div>
        
        {isAdmin ? (
          // Admin View Buttons
          <div className="flex gap-2 mt-2 pt-2 border-t border-border/50">
            <button 
              onClick={(e) => handleAdminAction(e, () => onEdit(room))}
              className="flex-1 py-1.5 rounded text-xs font-bold border border-primary/30 text-primary hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
            >
              <Edit className="w-3 h-3" /> EDIT
            </button>
            <button 
              onClick={(e) => handleAdminAction(e, () => onDelete(room._id))}
              className="flex-1 py-1.5 rounded text-xs font-bold border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-3 h-3" /> DELETE
            </button>
          </div>
        ) : (
          // User View Progress
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out shadow-[0_0_10px_rgba(0,255,128,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Access Denied Overlay (Only for Users) */}
      {(!isActive && !isAdmin) && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-[2px] z-10 border border-destructive/20">
          <div className="flex flex-col items-center gap-2 text-destructive animate-pulse">
            <Lock className="w-8 h-8" />
            <span className="font-display text-sm tracking-widest font-bold">ACCESS_DENIED</span>
          </div>
        </div>
      )}
    </Link>
  );
};