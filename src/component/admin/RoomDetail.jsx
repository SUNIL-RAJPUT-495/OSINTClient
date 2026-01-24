import { useEffect, useState } from 'react';
import { Edit, Trash2, Eye, EyeOff, Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from "../../lib/utils";
import SummaryApi from '../../common/SummeryApi'; // Spelling check karein (Summary vs Summery)
import { AddChallengeModal } from './AddChallengeModal';
import Axios from '../../utils/Axios';

export const RoomDetail = ({ roomId, onBack }) => {

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);

  // --- API CALL ---
  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      const requestUrl = `http://localhost:8080/api/room/get-room/${roomId}`;
      
      const response = await Axios({
        url: requestUrl,
        method: SummaryApi.getroomchallengs.method,
        withCredentials: true,
      });

      console.log("API Response:", response.data); // Console check karein

      if (response.data.success) {
        setRoom(response.data.data); // Data set hote hi list render ho jayegi
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

  if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!room) return <div>Room not found.</div>;

  return (
    <div className="space-y-4 animation-fade-in">

      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to List
      </button>

      {/* --- ROOM INFO CARD --- */}
      <div className="terminal-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-10 h-10 rounded flex items-center justify-center",
              room.isActive ? "bg-success/20" : "bg-muted"
            )}>
              {room.isActive ? (
                <Eye className="w-5 h-5 text-success" />
              ) : (
                <EyeOff className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <h3 className="font-display">{room.name}</h3>
              <p className="text-sm text-muted-foreground">
                {/* YAHAN SE LIST COUNT AATA HAI */}
                {room.challenges?.length || 0} challenges • {room.pointsReward} points
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

        {/* --- CHALLENGES LIST SECTION --- */}
        <div className="mt-4 pt-4 border-t border-border">
          <h4 className="text-xs text-muted-foreground mb-2">CHALLENGES</h4>

          <div className="space-y-2">
            {/* LOGIC: Yahan 'room.challenges' array map ho raha hai.
                Agar Backend ne populate karke bheja hai, to ye list dikhegi.
            */}
            {room.challenges?.map((challenge, index) => (
              <div
                key={challenge._id}
                className="flex items-center justify-between p-2 bg-muted/30 rounded hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{challenge.title}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">{challenge.description}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-secondary font-mono">{challenge.points} pts</span>
                  <button className="text-muted-foreground hover:text-primary transition-colors">
                    <Edit className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}

            {(!room.challenges || room.challenges.length === 0) && (
              <p className="text-xs text-muted-foreground italic py-2">No challenges added yet.</p>
            )}
          </div>

          {/* Add Challenge Button */}
          <button
            onClick={() => setIsChallengeModalOpen(true)}
            className="mt-3 text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add Challenge
          </button>
        </div>
      </div>

      {/* Modal Integration */}
      <AddChallengeModal
        isOpen={isChallengeModalOpen}
        roomId={roomId}
        onClose={() => {
            setIsChallengeModalOpen(false);
            fetchRoomDetails(); // FIX 2: Modal band hone par data refresh karein
        }}
      />
    </div>
  );
};