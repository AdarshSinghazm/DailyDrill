import React from 'react';
import Header from './Header';
import Navigation from './Navigation';
import { storage } from '../../utils/storage';

export default function Layout({ activeTab, setActiveTab, children }) {
  const streak = storage.calculateStreak();

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-[#f0f0f0] flex flex-col font-sans">
      {/* Top Header */}
      <Header streak={streak} onQuickLog={() => setActiveTab('log')} />

      {/* Main Body with Sidebar + View Content */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto pb-16 md:pb-0">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
