import { UserCircle, Settings, LogOut, Bell, Search } from 'lucide-react';

interface AdminHeaderProps {
  onLogout: () => void;
}

export function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <header className="bg-card border-b border-border/50 px-8 py-4 sticky top-0 z-30 shadow-premium-sm bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-2 bg-muted/50 border border-border/50 rounded-2xl px-4 py-2 w-96 group focus-within:bg-card focus-within:ring-4 focus-within:ring-primary/5 transition-all">
            <Search size={18} className="text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search students, analytics, reports..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/50 font-medium"
            />
          </div>
        </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-2xl border border-border/50">
              <button className="p-2.5 rounded-xl hover:bg-card hover:text-primary transition-all text-muted-foreground relative group">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card" />
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Notifications</span>
              </button>
              <button className="p-2.5 rounded-xl hover:bg-card hover:text-primary transition-all text-muted-foreground group relative">
                <Settings size={20} />
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Settings</span>
              </button>
            </div>
            
            <div className="w-px h-8 bg-border/50 mx-2" />
            
            <button
              onClick={onLogout}
              className="p-2.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all group relative border border-destructive/10"
            >
              <LogOut size={20} />
              <span className="absolute -bottom-10 right-0 px-2 py-1 bg-foreground text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Sign Out</span>
            </button>
          </div>
      </div>
    </header>
  );
}

