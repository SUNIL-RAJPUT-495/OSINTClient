import { X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import SummaryApi from '../../common/SummeryApi'; 

export const AddChallengeModal = ({ isOpen, onClose, roomId }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    points: ""
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!roomId) {
        alert("Error: Room ID is missing. Please try again.");
        return;
    }

    setIsLoading(true);

    try {
      const response = await axios({
        method: SummaryApi.createChallenge.method,
        url: SummaryApi.createChallenge.url,
        data: {
          title: formData.title,
          description: formData.description,
          points: Number(formData.points),
          roomId: roomId 
        },
        withCredentials: true
      });

      if (response.data.success) {
        console.log("Challenge Created:", response.data);
        setFormData({ title: "", description: "", points: "" });
        onClose();
      }
    } catch (error) {
      console.error("Error creating challenge:", error);
      alert(error.response?.data?.message || "Failed to create challenge");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animation-fade-in">
      <div className="terminal-card w-full max-w-lg p-6 relative border border-primary/50 shadow-lg shadow-primary/10">
        
        <button 
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h3 className="text-xl font-display font-bold text-primary">Add New Challenge</h3>
          <p className="text-xs text-muted-foreground">Create a new task for this room</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="text-xs text-muted-foreground block mb-2 font-mono">
              CHALLENGE TITLE
            </label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Hidden in Plain Sight" 
              className="flag-input w-full" 
              required
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground block mb-2 font-mono">
              DESCRIPTION & INSTRUCTIONS
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

          <div>
            <label className="text-xs text-muted-foreground block mb-2 font-mono">
              POINTS VALUE
            </label>
            <input 
              type="number" 
              name="points"
              value={formData.points}
              onChange={handleChange}
              placeholder="e.g. 50" 
              className="flag-input w-full" 
              required
              min="0"
            />
          </div>

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
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Challenge"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};