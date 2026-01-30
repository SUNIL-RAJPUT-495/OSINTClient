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
  
  // Input States
  const [flagInput, setFlagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  // Error States
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);
  const [backendError, setBackendError] = useState("");

  // --- PERSISTENT STATES (LocalStorage) ---

  const [totalPoints, setTotalPoints] = useState(() => {
    const savedPoints = localStorage.getItem(`points_${id}`);
    return savedPoints ? parseInt(savedPoints) : 100;
  });

  const [solvedChallenges, setSolvedChallenges] = useState(() => {
    const saved = localStorage.getItem(`solved_${id}`);
    return saved ? JSON.parse(saved) : [];
  });

  // New State: Track karo ki User ne Attempt kiya ya nahi (Sahi ya Galat)
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

  // --- EFFECTS ---

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  // Data Fetching
  useEffect(() => {
    const fetchRoomDetails = async () => {
      setIsLoading(true);
      try {
        const response = await Axios({
          url: SummaryApi.getroomchallengs.url.replace(":id", id),
          method: SummaryApi.getroomchallengs.method,
          withCredentials: true,
          // Axios Interceptor headers handle kar lega
        });

        if (response.data.success) {
          const data = response.data.data;
          setRoomData(data);
          const chs = data.challenges || [];
          setChallenges(chs);

          // Backend se solved IDs sync karo
          if (response.data.solvedIds) {
            const combinedSolved = [...new Set([...solvedChallenges, ...response.data.solvedIds])];
            setSolvedChallenges(combinedSolved);
            
            // Backend se jo solved hain, unhe attempted bhi maan lo
            const combinedAttempts = [...new Set([...attemptedChallenges, ...response.data.solvedIds])];
            setAttemptedChallenges(combinedAttempts);
          }

          // Pehla unsolved dhundo
          const firstUnsolved = chs.findIndex(c => !solvedChallenges.includes(c._id.toString()));
          if (firstUnsolved !== -1) setCurrentIndex(firstUnsolved);
        }
      } catch (error) {
        toast.error("Failed to load environment");
        navigate("/rooms");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchRoomDetails();
  }, [id]);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(`solved_${id}`, JSON.stringify(solvedChallenges));
    localStorage.setItem(`attempts_${id}`, JSON.stringify(attemptedChallenges)); // Save Attempts
    localStorage.setItem(`answers_${id}`, JSON.stringify(userAnswers));
    localStorage.setItem(`hints_${id}`, JSON.stringify(hintUsed));
    localStorage.setItem(`points_${id}`, totalPoints.toString());
  }, [solvedChallenges, attemptedChallenges, userAnswers, hintUsed, totalPoints, id]);

  // Reset UI on Question Change
  useEffect(() => {
    setFlagInput("");
    setShowHint(!!hintUsed[currentIndex]);
    setIsWrongAnswer(false);
    setBackendError("");
  }, [currentIndex, hintUsed]);

  // --- VARIABLES ---
  const currentChallenge = challenges[currentIndex];
  
  // Check Sahi hai ya nahi
  const isCurrentSolved = currentChallenge && solvedChallenges.includes(String(currentChallenge._id));
  
  // Check Attempt kiya ya nahi (Lock karne ke liye)
  const isCurrentAttempted = currentChallenge && attemptedChallenges.includes(String(currentChallenge._id));

  // --- HANDLERS ---

  const handleShowHint = async () => {
    if (hintUsed[currentIndex]) {
      setShowHint(true);
      return;
    }

    if (totalPoints < 50) {
      toast.error("Not enough points!");
      return;
    }

    try {
      const response = await Axios({
        url: "/api/user/deduct-points", // Backend route for deduction
        method: "post",
        data: { pointsToDeduct: 50 }
      });

      if (response.data.success) {
        setTotalPoints(prev => prev - 50);
        setHintUsed(prev => ({ ...prev, [currentIndex]: true }));
        setShowHint(true);
        toast.success("Hint Unlocked! 50 Points Deducted.");
      }
    } catch (error) {
      toast.error("Could not unlock hint.");
    }
  };

  const handleFlagSubmit = async (e) => {
    e.preventDefault();
    if (document.activeElement) document.activeElement.blur();

    const submittedValue = flagInput.trim();
    if (!submittedValue || isCurrentAttempted) return; // Agar locked hai to return

    setIsSubmitting(true);
    setIsWrongAnswer(false);
    setBackendError("");

    try {
      const response = await Axios({
        url: SummaryApi.submitChallenge.url,
        method: SummaryApi.submitChallenge.method,
        data: {
          challengeId: currentChallenge._id,
          answer: submittedValue,
        }
      });

      if (response.data.success) {
        const cid = String(currentChallenge._id);

        // 1. LOCK THE INPUT (Chahe sahi ho ya galat)
        setAttemptedChallenges(prev => [...new Set([...prev, cid])]);
        setUserAnswers(prev => ({ ...prev, [cid]: submittedValue }));

        // CASE 1: WRONG ANSWER
        if (!response.data.correct) {
            setIsWrongAnswer(true);
            setBackendError(response.data.message || "Incorrect Flag"); 
            toast.error("Incorrect Flag. Node Locked.");
            setIsSubmitting(false);
            return;
        }

        // CASE 2: CORRECT ANSWER
        setSolvedChallenges(prev => [...new Set([...prev, cid])]);
        
        // Add Points
        const pointsReward = currentChallenge.points || 0;
        setTotalPoints(prev => prev + pointsReward);
        toast.success(`Flag Accepted! +${pointsReward} XP Added.`);

        // Navigation
        const isLastQuestion = currentIndex === challenges.length - 1;
        if (!isLastQuestion) {
          setTimeout(() => setCurrentIndex((prev) => prev + 1), 1200);
        } else {
          setTimeout(() => navigate("/challaneSuccess", {
            state: { roomId: id, total: challenges.length, points: totalPoints + pointsReward }
          }), 1500);
        }
      }
    } catch (error) {
      setIsWrongAnswer(true);
      const msg = error.response?.data?.message || "Server Error";
      setBackendError(msg.toUpperCase());
      toast.error("Error: " + msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen matrix-bg text-foreground">
      {/* HEADER */}
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
          
          {/* SIDEBAR: QUESTION LIST */}
          <div className="lg:col-span-1 space-y-4">
            <div className="terminal-card p-4 border-primary/30">
              <h3 className="font-display text-sm font-bold text-primary mb-4 flex items-center gap-2">
                <Target className="w-4 h-4" /> MISSION_NODES
              </h3>
              <div className="space-y-2">
                {challenges.map((ch, index) => {
                  const isSolved = solvedChallenges.includes(ch._id.toString());
                  const isAttempted = attemptedChallenges.includes(ch._id.toString());
                  const isFailed = isAttempted && !isSolved;

                  return (
                    <button
                      key={ch._id}
                      onClick={() => setCurrentIndex(index)}
                      className={cn(
                        "w-full text-left px-3 py-2 text-[11px] font-mono rounded border transition-all flex justify-between items-center",
                        currentIndex === index ? "bg-primary/20 border-primary text-primary" 
                        : isSolved ? "border-green-500/30 text-green-500/70 bg-green-500/5" 
                        : isFailed ? "border-red-500/30 text-red-500/70 bg-red-500/5"
                        : "border-border/50 text-muted-foreground"
                      )}
                    >
                      <span>{index + 1}. {ch.title.toUpperCase()}</span>
                      {isSolved && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                      {isFailed && <XCircle className="w-3 h-3 text-red-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* MAIN: CHALLENGE AREA */}
          <div className="lg:col-span-3 space-y-6">
            {currentChallenge ? (
              <div className={cn("terminal-card p-6 border-primary/50 relative overflow-hidden transition-all duration-500", 
                  isCurrentSolved && "border-green-500/30 bg-green-500/[0.01]",
                  (isCurrentAttempted && !isCurrentSolved) && "border-red-500/30 bg-red-500/[0.01]"
              )}>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className={cn("text-2xl font-display font-bold", isCurrentSolved ? "text-green-500" : isCurrentAttempted ? "text-red-500" : "text-primary")}>
                        {currentChallenge.title}
                    </h2>
                    <p className="text-[10px] text-muted-foreground font-mono mt-1 uppercase tracking-widest">NODE_ID: {currentChallenge._id.slice(-6)}</p>
                  </div>
                  <div className={cn("px-4 py-1 rounded border font-mono text-sm", isCurrentSolved ? "border-green-500/20 text-green-500" : "border-primary/20 text-primary")}>
                    {isCurrentSolved ? "SECURED" : `${currentChallenge.points} PTS`}
                  </div>
                </div>

                <div className="bg-muted/20 p-5 rounded border border-border/40 mb-6 font-mono text-sm leading-relaxed text-foreground/80">
                  {currentChallenge.description}
                </div>

                {/* HINT SECTION */}
                {currentChallenge.hint && (
                  <div className="mb-6">
                    {!showHint && !isCurrentSolved ? (
                      <div className="flex flex-col items-start gap-2">
                        <button onClick={handleShowHint} className="flex items-center gap-2 text-[10px] font-mono text-primary/60 hover:text-primary transition-colors bg-primary/5 px-3 py-1.5 rounded border border-primary/20 border-dashed">
                          <Lightbulb className="w-3.5 h-3.5" /> DECRYPT_INTEL_HINT
                        </button>
                        <p className="flex items-center gap-1.5 text-[9px] font-mono text-destructive/80 animate-pulse">
                          <AlertTriangle className="w-3 h-3" /> WARNING: VIEWING HINT WILL DEDUCT 50 PTS
                        </p>
                      </div>
                    ) : (
                      <div className="bg-yellow-500/5 border border-yellow-500/20 p-4 rounded animate-in fade-in zoom-in-95 duration-300">
                        <h4 className="text-[9px] font-mono text-yellow-500 uppercase mb-1 flex items-center gap-1"><Lightbulb className="w-3 h-3" /> Intel:</h4>
                        <p className="text-sm italic text-yellow-100/70">"{currentChallenge.hint}"</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ERROR MESSAGE (Only before locking) */}
                {isWrongAnswer && !isCurrentAttempted && (
                  <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-mono text-red-400">ALERT: {backendError}</span>
                  </div>
                )}

                <div className="mt-10 pt-6 border-t border-border/50">
                  {/* --- LOGIC: AGAR ATTEMPT KIYA HAI TO LOCK KARO --- */}
                  {isCurrentAttempted ? (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <label className={cn("block text-[10px] font-mono mb-3 uppercase tracking-widest", isCurrentSolved ? "text-green-500/70" : "text-red-500/70")}>
                        {isCurrentSolved ? "SECURED_ACCESS_KEY" : "FAILED_ATTEMPT_LOG"}
                      </label>
                      <div className={cn("border p-4 rounded flex items-center gap-3", 
                          isCurrentSolved ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
                      )}>
                        {isCurrentSolved ? <Lock className="w-4 h-4 text-green-500 opacity-50" /> : <AlertTriangle className="w-4 h-4 text-red-500 opacity-50" />}
                        
                        <span className={cn("font-mono font-bold tracking-widest break-all", isCurrentSolved ? "text-green-400" : "text-red-400 line-through decoration-red-500/50")}>
                          {userAnswers[currentChallenge._id.toString()] || "ENCRYPTED_LOG_PERSISTENT"}
                        </span>
                        
                        {isCurrentSolved ? (
                          <CheckCircle2 className="ml-auto w-5 h-5 text-green-500" />
                        ) : (
                          <div className="ml-auto flex items-center gap-2">
                             <span className="text-[10px] text-red-400 font-mono uppercase">LOCKED</span>
                             <Lock className="w-5 h-5 text-red-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleFlagSubmit} className="space-y-4">
                      <label className="block text-[10px] font-mono text-primary mb-2 uppercase tracking-widest">Input_Auth_Flag</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Flag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="text"
                            autoComplete="off"
                            placeholder="NC-FLAG{...}"
                            className="flag-input w-full pl-10"
                            value={flagInput}
                            onChange={(e) => {
                                setFlagInput(e.target.value);
                                setIsWrongAnswer(false);
                            }}
                            required
                          />
                        </div>
                        <button type="submit" disabled={isSubmitting} className="btn-terminal-filled px-8 flex items-center gap-2 uppercase font-mono text-xs tracking-widest">
                          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "SUBMIT"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            ) : null}

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