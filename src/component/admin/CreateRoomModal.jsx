import { X, ChevronDown, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from "../../lib/utils"; 
import axios from 'axios'; 
import SummaryApi from "../../common/SummeryApi";

export const CreateRoomModal = ({ isOpen, onClose }) => {
  // ... (Baki saara state aur logic same rahega) ...
  const [isDifficultyOpen, setIsDifficultyOpen] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "", // Description state added
    totalChallenges: "",
    points: ""
  });

  const difficultyOptions = ["Beginner", "Intermediate", "Advanced", "Expert"];

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDifficulty) { alert("Please select a difficulty level"); return; }
    setIsLoading(true);

    try {
      const response = await axios({
        method: SummaryApi.createRoom.method,
        url: SummaryApi.createRoom.url,
        data: {
          name: formData.name,
          description: formData.description, 
          totalChallenges: Number(formData.totalChallenges), 
          totalPoints: Number(formData.points), 
          difficulty: selectedDifficulty
        },
        withCredentials: true 
      });

      if (response.data.success) {
        setFormData({ name: "", description: "", totalChallenges: "", points: "" });
        setSelectedDifficulty("");
        onClose();
      }
    } catch (error) {
      console.error("Error creating room:", error);
      alert(error.response?.data?.message || "Error creating room");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animation-fade-in p-4">
      
      {/* CHANGE: Added 'no-scrollbar' class here */}
      <div className="terminal-card w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar p-4 sm:p-6 relative border border-primary/50 shadow-lg shadow-primary/10">
        
        <button 
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h3 className="text-xl font-display font-bold text-primary">Create New Room</h3>
          <p className="text-xs text-muted-foreground">Add a new environment for challenges</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Room Name */}
          <div>
            <label className="text-xs text-muted-foreground block mb-2 font-mono">ROOM NAME</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Cyber Intelligence" 
              className="flag-input w-full"
              required 
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="text-xs text-muted-foreground block mb-2 font-mono">
              DESCRIPTION & INSTRUCTIONS
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Enter the challenge details and clues here..."
              className="flag-input w-full resize-none"
              required
            />
          </div>
          
          {/* Total Challenges */}
          <div>
            <label className="text-xs text-muted-foreground block mb-2 font-mono">TOTAL CHALLENGES</label>
            <input 
              type="number" 
              name="totalChallenges"
              value={formData.totalChallenges}
              onChange={handleChange}
              placeholder="0" 
              className="flag-input w-full"
              required
              min="0"
            />
          </div>
          
          {/* Difficulty Dropdown */}
          <div className="relative">
            <label className="text-xs text-muted-foreground block mb-2 font-mono">DIFFICULTY LEVEL</label>
            <button 
              type="button" 
              onClick={() => setIsDifficultyOpen(!isDifficultyOpen)}
              className="flag-input w-full flex items-center justify-between text-left"
            >
              <span className={selectedDifficulty ? "text-foreground" : "text-muted-foreground"}>
                {selectedDifficulty || "Select Difficulty..."}
              </span>
              <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isDifficultyOpen && "rotate-180")} />
            </button>

            {isDifficultyOpen && (
              <div className="absolute top-full left-0 w-full mt-1 bg-card border border-primary/30 rounded-md shadow-lg shadow-black/50 z-50 overflow-hidden">
                {difficultyOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => { setSelectedDifficulty(option); setIsDifficultyOpen(false); }}
                    className="px-4 py-2 cursor-pointer text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors border-b border-white/5 last:border-0"
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Points Input */}
          <div>
            <label className="text-xs text-muted-foreground block mb-2 font-mono">POINTS REWARD</label>
            <input 
              type="number" 
              name="points"
              value={formData.points}
              onChange={handleChange}
              placeholder="0" 
              className="flag-input w-full" 
              required
              min="0"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 mt-2">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isLoading}
              className="flex-1 py-2 rounded border border-muted-foreground/30 text-muted-foreground hover:bg-muted/10 transition-colors text-sm disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 py-2 rounded bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : "Create Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};