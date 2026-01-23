import { useState, useEffect, useCallback } from 'react';

const PROGRESS_KEY = 'osint_ctf_progress';

export const useProgress = () => {
  // TypeScript टाइप <Record<string, Progress>> हटा दिया गया है
  const [progress, setProgress] = useState({});

  // LocalStorage से डेटा लोड करना
  useEffect(() => {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (stored) {
      try {
        setProgress(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse progress:', e);
      }
    }
  }, []);

  // प्रोग्रेस सेव करने का फंक्शन
  const saveProgress = useCallback((newProgress) => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(newProgress));
    setProgress(newProgress);
  }, []);

  // किसी खास रूम की प्रोग्रेस निकालना
  const getRoomProgress = useCallback((roomId) => {
    return progress[roomId] || null;
  }, [progress]);

  // नया रूम शुरू करना
  const startRoom = useCallback((roomId) => {
    const newProgress = {
      ...progress,
      [roomId]: {
        roomId,
        currentLevel: 1,
        completedLevels: [],
        startedAt: new Date().toISOString(),
      },
    };
    saveProgress(newProgress);
  }, [progress, saveProgress]);

  // लेवल पूरा करने का लॉजिक
  const completeLevel = useCallback((roomId, level, totalLevels) => {
    const current = progress[roomId];
    if (!current) return;

    // अगर लेवल पहले से पूरा नहीं है, तभी जोड़ें
    const completedLevels = current.completedLevels.includes(level) 
      ? current.completedLevels 
      : [...current.completedLevels, level];
      
    const isComplete = level >= totalLevels;
    
    const newProgress = {
      ...progress,
      [roomId]: {
        ...current,
        completedLevels,
        currentLevel: isComplete ? level : level + 1,
        completedAt: isComplete ? new Date().toISOString() : undefined,
      },
    };
    saveProgress(newProgress);
  }, [progress, saveProgress]);

  // प्रोग्रेस रिसेट करना
  const resetProgress = useCallback((roomId) => {
    if (roomId) {
      const { [roomId]: _, ...rest } = progress;
      saveProgress(rest);
    } else {
      localStorage.removeItem(PROGRESS_KEY);
      setProgress({});
    }
  }, [progress, saveProgress]);

  // चेक करना कि लेवल खुला (Unlocked) है या नहीं
  const isLevelUnlocked = useCallback((roomId, level) => {
    const roomProgress = progress[roomId];
    if (!roomProgress) return level === 1;
    return level <= roomProgress.currentLevel;
  }, [progress]);

  // चेक करना कि लेवल पूरा हो चुका है या नहीं
  const isLevelCompleted = useCallback((roomId, level) => {
    const roomProgress = progress[roomId];
    if (!roomProgress) return false;
    return roomProgress.completedLevels.includes(level);
  }, [progress]);

  return {
    progress,
    getRoomProgress,
    startRoom,
    completeLevel,
    resetProgress,
    isLevelUnlocked,
    isLevelCompleted,
  };
};