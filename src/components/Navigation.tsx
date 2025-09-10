import React from 'react';
import { CheckSquare, TrendingUp, MessageCircle, LogOut } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const handleLogout = () => {
    localStorage.removeItem('userPin');
    window.location.reload();
  };

  const tabs = [
    { id: 'todo', label: 'Todo List', icon: CheckSquare },
    { id: 'finance', label: 'Keuangan', icon: TrendingUp },
    { id: 'chat', label: 'AI Chat', icon: MessageCircle },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-pink-200/30 p-2">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 min-w-24 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg transform scale-105'
                  : 'text-pink-700 hover:bg-pink-100'
              }`}
            >
              <Icon size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
        
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-pink-700 hover:bg-red-100 transition-all"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </div>
  );
};