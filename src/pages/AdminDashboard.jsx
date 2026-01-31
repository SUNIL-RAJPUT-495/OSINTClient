import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogOut, Target, Settings, Plus, Loader2, Users } from 'lucide-react';
import { cn } from "../lib/utils";
import { toast } from 'react-hot-toast';

import Axios from '../utils/Axios';
import SummaryApi from '../common/SummeryApi';

import { CreateRoomModal } from '../component/admin/CreateRoomModal';
import { RoomCard } from '../component/RoomCard';
import { RoomDetail } from '../component/admin/RoomDetail';
import { UserDetail } from '../component/admin/userdetail';

export const AdminDashboard = () => {
  const navigate = useNavigate();

  const [allRooms, setAllRooms] = useState([]);
  const [allUsers, setAllUsers] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('admin_activeTab') || 'rooms';
  });

  const [selectedRoomId, setSelectedRoomId] = useState(() => {
    return localStorage.getItem('admin_selectedRoomId') || null;
  });

  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState(null);

  // 2. PERSISTENCE EFFECTS (Jab state change ho, tab save karo)
  useEffect(() => {
    localStorage.setItem('admin_activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (selectedRoomId) {
      localStorage.setItem('admin_selectedRoomId', selectedRoomId);
    } else {
      localStorage.removeItem('admin_selectedRoomId');
    }
  }, [selectedRoomId]);

  // --- API CALLS ---
  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const response = await Axios({
        url: SummaryApi.getAllRooms.url,
        method: SummaryApi.getAllRooms.method,
        withCredentials: true
      });
      if (response.data.success) {
        setAllRooms(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      toast.error("Could not load rooms");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try{
      const response = await Axios({
        url: SummaryApi.getuser.url, 
        method: SummaryApi.getuser.method,
        withCredentials: true
      });
    if (response.data.success) {
        setAllUsers(response.data.data); 
      }
    }
    catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Could not load users list");
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchUsers();
  }, []);

  // --- HANDLERS ---
  const handleLogout = async () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('admin_token');
    
    // Clear Admin Session Data
    localStorage.removeItem('admin_activeTab');
    localStorage.removeItem('admin_selectedRoomId');
    localStorage.removeItem('admin_activeUserId'); // UserDetail ka data
    localStorage.removeItem('admin_activeRoomName'); // UserDetail ka data

    toast.success("Logged out");
    navigate("/");
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      const response = await Axios({
        ...SummaryApi.deleteRoom,
        url: SummaryApi.deleteRoom.url.replace(":id", roomId),
      });
      if (response.data.success) {
        toast.success("Room deleted successfully");
        fetchRooms();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete room");
    }
  };

  const handleEditRoom = (room) => {
    setRoomToEdit(room);
    setIsRoomModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsRoomModalOpen(false);
    setRoomToEdit(null);
    fetchRooms();
  };

  return (
    <div className="min-h-screen matrix-bg relative text-foreground font-sans">
      
      {/* Header */}
      <header className="border-b border-destructive/30 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-destructive" />
              <div>
                <h1 className="font-display text-xl font-bold tracking-wider text-destructive">ADMIN PANEL</h1>
                <div className="text-xs text-muted-foreground">System Control Interface</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">View Site</Link>
              <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 transition-colors">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button 
            onClick={() => { setActiveTab('rooms'); setSelectedRoomId(null); }} 
            className={cn("flex items-center gap-2 px-4 py-3 border-b-2 transition-colors", activeTab === 'rooms' ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground")}
          >
            <Target className="w-4 h-4" /> Rooms & Challenges
          </button>
          <button 
            onClick={() => { setActiveTab('users'); setSelectedRoomId(null); }} 
            className={cn("flex items-center gap-2 px-4 py-3 border-b-2 transition-colors", activeTab === 'users' ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground")}
          >
            <Users className="w-4 h-4" /> User Data
          </button>
          <button 
            onClick={() => { setActiveTab('settings'); setSelectedRoomId(null); }} 
            className={cn("flex items-center gap-2 px-4 py-3 border-b-2 transition-colors", activeTab === 'settings' ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground")}
          >
            <Settings className="w-4 h-4" /> Settings
          </button>
        </div>

        {/* Tab Content: Rooms */}
        {activeTab === 'rooms' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl">{selectedRoomId ? "Room Details" : "Manage Rooms"}</h2>
              {!selectedRoomId && (
                <button onClick={() => { setRoomToEdit(null); setIsRoomModalOpen(true); }} className="btn-terminal-filled flex items-center gap-2">
                  <Plus className="w-4 h-4" /> New Room
                </button>
              )}
            </div>
            {selectedRoomId ? (
              <RoomDetail roomId={selectedRoomId} onBack={() => setSelectedRoomId(null)} />
            ) : (
              isLoading ? (
                <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allRooms.map((room) => (
                    <RoomCard key={room._id} room={room} type="admin" onClick={(id) => setSelectedRoomId(id)} onEdit={() => handleEditRoom(room)} onDelete={() => handleDeleteRoom(room._id)} />
                  ))}
                </div>
              )
            )}
          </div>
        )}

        {/* Tab Content: Users */}
        {activeTab === 'users' && (
          <div className="animate-fade-in">
             <UserDetail allUsers={allUsers} /> 
          </div>
        )}

        {/* Tab Content: Settings */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl animate-fade-in">
            <h2 className="font-display text-xl mb-6">Platform Settings</h2>
            <div className="terminal-card p-6 space-y-6">
              <div>
                <label className="text-xs text-muted-foreground block mb-2">SITE NAME</label>
                <input type="text" defaultValue="OSINT CTF" className="flag-input w-full" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-2">WELCOME MESSAGE</label>
                <textarea defaultValue="Welcome to the OSINT Challenge Platform." rows={3} className="flag-input w-full resize-none" />
              </div>
              <div className="pt-4 border-t border-border">
                <button className="btn-danger w-full py-2">Reset All Progress Data</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <CreateRoomModal isOpen={isRoomModalOpen} onClose={handleCloseModal} roomData={roomToEdit} />
    </div>
  );
};