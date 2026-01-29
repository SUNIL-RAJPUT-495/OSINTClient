import { Mail, Trash2, ArrowLeft, CheckCircle2, XCircle, Zap, Loader2, LayoutGrid, Trophy, Phone, Terminal, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummeryApi';
import { cn } from "../../lib/utils"; 

export const UserDetail = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null); 
  const [loading, setLoading] = useState(true);

  // 1. DATA FETCHING
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await Axios({
        url: SummaryApi.getUserAnalytics.url,
        method: SummaryApi.getUserAnalytics.method,
      });
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // 2. PERSISTENCE LOGIC (Refresh Handle karne ke liye)
  useEffect(() => {
    if (users.length > 0) {
        // LocalStorage se purana data nikalo
        const savedUserId = localStorage.getItem("admin_activeUserId");
        const savedRoomName = localStorage.getItem("admin_activeRoomName");

        if (savedUserId) {
            // User dhundo
            const foundUser = users.find(u => u._id === savedUserId);
            if (foundUser) {
                setSelectedUser(foundUser); // User restore ho gaya

                // Agar User mil gaya, toh Room check karo
                if (savedRoomName) {
                    const attempts = foundUser.details.filter(d => d.roomName === savedRoomName);
                    const roomPoints = attempts.filter(d => d.isCorrect).reduce((sum, d) => sum + (d.pointsAwarded || 0), 0);
                    
                    // Room restore ho gaya
                    setSelectedRoom({ name: savedRoomName, points: roomPoints, count: attempts.length });
                }
            }
        }
    }
  }, [users]); // Ye tab chalega jab API se data aa jayega

  // --- HANDLERS (State + LocalStorage Update) ---

  const handleSelectUser = (user) => {
      setSelectedUser(user);
      localStorage.setItem("admin_activeUserId", user._id); // ID save karo
  };

  const handleSelectRoom = (room) => {
      setSelectedRoom(room);
      localStorage.setItem("admin_activeRoomName", room.name); // Room Name save karo
  };

  const handleBackToUsers = () => {
      setSelectedUser(null);
      setSelectedRoom(null);
      localStorage.removeItem("admin_activeUserId"); // Clear User
      localStorage.removeItem("admin_activeRoomName"); // Clear Room
  };

  const handleBackToSectors = () => {
      setSelectedRoom(null);
      localStorage.removeItem("admin_activeRoomName"); // Sirf Room Clear karo
  };


  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 font-mono text-primary">
      <Loader2 className="w-8 h-8 animate-spin mb-2" />
      <p className="animate-pulse italic">RESTORING_SESSION...</p>
    </div>
  );

  // ============================================================
  // LEVEL 3: INSIDE ROOM (Challenges List)
  // ============================================================
  if (selectedUser && selectedRoom) {
    const roomSubmissions = selectedUser.details.filter(sub => sub.roomName === selectedRoom.name);

    return (
      <div className="animate-in fade-in zoom-in-95 duration-300 space-y-4">
        
        <button 
          onClick={handleBackToSectors} // UPDATED HANDLER
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Sectors
        </button>

        <div className="terminal-card p-4 border-primary/20 bg-black/40">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center">
                        <Terminal className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-display text-lg text-primary uppercase">{selectedRoom.name}</h3>
                        <p className="text-sm text-muted-foreground font-mono">
                            {roomSubmissions.length} Attempts • {selectedRoom.points} PTS Earned
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div className="terminal-card p-4 border-primary/20 bg-black/40">
            <h4 className="text-xs text-muted-foreground mb-4 font-mono tracking-widest uppercase border-b border-primary/10 pb-2">
                Submission_Logs
            </h4>
            <div className="space-y-2">
                {roomSubmissions.map((sub, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/5 hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-3">
                            <span className={cn(
                                "w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold",
                                sub.isCorrect ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                            )}>
                                {idx + 1}
                            </span>
                            <div>
                                <p className="text-sm font-bold text-foreground/90">{sub.challengeTitle}</p>
                                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                                    USER_ANSWER: <span className={cn("italic", sub.isCorrect ? "text-green-400" : "text-red-400")}>"{sub.submittedAnswer}"</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-right mr-2">
                                <span className={cn(
                                    "text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase", 
                                    sub.isCorrect ? "text-green-500 border-green-500/20 bg-green-500/5" : "text-destructive border-destructive/20 bg-destructive/5"
                                )}>
                                    {sub.isCorrect ? "CORRECT" : "WRONG"}
                                </span>
                            </div>
                            {sub.isCorrect ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                                <XCircle className="w-5 h-5 text-destructive" />
                            )}
                        </div>
                    </div>
                ))}
                {roomSubmissions.length === 0 && (
                    <p className="text-center text-muted-foreground font-mono text-xs py-4">NO ACTIVITY LOGGED</p>
                )}
            </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // LEVEL 2: ROOM LIST (User Selected)
  // ============================================================
  if (selectedUser) {
    const userRooms = [...new Set(selectedUser.details.map(item => item.roomName))].map(roomName => {
        const attempts = selectedUser.details.filter(d => d.roomName === roomName);
        const roomPoints = attempts.filter(d => d.isCorrect).reduce((sum, d) => sum + (d.pointsAwarded || 0), 0);
        return { name: roomName, points: roomPoints, count: attempts.length };
    });

    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
        <button 
          onClick={handleBackToUsers} // UPDATED HANDLER
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to User List
        </button>

        <div className="terminal-card p-4 border-primary/20 bg-black/40 flex justify-between items-center">
             <div>
                <h2 className="text-xl text-primary font-display uppercase tracking-widest">{selectedUser.fullName}</h2>
                <div className="flex gap-4 text-[11px] text-muted-foreground font-mono mt-1">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3"/> {selectedUser.email}</span>
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3"/> {selectedUser.mobile || "N/A"}</span>
                </div>
            </div>
            <div className="text-right">
                <span className="text-[10px] text-muted-foreground uppercase">Global PTS</span>
                <p className="text-2xl font-display text-primary">{selectedUser.totalPoints}</p>
            </div>
        </div>

        <h3 className="text-[11px] font-mono text-primary uppercase tracking-widest opacity-70 ml-1">Participated Rooms</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userRooms.length > 0 ? userRooms.map((room, idx) => (
            <div 
              key={idx} 
              onClick={() => handleSelectRoom(room)} // UPDATED HANDLER
              className="terminal-card p-4 border-primary/20 hover:border-primary/60 cursor-pointer transition-all bg-black/40 group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-primary/10 rounded group-hover:bg-primary/20 transition-colors">
                     <LayoutGrid className="w-5 h-5 text-primary" />
                  </div>
                  <Trophy className="w-4 h-4 text-primary/30 group-hover:text-primary transition-colors" />
              </div>
              
              <h4 className="font-display text-lg text-foreground group-hover:text-primary transition-colors uppercase">{room.name || "Unknown"}</h4>
              
              <div className="mt-4 flex justify-between items-end border-t border-white/10 pt-3">
                 <div>
                    <span className="text-[10px] text-muted-foreground block font-mono">Attempts</span>
                    <span className="text-sm font-bold font-mono">{room.count}</span>
                 </div>
                 <div className="text-right">
                    <span className="text-[10px] text-muted-foreground block font-mono">Earned PTS</span>
                    <span className="text-xl font-display text-primary">{room.points}</span>
                 </div>
              </div>
            </div>
          )) : (
            <div className="col-span-3 text-center py-10 border border-dashed border-white/10 rounded">
               <p className="text-muted-foreground font-mono text-xs italic">NO ROOMS FOUND</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // LEVEL 1: USER LIST
  // ============================================================
  return (
    <div className="animate-fade-in space-y-4">
      <h2 className="font-display text-xl text-primary tracking-widest uppercase">Operative_Database</h2>
      
      <div className="terminal-card overflow-hidden border border-primary/20 bg-black/40 shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-primary/20 bg-primary/5">
              <th className="p-4 text-[10px] font-mono text-primary uppercase tracking-widest font-bold">Operative</th>
              <th className="p-4 text-[10px] font-mono text-primary uppercase tracking-widest font-bold">Contact</th>
              <th className="p-4 text-[10px] font-mono text-primary uppercase tracking-widest text-center font-bold">PTS</th>
              <th className="p-4 text-[10px] font-mono text-primary uppercase tracking-widest text-right font-bold">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10">
            {users.map((user) => (
              <tr 
                key={user._id} 
                onClick={() => handleSelectUser(user)} // UPDATED HANDLER
                className="hover:bg-primary/5 transition-all group cursor-pointer"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <span className="font-display font-bold text-primary text-xs">{user.fullName.charAt(0)}</span>
                    </div>
                    <span className="text-sm font-mono font-bold group-hover:text-primary transition-colors uppercase">{user.fullName}</span>
                  </div>
                </td>
                <td className="p-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-2"><Mail className="w-3 h-3"/> {user.email}</span>
                        <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-2"><Phone className="w-3 h-3"/> {user.mobile || "N/A"}</span>
                    </div>
                </td>
                <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-mono text-xs font-bold">
                        <Trophy className="w-3 h-3" /> {user.totalPoints || 0}
                    </span>
                </td>
                <td className="p-4 text-right">
                   <button className="text-primary hover:text-primary/80 transition-colors p-2 bg-primary/10 rounded-full">
                      <Eye className="w-4 h-4" />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};