import { useEffect, useState } from 'react';
import { Edit, Trash2, Eye, EyeOff, Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { baseURL } from '../../common/SummeryApi';
import { AddChallengeModal } from './AddChallengeModal';
import Axios from '../../utils/Axios';
import { cn } from '../../lib/utils';

export const RoomDetail = ({ roomId, onBack }) => {

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);

  // --- API CALL ---
  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      const requestUrl = `${baseURL}/api/room/get-room/${roomId}`;

      const response = await Axios({
        url: requestUrl,
        method: 'get',
        withCredentials: true,
      });

      if (response.data.success) {
        setRoom(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching room:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (roomId) fetchRoomDetails();
  }, [roomId]);

  // 
  // 1. LOADING STATE CHECK (Must be first)
  if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  
  // 2. NULL CHECK (Must be second)
  if (!room) return <div className="text-white p-4">Room not found.</div>;

  // 3. CALCULATION (Safe to do here because we know 'room' exists)
  const totalPoints = room.challenges?.reduce((sum, ch) => sum + (Number(ch.points)||0), 0) || 0;

  return (
    <div className="space-y-4 animation-fade-in">
      
      {/* BACK BUTTON */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to List
      </button>

      {/* MAIN CARD */}
      <div className="terminal-card p-4">
        
        {/* ROOM HEADER INFO */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className={cn(
                    "w-10 h-10 rounded flex items-center justify-center",
                    room.isActive !== false ? "bg-success/20" : "bg-muted"
                )}>
                    {room.isActive !== false ? (
                        <Eye className="w-5 h-5 text-success" />
                    ) : (
                        <EyeOff className="w-5 h-5 text-muted-foreground" />
                    )}
                </div>
                <div>
                    <h3 className="font-display text-lg">{room.name}</h3>
                    <p className="text-sm text-muted-foreground">
                        {/* Display Calculated Points Here */}
                        {room.challenges?.length || 0} challenges • {totalPoints} points
                    </p>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                    <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>

        {/* --- CHALLENGES LIST (Compact Style) --- */}
        <div className="mt-4 pt-4 border-t border-border">
            <h4 className="text-xs text-muted-foreground mb-2">CHALLENGES</h4>
            
            <div className="space-y-2">
                {room.challenges?.map((chal, idx) => (
                    <div
                        key={chal._id}
                        className="flex items-center justify-between p-2 bg-muted/30 rounded"
                    >
                        <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                {idx + 1}
                            </span>
                            <span className="text-sm">{chal.title}</span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-secondary">{chal.points} pts</span>
                            <button className="text-muted-foreground hover:text-primary transition-colors">
                                <Edit className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                ))}

                {(!room.challenges || room.challenges.length === 0) && (
                    <p className="text-xs text-muted-foreground italic p-1">No challenges added yet.</p>
                )}
            </div>

            {/* Simple Text Button */}
            <button
                onClick={() => setIsChallengeModalOpen(true)}
                className="mt-3 text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
                <Plus className="w-3 h-3" />
                Add Challenge
            </button>
        </div>

      </div>

      <AddChallengeModal
        isOpen={isChallengeModalOpen}
        roomId={roomId}
        onClose={() => {
            setIsChallengeModalOpen(false);
            fetchRoomDetails();
        }}
      />
    </div>
  );
};