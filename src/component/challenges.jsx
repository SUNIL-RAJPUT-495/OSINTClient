import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Target, Trophy, Loader2, Flag, AlertCircle, Lightbulb, CheckCircle2, Lock } from 'lucide-react';
import { cn } from "../lib/utils";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummeryApi';
import { toast } from 'react-hot-toast';

export const ChallengeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roomData, setRoomData] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [solvedChallenges, setSolvedChallenges] = useState([]); 
  const [userAnswers, setUserAnswers] = useState({}); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Loading state bahut zaroori hai
  const [flagInput, setFlagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      setIsLoading(true); // Fetching shuru
      try {
        const response = await Axios({
          url: SummaryApi.getroomchallengs.url.replace(":id", id),
          method: SummaryApi.getroomchallengs.method,
          withCredentials: true 
        });

        if (response.data.success) {
          const data = response.data.data;
          setRoomData(data);
          const chs = data.challenges || [];
          setChallenges(chs);
          
          const solvedIds = response.data.solvedIds || [];
          
          // SABSE PEHLE STATE SET KAREIN
          setSolvedChallenges(solvedIds);

          const previousAnswers = response.data.userSubmissions || {};
          const initialAnswers = {};
          solvedIds.forEach(sid => {
            initialAnswers[sid] = previousAnswers[sid] || "DATA_LOCKED_SECURE";
          });
          setUserAnswers(initialAnswers);

          const firstUnsolved = chs.findIndex(c => !solvedIds.includes(c._id));
          if (firstUnsolved !== -1) {
            setCurrentIndex(firstUnsolved);
          } else if (chs.length > 0) {
            navigate("/challaneSuccess", { replace: true });
          }
        }
      } catch (error) {
        toast.error("Failed to load environment");
        navigate("/rooms");
      } finally {
        setIsLoading(false); // Fetching khatam hone par hi UI dikhayein
      }
    };
    if (id) fetchRoomDetails();
  }, [id, navigate]);

  useEffect(() => { 
    setFlagInput(""); 
    setShowHint(false); 
  }, [currentIndex]);

  const currentChallenge = challenges[currentIndex];
 const isCurrentSolved = currentChallenge && solvedChallenges.includes(currentChallenge._id.toString());

  const handleFlagSubmit = async (e) => {
    e.preventDefault();
    const submittedValue = flagInput.trim();
    if (!submittedValue || isCurrentSolved) return;

    setIsSubmitting(true);
    try {
      const response = await Axios({
        url: SummaryApi.submitChallenge.url,
        method: SummaryApi.submitChallenge.method,
        data: {
          challengeId: currentChallenge._id,
          answer: submittedValue, 
        },
        withCredentials: true 
      });

      setUserAnswers(prev => ({ ...prev, [currentChallenge._id]: submittedValue }));
      setSolvedChallenges(prev => [...prev, currentChallenge._id]);

      if (response.data.correct) {
        toast.success("Correct Flag!");
      } else {
        toast.error("Submitted. Moving forward...");
      }

      const isLastQuestion = currentIndex === challenges.length - 1;
      if (!isLastQuestion) {
        setTimeout(() => setCurrentIndex((prev) => prev + 1), 1200);
      } else {
        setTimeout(() => navigate("/challaneSuccess", { 
          state: { roomId: id, total: challenges.length } 
        }), 1500);
      }
    } catch (error) {
      toast.error("Transmission Failure");
    } finally { setIsSubmitting(false); }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center matrix-bg">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <span className="ml-4 font-mono text-primary animate-pulse italic">RESTORING SESSION...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen matrix-bg text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <div className="lg:col-span-1 space-y-4">
          <div className="terminal-card p-4 border-primary/30">
            <h3 className="font-display text-sm font-bold text-primary mb-4 flex items-center gap-2">
              <Target className="w-4 h-4" /> MISSION_NODES
            </h3>
            <div className="space-y-2">
              {challenges.map((ch, index) => {
                const isSolved = solvedChallenges.includes(ch._id);
                return (
                  <button
                    key={ch._id}
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-[11px] font-mono rounded border transition-all flex justify-between items-center",
                      currentIndex === index ? "bg-primary/20 border-primary text-primary" : isSolved ? "border-green-500/30 text-green-500/70 bg-green-500/5" : "border-border/50 text-muted-foreground"
                    )}
                  >
                    <span>{index + 1}. {ch.title.toUpperCase()}</span>
                    {isSolved && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {currentChallenge ? (
            <div className={cn("terminal-card p-6 border-primary/50 relative overflow-hidden transition-all duration-500", isCurrentSolved && "border-green-500/30 bg-green-500/[0.01]")}>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className={cn("text-2xl font-display font-bold", isCurrentSolved ? "text-green-500" : "text-primary")}>{currentChallenge.title}</h2>
                    <p className="text-[10px] text-muted-foreground font-mono mt-1 uppercase tracking-widest">NODE_ID: {currentChallenge._id.slice(-6)}</p>
                  </div>
                  <div className={cn("px-4 py-1 rounded border font-mono text-sm", isCurrentSolved ? "border-green-500/20 text-green-500" : "border-primary/20 text-primary")}>
                    {isCurrentSolved ? "SECURED" : `${currentChallenge.points} PTS`}
                  </div>
                </div>

                <div className="bg-muted/20 p-5 rounded border border-border/40 mb-6 font-mono text-sm leading-relaxed text-foreground/80">
                  {currentChallenge.description}
                </div>

                {currentChallenge.hint && (
                  <div className="mb-6">
                    {!showHint && !isCurrentSolved ? (
                      <button onClick={() => setShowHint(true)} className="flex items-center gap-2 text-[10px] font-mono text-primary/60 hover:text-primary transition-colors bg-primary/5 px-3 py-1.5 rounded border border-primary/20 border-dashed">
                        <Lightbulb className="w-3.5 h-3.5" /> DECRYPT_INTEL_HINT
                      </button>
                    ) : (
                      <div className="bg-yellow-500/5 border border-yellow-500/20 p-4 rounded animate-in fade-in zoom-in-95 duration-300">
                        <h4 className="text-[9px] font-mono text-yellow-500 uppercase mb-1 flex items-center gap-1"><Lightbulb className="w-3 h-3" /> Intel:</h4>
                        <p className="text-sm italic text-yellow-100/70">"{currentChallenge.hint}"</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-10 pt-6 border-t border-border/50">
                    {isCurrentSolved ? (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                             <label className="block text-[10px] font-mono text-green-500/70 mb-3 uppercase tracking-widest">SUBMITTED_ACCESS_KEY</label>
                             <div className="bg-green-500/10 border border-green-500/30 p-4 rounded flex items-center gap-3">
                                <Lock className="w-4 h-4 text-green-500 opacity-50" />
                                <span className="font-mono text-green-400 font-bold tracking-widest break-all">
                                    {userAnswers[currentChallenge._id] || "ENCRYPTED_LOG_PERSISTENT"}
                                </span>
                                <CheckCircle2 className="ml-auto w-5 h-5 text-green-500" />
                             </div>
                             <p className="text-[9px] text-green-500/40 font-mono mt-3 italic uppercase tracking-widest">Resubmission blocked. Authorization verified by Node Admin.</p>
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
                                        onChange={(e) => setFlagInput(e.target.value)}
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
    </div>
  );
};