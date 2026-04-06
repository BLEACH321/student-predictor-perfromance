import { LayoutDashboard, UserPlus, TrendingUp, BarChart3, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ activeView, onViewChange, isOpen, onClose }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Monitor Dashboard', icon: LayoutDashboard, color: 'text-primary' },
    { id: 'add-student', label: 'Student Intake', icon: UserPlus, color: 'text-emerald-500' },
    { id: 'predictions', label: 'Smart Predictions', icon: TrendingUp, color: 'text-teacher' },
    { id: 'analytics', label: 'Bulk Analytics', icon: BarChart3, color: 'text-indigo-500' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed inset-y-0 left-0 z-50 lg:static lg:block
        w-80 border-r border-border/50 bg-card h-full flex flex-col pt-8 pb-4 transition-transform duration-300 transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="px-6 mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/25">
              <TrendingUp size={24} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">Admin Console</h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Intelligence Hub</p>
            </div>
          </div>
          
          <button onClick={onClose} className="lg:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 overflow-y-auto space-y-10">
          <div>
            <h3 className="px-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 opacity-50">Main Operations</h3>
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onViewChange(item.id)}
                      className={`w-full group relative flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? 'bg-primary text-white shadow-lg shadow-primary/20'
                          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-white/20' : 'bg-transparent group-hover:bg-muted'}`}>
                          <Icon size={18} className={isActive ? 'text-white' : item.color} />
                        </div>
                        <span className="font-bold text-sm">{item.label}</span>
                      </div>
                      {isActive && (
                        <motion.div layoutId="active-nav" className="absolute left-0 w-1 h-6 bg-white rounded-full ml-1" />
                      )}
                      {!isActive && (
                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-muted-foreground" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        <div className="px-6 mt-auto">
          <div className="p-5 rounded-2xl bg-muted/30 border border-border/50">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Logged in as <strong className="text-foreground">Staff Admin</strong>. System health is optimal.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
