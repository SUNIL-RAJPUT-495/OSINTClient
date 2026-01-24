import { Link } from 'react-router-dom';
import { Shield, LogOut, Target, Settings, Plus, Loader2 } from 'lucide-react'; 
import { useState, useEffect } from 'react';
import { cn } from "../lib/utils";
import { CreateRoomModal } from '../component/admin/CreateRoomModal';
import { AddChallengeModal } from '../component/admin/AddChallengeModal';
import { RoomCard } from '../component/RoomCard';
import { RoomDetail } from '../component/admin/RoomDetail'; // <-- Import Corrected File
import { getAllRooms } from '../utils/api'; 

export const AdminDashboard = () => {
  const [allRooms, setAllRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rooms');
  
  // STATE: Kaunsa room open karna hai?
  const [selectedRoomId, setSelectedRoomId] = useState(null); 

  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  // Note: ChallengeModal ab RoomDetail ke andar handle ho raha hai

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const data = await getAllRooms();
      if (data) setAllRooms(data.data || data);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleEditRoom = (room) => { console.log("Edit from list", room); };
  const handleDeleteRoom = (roomId) => { console.log("Delete logic here", roomId); };
  
  return (
    <div className="min-h-screen matrix-bg relative">
      {/* Header code same... */}
      <header className="border-b border-destructive/30 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
           {/* ... Header Content ... */}
           <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-destructive" />
              <h1 className="font-display text-xl font-bold tracking-wider text-destructive">ADMIN PANEL</h1>
            </div>
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary">View Site</Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button onClick={() => {setActiveTab('rooms'); setSelectedRoomId(null);}} className={cn("flex items-center gap-2 px-4 py-3 border-b-2 transition-colors", activeTab === 'rooms' ? "border-primary text-primary" : "border-transparent text-muted-foreground")}>
            <Target className="w-4 h-4" /> Rooms & Challenges
          </button>
          <button onClick={() => setActiveTab('settings')} className={cn("flex items-center gap-2 px-4 py-3 border-b-2 transition-colors", activeTab === 'settings' ? "border-primary text-primary" : "border-transparent text-muted-foreground")}>
            <Settings className="w-4 h-4" /> Settings
          </button>
        </div>

        {/* --- MAIN AREA --- */}
        {activeTab === 'rooms' && (
          <div>
            {/* 1. Header Hamesha Dikhega */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl">
                 {selectedRoomId ? "Room Details & Challenges" : "Manage Rooms"}
              </h2>
              
              {/* "New Room" button sirf tab dikhe jab list view ho */}
              {!selectedRoomId && (
                <button onClick={() => setIsRoomModalOpen(true)} className="btn-terminal-filled flex items-center gap-2">
                  <Plus className="w-4 h-4" /> New Room
                </button>
              )}
            </div>

            {/* 2. CONDITIONAL RENDERING (List vs Detail) */}
            {selectedRoomId ? (
              
              // --- A. SHOW DETAIL VIEW ---
              <RoomDetail 
                roomId={selectedRoomId} 
                onBack={() => setSelectedRoomId(null)} // Wapas list par jane ke liye
              />

            ) : (

              // --- B. SHOW LIST VIEW ---
              isLoading ? (
                <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              ) : allRooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allRooms.map((room) => (
                    <RoomCard 
                      key={room._id} 
                      room={room} 
                      type="admin" 
                      // Is click se state change hogi aur view badal jayega
                      onClick={(id) => setSelectedRoomId(id)} 
                      onEdit={handleEditRoom}
                      onDelete={handleDeleteRoom}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border border-dashed border-border rounded bg-muted/10">
                  <p className="text-muted-foreground">No rooms found.</p>
                </div>
              )
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && <div>Settings Content...</div>}
      </main>

      <CreateRoomModal isOpen={isRoomModalOpen} onClose={() => { setIsRoomModalOpen(false); fetchRooms(); }} />
    </div>
  );
};