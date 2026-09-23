import React from 'react';
import { Target, Flame, Plus, Calendar } from 'lucide-react';

export default function Header({ streak = 0, onQuickLog }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 border-b border-[#3a3a3a] bg-[#1e1e1e]/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Brand / Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-[#2d2d2d] border border-[#404040] flex items-center justify-center text-[#f0f0f0]">
          <Target className="w-5 h-5 text-[#f0f0f0]" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold font-sans tracking-tight text-[#f0f0f0] flex items-center gap-2">
            DailyDrill
          </h1>
          <p className="text-xs text-[#a0a0a0] font-normal hidden sm:block">
            Daily practice tracker & focus timer
          </p>
        </div>
      </div>

      {/* Right side items: Streak, Date, Quick Action */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Date Display */}
        <div className="hidden md:flex items-center space-x-2 text-xs font-medium text-[#f0f0f0] bg-[#2d2d2d] px-3 py-1.5 rounded-lg border border-[#3a3a3a]">
          <Calendar className="w-3.5 h-3.5 text-[#a0a0a0]" />
          <span>{today}</span>
        </div>

        {/* Streak Badge */}
        <div className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border ${
          streak > 0
            ? 'bg-[#2d5a3d]/30 text-[#4ade80] border-[#2d5a3d]/50'
            : 'bg-[#2d2d2d] text-[#a0a0a0] border-[#3a3a3a]'
        }`}>
          <Flame className={`w-4 h-4 ${streak > 0 ? 'text-[#4ade80] fill-[#4ade80]' : 'text-[#a0a0a0]'}`} />
          <span>{streak} {streak === 1 ? 'Day' : 'Days'}</span>
        </div>

        {/* Quick Log Button */}
        <button
          onClick={onQuickLog}
          className="flex items-center space-x-2 bg-[#333333] hover:bg-[#404040] text-[#f0f0f0] font-medium text-xs sm:text-sm px-3.5 py-2 rounded-lg border border-[#525252] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#f0f0f0]" />
          <span className="hidden sm:inline">Log Session</span>
        </button>
      </div>
    </header>
  );
}
