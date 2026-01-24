import { Edit, Trash2, Eye, EyeOff, Plus } from 'lucide-react'; 
import { cn } from "../../lib/utils";
import { sampleRooms } from '../../data/sampleData';
export const RoomDetail = () => {
  return (
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
                    
                    {/* BUTTON TO OPEN CHALLENGE MODAL */}
                    <button 
                      onClick={() => setIsChallengeModalOpen(true)}
                      className="mt-3 text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add Challenge
                    </button>
                  </div>
                </div>
              ))}
            </div>

    )}