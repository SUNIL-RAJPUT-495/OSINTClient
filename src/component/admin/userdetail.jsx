import { Mail, Trash2, ArrowLeft, CheckCircle2, XCircle, Zap, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummeryApi';
import { cn } from "../../lib/utils"; // Utility function for classes

export const UserDetail = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Analytics Data Fetch karein jab component load ho
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await Axios({
        url: SummaryApi.getUserAnalytics.url,
        method: SummaryApi.getUserAnalytics.method,
      });
      console.log('Analytics Response:', res.data);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 font-mono text-primary">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <p className="animate-pulse">FETCHING_OPERATIVE_DATA...</p>
      </div>
    );
  }

  // 2. DETAILED VIEW: Jab kisi user par click ho
  if (selectedUser) {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        <button 
          onClick={() => setSelectedUser(null)}
          className="flex items-center gap-2 text-primary font-mono text-xs mb-6 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> BACK_TO_DATABASE
        </button>

        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="font-display text-2xl text-primary uppercase">{selectedUser.fullName}</h2>
            <p className="text-muted-foreground font-mono text-xs italic">{selectedUser.email}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-muted-foreground block uppercase">TOTAL_XP_ACCUMULATED</span>
            <span className="text-2xl font-display text-primary">{selectedUser.totalPoints || 0} XP</span>
          </div>
        </div>

        <div className="terminal-card border-primary/20 bg-black/40 p-4">
          <h3 className="text-xs font-mono text-primary mb-4 border-b border-primary/10 pb-2 uppercase tracking-widest">
            user <details></details>
          </h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {selectedUser.submissions && selectedUser.submissions.length > 0 ? (
              selectedUser.submissions.map((sub, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-white/5 rounded bg-white/5 hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-4">
                    {sub.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
                    ) : (
                      <XCircle className="w-4 h-4 text-destructive" />
                    )}
                    <div>
                      <p className="text-sm font-mono text-foreground/90">
                        {sub.challenge?.title || "SYSTEM_CHALLENGE"}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                         INPUT: <span className="text-primary/70 italic">{sub.submittedAnswer}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "text-xs font-mono font-bold", 
                      sub.isCorrect ? "text-green-500" : "text-destructive"
                    )}>
                      {sub.isCorrect ? `+${sub.pointsEarned || sub.challenge?.points} XP` : "ACCESS_DENIED"}
                    </span>
                    <p className="text-[9px] text-muted-foreground uppercase">
                      {new Date(sub.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-10 text-muted-foreground font-mono text-xs italic">
                NO_ACTIVITY_LOGGED_FOR_THIS_OPERATIVE
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-xl mb-6 text-primary tracking-widest uppercase">OPERATIVE_DATABASE</h2>
      <div className="terminal-card overflow-hidden border border-primary/20 bg-black/40 backdrop-blur-md shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-primary/20 bg-primary/5">
                <th className="p-4 text-xs font-mono text-primary uppercase tracking-widest">Operative</th>
                <th className="p-4 text-xs font-mono text-primary uppercase tracking-widest">Email</th>
                <th className="p-4 text-xs font-mono text-primary uppercase tracking-widest text-center">Attempts</th>
                <th className="p-4 text-xs font-mono text-primary uppercase tracking-widest text-center">Score</th>
                <th className="p-4 text-xs font-mono text-primary uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {users.map((user) => (
                <tr 
                  key={user._id} 
                  onClick={() => setSelectedUser(user)} 
                  className="hover:bg-primary/5 transition-colors group cursor-pointer"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,128,0.8)]"></div>
                      <span className="font-mono text-sm group-hover:text-primary transition-colors">
                        {user.fullName}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground font-mono text-xs italic">{user.email}</td>
                  <td className="p-4 text-center font-mono text-xs">{user.submissions?.length || 0}</td>
                  <td className="p-4 text-center">
                    <span className="font-mono text-sm text-primary font-bold">{user.totalPoints || 0}</span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation();  }} 
                      className="text-muted-foreground hover:text-destructive transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};