import { Shield, Target, Trophy, Edit, Trash2, ChevronRight } from 'lucide-react';
import { cn } from "../lib/utils";

// Link import hata diya kyunki hum div use karenge dashboard switching ke liye
// import { Link } from 'react-router-dom'; 

export const RoomCard = ({ room, type = "user", onEdit, onDelete, onClick }) => {
  
  // Logic same rahega...
  const challengeCount = room.challenges?.length || 0;
  const totalPoints = room.challenges?.reduce((sum, ch) => sum + (Number(ch.points)||0), 0) || 0;
  
  const isActive = room.isActive !== false; 
  const isAdmin = type === 'admin';

  // --- HELPER FUNCTION FOR CLICK ---
  const handleCardClick = (e) => {
      e.preventDefault();
      if (onClick) {
          onClick(room._id); // Parent ko ID bhejo
      }
  };

  const difficultyColors = {
    Beginner: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
    Intermediate: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
    Advanced: "text-orange-500 border-orange-500/30 bg-orange-500/10",
    Expert: "text-red-500 border-red-500/30 bg-red-500/10",
  };

  return (
    <div // Link ki jagah div use kiya taaki page reload na ho
      onClick={handleCardClick}
      className={cn(
        "terminal-card group block transition-all duration-300 relative h-full flex flex-col justify-between cursor-pointer", // cursor-pointer add kiya
        "hover:border-primary/50 hover:shadow-[0_0_30px_rgba(0,255,128,0.2)]",
        (!isActive && !isAdmin) && "opacity-50 pointer-events-none grayscale"
      )}
    >
       {/* HEADER */}
       <div className="p-6 border-b border-border">
         <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg group-hover:text-primary transition-colors">
                      {room.name}
                  </h3>
                </div>
            </div>
            <span className={cn("text-xs px-2 py-1 rounded border font-mono uppercase", difficultyColors[room.difficulty])}>
                {room.difficulty}
            </span>
         </div>
         <p className="text-sm text-muted-foreground line-clamp-2 h-10">{room.description}</p>
       </div>

       {/* FOOTER */}
       <div className="p-4 bg-muted/20">
         <div className="flex items-center justify-between text-sm mb-3 font-mono">
            <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-muted-foreground group-hover:text-primary"><Target className="w-4 h-4" /> {challengeCount} Tasks</span>
                <span className="flex items-center gap-1 text-secondary font-bold"><Trophy className="w-4 h-4" /> {totalPoints} PTS</span>
            </div>
         </div>
         
         {/* Edit/Delete Buttons logic... (OnClick par stopPropagation zaroori hai) */}
         {isAdmin && (
            <div className="flex gap-2 mt-2 pt-2 border-t border-border/50">
                <button onClick={(e) => { e.stopPropagation(); onEdit(room); }} className="flex-1 py-1 text-xs border border-primary/30 text-primary hover:bg-primary/10">EDIT</button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(room._id); }} className="flex-1 py-1 text-xs border border-destructive/30 text-destructive hover:bg-destructive/10">DELETE</button>
            </div>
         )}
       </div>
    </div>
  );
};