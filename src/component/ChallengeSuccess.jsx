import { useNavigate, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Trophy, Home, RotateCcw, CheckCircle2, Star, Zap } from 'lucide-react';

export const ChallengeSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams(); 
    const roomId = location.state?.roomId;
    const totalChallenges = location.state?.total;
    const totalPoints = location.state?.points;
    const correctCount = totalChallenges; 

    return (
        <div className="min-h-screen matrix-bg flex items-center justify-center p-4">
            <div className="terminal-card max-w-2xl w-full p-8 text-center relative overflow-hidden border-primary/50 shadow-[0_0_30px_rgba(var(--primary),0.1)]">
                
                <Trophy className="absolute -top-10 -right-10 w-48 h-48 text-primary opacity-[0.03] rotate-12" />

                <div className="relative z-10 space-y-6">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center animate-bounce shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                            <Trophy className="w-10 h-10 text-primary" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl font-display font-bold text-primary tracking-tighter uppercase italic">
                            Mission_Accomplished
                        </h1>
                        <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
                            All Challengs have been processed.
                        </p>
                    </div>

                    <hr className="border-primary/20" />

                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <Zap className="w-4 h-4 text-yellow-500" />
                                <span className="text-[10px] font-mono text-muted-foreground uppercase">Total_Score</span>
                            </div>
                            <div className="text-3xl font-display font-bold text-white tracking-widest">
                                {totalPoints}
                            </div>
                        </div>
                        <div className="bg-success/5 border border-success/20 p-4 rounded-lg">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span className="text-[10px] font-mono text-muted-foreground uppercase">Attempts</span>
                            </div>
                            <div className="text-3xl font-display font-bold text-green-500 tracking-widest">
                                {correctCount}/{totalChallenges}
                            </div>
                        </div>
                    </div>

                    <div className="bg-muted/10 p-4 rounded border border-white/5 italic font-mono text-sm text-foreground/70">
                        "Congratulations, operator. Your contribution to the network security has been logged. Continue to the next environment for further clearance."
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button 
                            onClick={() => navigate('/rooms')}
                            className="btn-terminal-filled flex-1 py-3 flex items-center justify-center gap-2 uppercase text-xs font-mono tracking-widest"
                        >
                            <Home className="w-4 h-4" /> Return_to_Rooms
                        </button>
                        <button 
                            onClick={() => navigate(`/challenge/${id}`)}
                            className="w-full sm:w-auto px-8 py-3 rounded border border-primary/30 text-primary hover:bg-primary/10 transition-all uppercase text-xs font-mono tracking-widest"
                        >
                            <RotateCcw className="w-4 h-4 inline-block mr-2" /> Review_Nodes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};