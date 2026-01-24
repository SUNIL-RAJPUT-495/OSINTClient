import { Link } from 'react-router-dom';
import { Shield, Target, Trophy, Edit, Trash2 } from 'lucide-react';
import { cn } from "../lib/utils"; // CN Imported

export const RoomCard = ({ room, type = "user", onEdit, onDelete, onClick }) => {
  // ... (Constants same) ...
  const isActive = room.isActive !== false; 
  const isAdmin = type === 'admin';
  const cardLink = isAdmin ? `/admin/room/${room._id}` : `/room/${room._id}`;

  const handleAdminAction = (e, action) => {
    e.preventDefault(); e.stopPropagation(); action();
  };

  return (
    <Link
      to={cardLink}
      // Click Handler for Dashboard switching
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick(room._id);
        }
      }}
      className={cn(
        "terminal-card group block transition-all duration-300 relative h-full flex flex-col justify-between",
        "hover:border-primary/50 hover:shadow-[0_0_30px_rgba(0,255,128,0.2)]",
        (!isActive && !isAdmin) && "opacity-50 pointer-events-none grayscale"
      )}
    >
       {/* ... (Baki ka design code same) ... */}
       <div className="p-6 border-b border-border">
          <div className="flex items-start justify-between mb-4">
             <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded bg-primary/20 flex items-center justify-center">
                 <Shield className="w-6 h-6 text-primary" />
               </div>
               <div>
                  <h3 className="font-display text-lg">{room.name}</h3>
               </div>
             </div>
             <span className={cn("text-xs px-2 py-1 rounded border font-mono uppercase", "text-muted-foreground border-border")}>
               {room.difficulty}
             </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{room.description}</p>
       </div>

       <div className="p-4 bg-muted/20">
         {/* ... Footer Stats ... */}
         {isAdmin && (
            <div className="flex gap-2 mt-2 pt-2 border-t border-border/50">
               <button onClick={(e) => handleAdminAction(e, () => onEdit(room))} className="flex-1 py-1 text-xs border border-primary/30 text-primary">EDIT</button>
               <button onClick={(e) => handleAdminAction(e, () => onDelete(room._id))} className="flex-1 py-1 text-xs border border-destructive/30 text-destructive">DELETE</button>
            </div>
         )}
       </div>
    </Link>
  );
};