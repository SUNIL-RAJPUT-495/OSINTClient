import { useEffect, useState } from 'react';
import { TerminalHeader } from '../component/TerminalHeader';
import { RoomCard } from '../component/RoomCard';
import { Target, Filter, Loader2 } from 'lucide-react'; 
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummeryApi';

export const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        url: SummaryApi.getAllRooms.url,
        method: SummaryApi.getAllRooms.method,
        withCredentials: true,
      });

      if (response.data.success) {
        setRooms(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen matrix-bg">
      <div className="scanline" />
      
      <TerminalHeader />
      
      <main className="container mx-auto px-4 py-8">
        
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-primary animate-pulse" />
            <h1 className="font-display text-2xl glow-text uppercase tracking-widest">
              AVAILABLE OPERATIONS
            </h1>
          </div>
          <p className="text-muted-foreground font-mono text-sm">
            [SYSTEM]: Select an operation to begin your OSINT investigation
          </p>
        </div>

        <div className="flex items-center gap-4 mb-6 border-b border-border/30 pb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
            <Filter className="w-4 h-4" />
            <span className="font-mono">FILTER: ALL_DIFFICULTIES</span>
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <RoomCard
                  key={room._id} 
                  room={room}
                  type="user" 
                />
              ))
            ) : (
              <div className="col-span-full terminal-card p-12 text-center border-dashed border-2 border-primary/20">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <h3 className="font-display text-xl mb-2 text-muted-foreground">
                  NO OPERATIONS_FOUND
                </h3>
                <p className="text-muted-foreground font-mono text-sm">
                  Check back later for new encrypted challenges.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};