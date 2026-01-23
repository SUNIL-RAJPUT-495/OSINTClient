import { Navigate, Link } from 'react-router-dom';
import { Shield, LogOut, Target, Settings, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'; 
import { sampleRooms } from '../data/sampleData'; // Path adjust karein
import { useState } from 'react';
import { cn} from "../lib/utils"

export const AdminDashboard = () => {
      const [activeTab, setActiveTab] = useState<'rooms' | 'settings'>('rooms');
 

  return (
    <div className="min-h-screen matrix-bg">
      {/* Admin Header */}
      <header className="border-b border-destructive/30 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Shield className="w-8 h-8 text-destructive" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold tracking-wider text-destructive">
                  ADMIN PANEL
                </h1>
                <div className="text-xs text-muted-foreground">
                  System Control Interface
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                View Site
              </Link>
              <button
                className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('rooms')}
            className={cn(
              "flex items-center gap-2 px-4 py-3 border-b-2 transition-colors",
              activeTab === 'rooms'
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Target className="w-4 h-4" />
            Rooms & Challenges
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={cn(
              "flex items-center gap-2 px-4 py-3 border-b-2 transition-colors",
              activeTab === 'settings'
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>

        {/* Rooms Tab */}
        {activeTab === 'rooms' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl">Manage Rooms</h2>
              <button className="btn-terminal-filled flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Room
              </button>
            </div>

            <div className="space-y-4">
              {sampleRooms.map((room) => (
                <div key={room.id} className="terminal-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded flex items-center justify-center",
                        room.isActive ? "bg-success/20" : "bg-muted"
                      )}>
                        {room.isActive ? (
                          <Eye className="w-5 h-5 text-success" />
                        ) : (
                          <EyeOff className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-display">{room.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {room.challenges.length} challenges • {room.totalPoints} points
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Challenges List */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <h4 className="text-xs text-muted-foreground mb-2">CHALLENGES</h4>
                    <div className="space-y-2">
                      {room.challenges.map((challenge) => (
                        <div
                          key={challenge.id}
                          className="flex items-center justify-between p-2 bg-muted/30 rounded"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                              {challenge.level}
                            </span>
                            <span className="text-sm">{challenge.title}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-secondary">{challenge.points} pts</span>
                            <button className="text-muted-foreground hover:text-primary transition-colors">
                              <Edit className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="mt-3 text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                      <Plus className="w-3 h-3" />
                      Add Challenge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <h2 className="font-display text-xl mb-6">Platform Settings</h2>
            
            <div className="terminal-card p-6 space-y-6">
              <div>
                <label className="text-xs text-muted-foreground block mb-2">
                  SITE NAME
                </label>
                <input
                  type="text"
                  defaultValue="OSINT CTF"
                  className="flag-input"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-2">
                  WELCOME MESSAGE
                </label>
                <textarea
                  defaultValue="Welcome to the OSINT Challenge Platform. Test your open-source intelligence skills."
                  rows={3}
                  className="flag-input resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-2">
                  COMPLETION MESSAGE
                </label>
                <textarea
                  defaultValue="Congratulations! You have completed all challenges. Your skills are impressive."
                  rows={3}
                  className="flag-input resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded">
                <div>
                  <h4 className="font-semibold">Maintenance Mode</h4>
                  <p className="text-sm text-muted-foreground">
                    Disable public access temporarily
                  </p>
                </div>
                <button className="w-12 h-6 rounded-full bg-muted border border-border relative">
                  <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-muted-foreground transition-transform" />
                </button>
              </div>

              <div className="pt-4 border-t border-border">
                <button className="btn-danger w-full">
                  Reset All Progress Data
                </button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  This will clear all user session progress
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};