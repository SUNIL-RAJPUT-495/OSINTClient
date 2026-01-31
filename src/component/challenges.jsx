import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Target, Trophy, Loader2, Flag, AlertCircle, Lightbulb, CheckCircle2, Lock, ChevronLeft, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from "../lib/utils";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummeryApi';
import { toast } from 'react-hot-toast';

export const ChallengeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roomData, setRoomData] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const [flagInput, setFlagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);
  const [backendError, setBackendError] = useState("");

  // Persistent States
  const [totalPoints, setTotalPoints] = useState(() => {
    const saved = localStorage.getItem(`points_${id}`);
    return saved ? parseInt(saved) : 100;
  });

  const [solvedChallenges, setSolvedChallenges] = useState(() => {
    const saved = localStorage.getItem(`solved_${id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [attemptedChallenges, setAttemptedChallenges] = useState(() => {
    const saved = localStorage.getItem(`attempts_${id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [userAnswers, setUserAnswers] = useState(() => {
    const saved = localStorage.getItem(`answers_${id}`);
    return saved ? JSON.parse(saved) : {};
  });

  const [hintUsed, setHintUsed] = useState(() => {
    const saved = localStorage.getItem(`hints_${id}`);
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [currentIndex]);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      setIsLoading(true);
      try {
        const response = await Axios({
          url: SummaryApi.getroomchallengs.url.replace(":id", id),
          method: SummaryApi.getroomchallengs.method,
          withCredentials: true,
        });

        if (response.data.success) {
          setRoomData(response.data.data);
          setChallenges(response.data.data.challenges || []);
          if (response.data.solvedIds) {
             const solved = [...new Set([...solvedChallenges, ...response.data.solvedIds])];
             setSolvedChallenges(solved);
             const attempts = [...new Set([...attemptedChallenges, ...response.data.solvedIds])];
             setAttemptedChallenges(attempts);
          }
        }
      } catch (error) {
        toast.error("Failed to load");
        navigate("/rooms");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchRoomDetails();
  }, [id]);

  useEffect(() => {
    localStorage.setItem(`solved_${id}`, JSON.stringify(solvedChallenges));
    localStorage.setItem(`attempts_${id}`, JSON.stringify(attemptedChallenges));
    localStorage.setItem(`answers_${id}`, JSON.stringify(userAnswers));
    localStorage.setItem(`hints_${id}`, JSON.stringify(hintUsed));
    localStorage.setItem(`points_${id}`, totalPoints.toString());
  }, [solvedChallenges, attemptedChallenges, userAnswers, hintUsed, totalPoints, id]);

  useEffect(() => {
    setFlagInput("");
    setShowHint(!!hintUsed[currentIndex]);
    setIsWrongAnswer(false);
    setBackendError("");
  }, [currentIndex, hintUsed]);

  const currentChallenge = challenges[currentIndex];
  const isCurrentSolved = currentChallenge && solvedChallenges.includes(String(currentChallenge._id));
  const isCurrentAttempted = currentChallenge && attemptedChallenges.includes(String(currentChallenge._id));

  // --- HINT HANDLER: VISUAL DEDUCTION ONLY ---
  const handleShowHint = () => {
    if (hintUsed[currentIndex]) {
      setShowHint(true);
      return;
    }

    if (totalPoints < 50) {
        toast.error("Low Balance! Need 50 PTS.");
        return;
    }

    // 1. VISUAL DEDUCTION: Turant frontend se kam kar do
    setTotalPoints(prev => prev - 50); 
    
    // 2. Mark hint as used
    setHintUsed(prev => ({ ...prev, [currentIndex]: true }));
    setShowHint(true);
    
    toast("Hint Unlocked! (50 PTS deducted visually)", {
        icon: '⚠️',
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
    });
  };

  // --- SUBMIT HANDLER: BACKEND CALCULATION ---
  const handleFlagSubmit = async (e) => {
    e.preventDefault();
    const submittedValue = flagInput.trim();
    if (!submittedValue || isCurrentAttempted) return;

    setIsSubmitting(true);
    setIsWrongAnswer(false);

    const didUseHint = hintUsed[currentIndex] || false;
    
    try {
      const response = await Axios({
        url: SummaryApi.submitChallenge.url,
        method: SummaryApi.submitChallenge.method,
        data: {
          challengeId: currentChallenge._id,
          answer: submittedValue,
          usedHint: didUseHint 
        }
      });

      if (response.data.success) {
        const cid = String(currentChallenge._id);
        
        setAttemptedChallenges(prev => [...new Set([...prev, cid])]);
        setUserAnswers(prev => ({ ...prev, [cid]: submittedValue }));

        if (!response.data.correct) {
            setIsWrongAnswer(true);
            setBackendError("Incorrect Flag");
            toast.error("Incorrect Flag. Node Locked.");
            setIsSubmitting(false);
            return;
        }

        setSolvedChallenges(prev => [...new Set([...prev, cid])]);
        
        // --- POINTS LOGIC (MATHS FIX) ---
        // Kyunki humne pehle hi 50 minus kar diye the (Visual),
        // Ab hum pure points add karenge taaki maths balance ho jaye.
        // Example: 100 - 50 (Hint) + 100 (Reward) = 150 Total.
        // Backend bhi yahi karega: 100 (Base) + 50 (Net Reward) = 150 Total.
        
        const fullChallengePoints = currentChallenge.points || 0;
        setTotalPoints(prev => prev + fullChallengePoints);
        
        if (didUseHint) {
             toast.success(`Correct! +${fullChallengePoints - 50} Net XP Added.`);
        } else {
             toast.success(`Correct! +${fullChallengePoints} XP Added.`);
        }

        const isLastQuestion = currentIndex === challenges.length - 1;
        if (!isLastQuestion) setTimeout(() => setCurrentIndex(prev => prev + 1), 1200);
        else setTimeout(() => navigate("/challaneSuccess", { state: { points: totalPoints + fullChallengePoints } }), 1500);
      }
    } catch (error) {
      setIsWrongAnswer(true);
      setBackendError("Server Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen matrix-bg text-foreground">
      <nav className="border-b border-primary/20 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate('/rooms')} className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="w-4 h-4" /> EXIT_SECTOR
          </button>
          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded border border-primary/30">
            <Trophy className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono text-sm font-bold text-primary tracking-tighter">
              {totalPoints} <span className="text-[10px] opacity-70">PTS</span>
            </span>
          </div>
        </div>
      </nav>

      <main className="p-4 md:p-8 pb-40">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-1 space-y-4">
             <div className="terminal-card p-4 border-primary/30">
                <h3 className="font-display text-sm font-bold text-primary mb-4 flex items-center gap-2"><Target className="w-4 h-4" /> NODES</h3>
                <div className="space-y-2">
                    {challenges.map((ch, idx) => {
                        const isSolved = solvedChallenges.includes(ch._id.toString());
                        const isFailed = attemptedChallenges.includes(ch._id.toString()) && !isSolved;
                        return (
                            <button key={ch._id} onClick={() => setCurrentIndex(idx)} 
                                className={cn("w-full text-left px-3 py-2 text-[11px] font-mono rounded border flex justify-between",
                                currentIndex === idx ? "bg-primary/20 border-primary text-primary" : 
                                isSolved ? "border-green-500/30 text-green-500" : 
                                isFailed ? "border-red-500/30 text-red-500" : "border-border/50 text-muted-foreground")}>
                                <span>{idx+1}. {ch.title}</span>
                                {isSolved && <CheckCircle2 className="w-3 h-3" />}
                                {isFailed && <XCircle className="w-3 h-3" />}
                            </button>
                        )
                    })}
                </div>
             </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {currentChallenge && (
                <div className={cn("terminal-card p-6 border-primary/50 relative overflow-hidden", isCurrentSolved && "border-green-500/30 bg-green-500/[0.01]", (isCurrentAttempted && !isCurrentSolved) && "border-red-500/30 bg-red-500/[0.01]")}>
                    <div className="flex justify-between mb-6">
                        <h2 className={cn("text-2xl font-display font-bold", isCurrentSolved ? "text-green-500" : isCurrentAttempted ? "text-red-500" : "text-primary")}>{currentChallenge.title}</h2>
                        <div className="px-4 py-1 rounded border font-mono text-sm border-primary/20 text-primary">{currentChallenge.points} PTS</div>
                    </div>
                    <div className="bg-muted/20 p-5 rounded border border-border/40 mb-6 font-mono text-sm">{currentChallenge.description}</div>

                    {currentChallenge.hint && (
                        <div className="mb-6">
                            {!showHint && !isCurrentSolved ? (
                                <button onClick={handleShowHint} className="flex items-center gap-2 text-[10px] font-mono text-primary/60 hover:text-primary bg-primary/5 px-3 py-1.5 rounded border border-primary/20 border-dashed">
                                    <Lightbulb className="w-3.5 h-3.5" /> UNLOCK HINT (-50 PTS)
                                </button>
                            ) : (
                                <div className="bg-yellow-500/5 border border-yellow-500/20 p-4 rounded"><p className="text-sm italic text-yellow-100/70">"{currentChallenge.hint}"</p></div>
                            )}
                        </div>
                    )}

                    {isWrongAnswer && !isCurrentAttempted && (
                        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <span className="text-sm font-mono text-red-400">{backendError}</span>
                        </div>
                    )}

                    <div className="mt-10 pt-6 border-t border-border/50">
                        {isCurrentAttempted ? (
                            <div className={cn("border p-4 rounded flex items-center gap-3", isCurrentSolved ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30")}>
                                {isCurrentSolved ? <Lock className="w-4 h-4 text-green-500 opacity-50"/> : <AlertTriangle className="w-4 h-4 text-red-500 opacity-50"/>}
                                <span className={cn("font-mono font-bold tracking-widest", isCurrentSolved ? "text-green-400" : "text-red-400 line-through")}>{userAnswers[currentChallenge._id] || "LOG_ENCRYPTED"}</span>
                            </div>
                        ) : (
                            <form onSubmit={handleFlagSubmit} className="flex gap-2">
                                <input type="text" placeholder="NC-FLAG{...}" className="flag-input w-full pl-4" value={flagInput} onChange={(e) => {setFlagInput(e.target.value); setIsWrongAnswer(false);}} required />
                                <button type="submit" disabled={isSubmitting} className="btn-terminal-filled px-8 font-mono text-xs">{isSubmitting ? <Loader2 className="animate-spin" /> : "SUBMIT"}</button>
                            </form>
                        )}
                    </div>
                </div>
            )}
            <div className="flex justify-between items-center px-2 pt-4">
              <button disabled={currentIndex === 0} onClick={() => setCurrentIndex(prev => prev - 1)} className="text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors uppercase">&lt;&lt; Prev_Node</button>
              <button disabled={currentIndex === challenges.length - 1} onClick={() => setCurrentIndex(prev => prev + 1)} className="text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors uppercase">Next_Node &gt;&gt;</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};