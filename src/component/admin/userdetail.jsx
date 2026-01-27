import { Mail, Trash2 } from 'lucide-react';

export const UserDetail = ({ allUsers }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-xl mb-6 text-primary tracking-widest">
        OPERATIVE_DATABASE
      </h2>
      <div className="terminal-card overflow-hidden border border-primary/20 bg-black/40 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-primary/20 bg-primary/5">
                <th className="p-4 text-xs font-mono text-primary uppercase tracking-widest">Username</th>
                <th className="p-4 text-xs font-mono text-primary uppercase tracking-widest">Email</th>
                <th className="p-4 text-xs font-mono text-primary uppercase tracking-widest">Joined</th>
                <th className="p-4 text-xs font-mono text-primary uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {allUsers && allUsers.length > 0 ? (
                allUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-primary/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,128,0.8)] animate-pulse"></div>
                        <span className="font-mono text-sm">{user.fullName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-primary/60" /> 
                        {user.email}
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs text-muted-foreground">
                      {new Date(user.createdAt || user.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-muted-foreground hover:text-destructive transition-all duration-300 transform hover:scale-110">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-muted-foreground font-mono italic">
                    NO_OPERATIVES_FOUND_IN_SYSTEM
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};