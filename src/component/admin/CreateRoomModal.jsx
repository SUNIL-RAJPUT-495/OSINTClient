import { X, ChevronDown, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast'; 
import { cn } from "../../lib/utils"; 
import Axios from '../../utils/Axios'; 
import SummaryApi from "../../common/SummeryApi"; 

export const CreateRoomModal = ({ isOpen, onClose, roomData }) => { 
  const [isDifficultyOpen, setIsDifficultyOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "", 
    difficulty: "",
    pointsReward: "" 
  });

  const difficultyOptions = ["Beginner", "Intermediate", "Advanced", "Expert"];

  useEffect(() => {
    if (roomData && isOpen) {
        setFormData({
            name: roomData.name || "",
            description: roomData.description || "",
            difficulty: roomData.difficulty || "",
            pointsReward: roomData.pointsReward || ""
        });
    } else if (!roomData && isOpen) {
        setFormData({
            name: "",
            description: "", 
            difficulty: "",
            pointsReward: ""
        });
    }
  }, [roomData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDifficultySelect = (option) => {
      setFormData(prev => ({ ...prev, difficulty: option }));
      setIsDifficultyOpen(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        let apiConfig;
        
        if (roomData) {
            apiConfig = {
                url: SummaryApi.updateRoom.url.replace(":id", roomData._id),
                method: SummaryApi.updateRoom.method,
                data: formData
            };
        } else {
            apiConfig = {
                url: SummaryApi.createRoom.url,
                method: SummaryApi.createRoom.method,
                data: formData
            };
        }

        const res = await Axios(apiConfig);

        if(res.data.success) {
            toast.success(roomData ? "Room Updated Successfully" : "Room Created Successfully");
            onClose(); 
        }

    } catch(err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Operation failed");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animation-fade-in p-4">
      
      <div className="terminal-card w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar p-4 sm:p-6 relative border border-primary/50 shadow-lg shadow-primary/10">
        
        <button 
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h3 className="text-xl font-display font-bold text-primary">
            {roomData ? "Edit Room" : "Create New Room"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {roomData ? "Update room details and configurations" : "Add a new environment for challenges"}
          </p>
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

          {/* Description */}
          <div>
            <label className="text-xs text-muted-foreground block mb-2 font-mono">
              DESCRIPTION
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Enter details..."
              className="flag-input w-full resize-none"
              required
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
              <span className={formData.difficulty ? "text-foreground" : "text-muted-foreground"}>
                {formData.difficulty || "Select Difficulty..."}
              </span>
              <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isDifficultyOpen && "rotate-180")} />
            </button>

            {isDifficultyOpen && (
              <div className="absolute top-full left-0 w-full mt-1 bg-card border border-primary/30 rounded-md shadow-lg shadow-black/50 z-50 overflow-hidden">
                {difficultyOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => handleDifficultySelect(option)}
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
              name="pointsReward" 
              value={formData.pointsReward}
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
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : (roomData ? "Update Room" : "Create Room")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};