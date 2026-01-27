import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Target, Trophy, Loader2, Flag, AlertCircle } from 'lucide-react';
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

 useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await Axios({
          url: SummaryApi.getroomchallengs.url.replace(":id", id), 
          method: SummaryApi.getroomchallengs.method,
        });

        if (response.data.success) {
          setRoomData(response.data.data);
          setChallenges(response.data.data.challenges || []);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load challenges");
        navigate("/rooms");
      } finally {
        setIsLoading(false);
      }
    };

    if(id) fetchRoomDetails();
  }, [id, navigate]);

  const currentChallenge = challenges[currentIndex];

  const handleFlagSubmit = async (e) => {
    e.preventDefault();
    if (!flagInput.trim()) return;

    setIsSubmitting(true);
    try {
        toast.success("Correct Flag! Challenge Deciphered.");
        setFlagInput("");
    } catch (error) {
        toast.error("Invalid Flag. Try again, Operative.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center matrix-bg">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen matrix-bg text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar: Mission Log */}
        <div className="lg:col-span-1 space-y-4">
          <div className="terminal-card p-4 border-primary/30">
            <h3 className="font-display text-sm font-bold text-primary mb-4 flex items-center gap-2">
              <Target className="w-4 h-4" /> MISSION LOG
            </h3>
            <div className="space-y-2">
              {challenges.map((ch, index) => (
                <button
                  key={ch._id}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-xs font-mono rounded border transition-all",
                    currentIndex === index 
                      ? "bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]" 
                      : "border-border/50 text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {index + 1}. {ch.title.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="terminal-card p-4 bg-primary/5 border-dashed">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-muted-foreground">PROGRESS</span>
              <span className="text-primary">{challenges.length > 0 ? Math.round(((currentIndex + 1) / challenges.length) * 100) : 0}%</span>
            </div>
            <div className="w-full bg-muted h-1 mt-2 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-500" 
                style={{ width: challenges.length > 0 ? `${((currentIndex + 1) / challenges.length) * 100}%` : '0%' }}
              />
            </div>
          </div>
        </div>

        {/* Challenge Detail Area */}
        <div className="lg:col-span-3 space-y-6">
          {currentChallenge ? (
            <>
              <div className="terminal-card p-6 border-primary/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Trophy className="w-24 h-24" />
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-primary tracking-tight">
                      {currentChallenge.title}
                    </h2>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      ID: {currentChallenge._id.slice(-8).toUpperCase()} | ROOM: {roomData?.name}
                    </p>
                  </div>
                  <div className="px-4 py-1 rounded bg-primary/10 border border-primary/20 text-primary font-mono text-sm">
                    {currentChallenge.points} POINTS
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded border border-border/50 mb-6">
                  <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {currentChallenge.description}
                  </p>
                </div>

                {/* Submission Area */}
                <div className="mt-10 pt-6 border-t border-border/50">
                   <label className="block text-xs font-mono text-primary mb-3">SUBMIT ANSWARE</label>
                   <form onSubmit={handleFlagSubmit} className="flex gap-2">
                      <div className="relative flex-1">
                        <Flag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                          type="text"
                          placeholder="ANSWARE"
                          className="flag-input w-full pl-10"
                          value={flagInput}
                          onChange={(e) => setFlagInput(e.target.value)}
                        />
                      </div>
                      <button 
                        disabled={isSubmitting}
                        className="btn-terminal-filled px-8 flex items-center gap-2"
                      >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "SUBMIT"}
                      </button>
                   </form>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center px-2">
                 <button 
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex(prev => prev - 1)}
                    className="text-xs font-mono text-muted-foreground hover:text-primary disabled:opacity-30 transition-colors"
                 >
                    &lt; PREVIOUS SOURCE
                 </button>
                 <button 
                    disabled={currentIndex === challenges.length - 1}
                    onClick={() => setCurrentIndex(prev => prev + 1)}
                    className="text-xs font-mono text-muted-foreground hover:text-primary disabled:opacity-30 transition-colors"
                 >
                    NEXT SOURCE &gt;
                 </button>
              </div>
            </>
          ) : (
            <div className="terminal-card p-20 text-center">
               <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
               <p className="text-muted-foreground">No challenges found in this environment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};