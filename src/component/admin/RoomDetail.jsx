import { useEffect, useState } from 'react';
import { Edit, Trash2, Eye, EyeOff, Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { baseURL } from '../../common/SummeryApi';
import { AddChallengeModal } from './AddChallengeModal';
import Axios from '../../utils/Axios';
import { cn } from '../../lib/utils';
import SummaryApi from '../../common/SummeryApi';
import { toast } from 'react-hot-toast';

export const RoomDetail = ({ roomId, onBack }) => {

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);

    const [editData, setEditData] = useState(null);

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
            toast.error("Failed to load room details");
        } finally {
            setLoading(false);
        }
    };

    
    const deleteChallenge = async (challengeId) => {
        if (!window.confirm("Delete this challenge?")) return;
        try {
            setLoading(true);
            const response = await Axios({
                url: SummaryApi.deleteChallenge.url.replace(":challengeId", challengeId),
                method: SummaryApi.deleteChallenge.method,
                withCredentials: true,
            });
            if (response.data.success) {
                toast.success("Challenge deleted");
                fetchRoomDetails();
            }
        } catch (error) {
            console.error("Error deleting challenge:", error);
            toast.error("Deletion failed");
        } finally {
            setLoading(false);
        }
    };


    const handleEditClick = (challenge) => {
        setEditData(challenge); 
        setIsChallengeModalOpen(true); 
    };

    useEffect(() => {
        if (roomId) fetchRoomDetails();
    }, [roomId]);

    if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (!room) return <div className="text-white p-4">Room not found.</div>;

    const totalPoints = room.challenges?.reduce((sum, ch) => sum + (Number(ch.points) || 0), 0) || 0;

    return (
        <div className="space-y-4 animation-fade-in">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
                <ArrowLeft className="w-4 h-4" /> Back to List
            </button>

            <div className="terminal-card p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={cn("w-10 h-10 rounded flex items-center justify-center", room.isActive !== false ? "bg-success/20" : "bg-muted")}>
                            {room.isActive !== false ? <Eye className="w-5 h-5 text-success" /> : <EyeOff className="w-5 h-5 text-muted-foreground" />}
                        </div>
                        <div>
                            <h3 className="font-display text-lg">{room.name}</h3>
                            <p className="text-sm text-muted-foreground">
                                {room.challenges?.length || 0} challenges • {totalPoints} points
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                            <Edit className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                    <h4 className="text-xs text-muted-foreground mb-2 font-mono tracking-widest uppercase">Target_Challenges</h4>

                    <div className="space-y-2">
                        {room.challenges?.map((chal, idx) => (
                            <div key={chal._id} className="flex items-center justify-between p-2 bg-muted/30 rounded group hover:bg-muted/50 transition-all">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                        {idx + 1}
                                    </span>
                                    <span className="text-sm">{chal.title}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-secondary font-mono mr-2">{chal.points} pts</span>

                                    <button
                                        className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                                        onClick={() => handleEditClick(chal)}
                                    >
                                        <Edit className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                                        onClick={() => deleteChallenge(chal._id)}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            setEditData(null); 
                            setIsChallengeModalOpen(true);
                        }}
                        className="mt-4 w-full py-2 border border-dashed border-primary/30 rounded text-[10px] font-mono text-primary/70 hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="w-3 h-3" /> ADD_NEW_CHALLENGE
                    </button>
                </div>
            </div>

            <AddChallengeModal
                isOpen={isChallengeModalOpen}
                roomId={roomId}
                editData={editData}
                onClose={() => {
                    setIsChallengeModalOpen(false);
                    setEditData(null);
                    fetchRoomDetails();
                }}
            />
        </div>
    );
};