import React, { useState } from 'react';
import { Navigation } from './Navigation';
import { TodoList } from './TodoList';
import { FinanceTracker } from './FinanceTracker';
import { AIChat } from './AIChat';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('todo');

  const renderContent = () => {
    switch (activeTab) {
      case 'todo':
        return <TodoList />;
      case 'finance':
        return <FinanceTracker />;
      case 'chat':
        return <AIChat />;
      default:
        return <TodoList />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-25 to-pink-100">
      <div className="container mx-auto px-4 py-6">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-pink-800 mb-2">Tari Anjani 🎉</h1>
          <p className="text-pink-600">Atur hidup kamu dengan style! ✨</p>
        </header>
        
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="mt-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};