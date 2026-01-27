import { X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import SummaryApi from '../../common/SummeryApi'; 

export const AddChallengeModal = ({ isOpen, onClose, roomId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    hint: "",
    points: "",
    flag: ""
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomId) return alert("Error: Room ID is missing.");

    setIsLoading(true);
    try {
      const response = await axios({
        method: SummaryApi.createChallenge.method,
        url: SummaryApi.createChallenge.url,
        data: {
          ...formData,
          points: Number(formData.points),
          roomId: roomId 
        },
        withCredentials: true
      });

      if (response.data.success) {
        setFormData({ title: "", description: "", hint: "", points: "", flag: "" });
        onClose();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create challenge");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      
      <div 
        className="terminal-card w-full max-w-lg p-4 md:p-6 relative border border-primary/50 shadow-lg shadow-primary/10 max-h-[90vh] overflow-y-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        
        <button onClick={onClose} disabled={isLoading} className="absolute right-4 top-4 text-muted-foreground hover:text-destructive transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h3 className="text-lg md:text-xl font-display font-bold text-primary tracking-wider uppercase">Add New Challenge</h3>
          <p className="text-xs text-muted-foreground font-mono">NODE_INITIALIZATION_IN_PROGRESS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
         
          <div>
            <label className="text-[10px] text-muted-foreground block mb-1 font-mono uppercase tracking-widest">CHALLENGE TITLE</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Hidden in Plain Sight" className="flag-input w-full text-sm" required />
          </div>

          <div>
            <label className="text-[10px] text-muted-foreground block mb-1 font-mono uppercase tracking-widest">DESCRIPTION</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Enter instructions..." className="flag-input w-full resize-none text-sm" required />
          </div>

          <div>
            <label className="text-[10px] text-primary block mb-1 font-mono uppercase tracking-widest font-bold">
              Correct Answer (Flag)
            </label>
            <input 
              type="text" 
              name="flag" 
              value={formData.flag} 
              onChange={handleChange} 
              placeholder="e.g. CTF{secret_key_123}" 
              className="flag-input w-full text-sm border-primary/40 focus:border-primary shadow-[0_0_5px_rgba(0,255,128,0.1)]" 
              required 
            />
            <p className="text-[9px] text-muted-foreground mt-1 italic font-mono uppercase">System: This value will be compared with student input.</p>
          </div>

          <div>
            <label className="text-[10px] text-muted-foreground block mb-1 font-mono uppercase tracking-widest">HINT (Optional)</label>
            <textarea name="hint" value={formData.hint} onChange={handleChange} rows={2} placeholder="Give a subtle hint..." className="flag-input w-full resize-none text-sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-muted-foreground block mb-1 font-mono uppercase tracking-widest">POINTS VALUE</label>
              <input type="number" name="points" value={formData.points} onChange={handleChange} placeholder="e.g. 50" className="flag-input w-full text-sm" required min="0" />
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row gap-3 pt-4">
            <button type="button" onClick={onClose} disabled={isLoading} className="w-full py-2.5 rounded border border-muted-foreground/30 text-muted-foreground hover:bg-muted/10 transition-colors text-xs font-mono">
              CANCEL
            </button>
            <button type="submit" disabled={isLoading} className="w-full py-2.5 rounded bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-[0_0_15px_rgba(0,255,128,0.3)] transition-all text-xs flex items-center justify-center gap-2">
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> PROCESSING...</> : "ADD_CHALLENGE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};