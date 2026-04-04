import { User, Settings } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow-sm" style={{ borderBottom: '1px solid #E5E7EB' }}>
      <div className="flex items-center justify-between px-8 py-4">
        <h1 className="text-2xl font-bold" style={{ color: '#4A90E2' }}>
          Student Performance Predictor
        </h1>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <User size={20} style={{ color: '#4A90E2' }} />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Settings size={20} style={{ color: '#4A90E2' }} />
          </button>
        </div>
      </div>
    </header>
  );
}
