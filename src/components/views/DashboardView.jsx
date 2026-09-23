import React from 'react';
import { 
  Flame, 
  Clock, 
  Target, 
  BookOpen, 
  PlusCircle, 
  ArrowRight, 
  TrendingUp
} from 'lucide-react';
import { storage } from '../../utils/storage';

export default function DashboardView({ entries = [], onNavigate }) {
  const streak = storage.calculateStreak();

  const totalMinutes = entries.reduce((acc, curr) => {
    return acc + (Number(curr.duration) || 0);
  }, 0);

  const totalWords = entries
    .filter(e => e.category === 'Writing')
    .reduce((acc, curr) => acc + (Number(curr.wordCount) || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="minimal-card rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#242424] border border-[#3a3a3a] text-[#f0f0f0] text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5 text-[#f0f0f0]" />
          <span>DailyDrill</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f0f0f0] tracking-tight">
          Start your practice journey.
        </h2>
        <p className="text-[#a0a0a0] text-sm leading-relaxed max-w-2xl">
          {streak > 0 ? (
            <>You are on a <strong className="text-[#4ade80] font-bold">{streak}-day streak</strong>! Keep building momentum.</>
          ) : (
            <>Log your first session today to start your daily streak and build lasting consistency.</>
          )}
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('log')}
            className="inline-flex items-center space-x-2 bg-[#404040] hover:bg-[#525252] text-[#f0f0f0] text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl border border-[#525252] shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#f0f0f0]" />
            <span>Log Practice Session</span>
          </button>
          <button
            onClick={() => onNavigate('topics')}
            className="inline-flex items-center space-x-2 bg-[#242424] hover:bg-[#333333] text-[#f0f0f0] text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl border border-[#3a3a3a] transition-all cursor-pointer"
          >
            <Target className="w-4 h-4 text-[#a0a0a0]" />
            <span>Browse 20 Prompts</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="minimal-card p-4.5 rounded-xl">
          <div className="flex items-center justify-between text-[#a0a0a0] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Practice Time</span>
            <Clock className="w-4 h-4 text-[#a0a0a0]" />
          </div>
          <div className="text-2xl font-bold text-[#f0f0f0] font-sans">{totalMinutes} <span className="text-xs text-[#a0a0a0] font-normal">mins</span></div>
          <p className="text-[11px] text-[#a0a0a0] mt-1">
            Consumption & Speaking
          </p>
        </div>

        {/* Metric 2: Streak Card */}
        <div className={`minimal-card p-4.5 rounded-xl transition-all ${
          streak > 0 ? 'border-[#2d5a3d]/50 bg-[#2d5a3d]/20' : ''
        }`}>
          <div className="flex items-center justify-between text-[#a0a0a0] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Current Streak</span>
            <Flame className={`w-4 h-4 ${streak > 0 ? 'text-[#4ade80] fill-[#4ade80]' : 'text-[#a0a0a0]'}`} />
          </div>
          <div className={`text-2xl font-bold font-sans ${streak > 0 ? 'text-[#4ade80]' : 'text-[#f0f0f0]'}`}>
            {streak} <span className="text-xs text-[#a0a0a0] font-normal">days</span>
          </div>
          <p className="text-[11px] text-[#a0a0a0] mt-1">
            {streak > 0 ? 'Active daily streak ✓' : 'No active streak yet'}
          </p>
        </div>

        {/* Metric 3 */}
        <div className="minimal-card p-4.5 rounded-xl">
          <div className="flex items-center justify-between text-[#a0a0a0] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Sessions</span>
            <Target className="w-4 h-4 text-[#a0a0a0]" />
          </div>
          <div className="text-2xl font-bold text-[#f0f0f0] font-sans">{entries.length}</div>
          <p className="text-[11px] text-[#a0a0a0] mt-1">Logs recorded</p>
        </div>

        {/* Metric 4 */}
        <div className="minimal-card p-4.5 rounded-xl">
          <div className="flex items-center justify-between text-[#a0a0a0] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Words Written</span>
            <BookOpen className="w-4 h-4 text-[#a0a0a0]" />
          </div>
          <div className="text-2xl font-bold text-[#f0f0f0] font-sans">{totalWords} <span className="text-xs text-[#a0a0a0] font-normal">words</span></div>
          <p className="text-[11px] text-[#a0a0a0] mt-1">Writing practice</p>
        </div>
      </div>

      {/* Recent Activity Stream */}
      <div className="minimal-card p-5 sm:p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#3a3a3a] pb-3">
          <div>
            <h3 className="text-base font-bold text-[#f0f0f0]">Recent Activity Logs</h3>
            <p className="text-xs text-[#a0a0a0]">Consumption, Speaking, and Writing entries</p>
          </div>
          {entries.length > 0 && (
            <button 
              onClick={() => onNavigate('stats')}
              className="text-xs font-bold text-[#f0f0f0] hover:text-white flex items-center gap-1 cursor-pointer"
            >
              History & Stats <ArrowRight className="w-3.5 h-3.5 text-[#a0a0a0]" />
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#242424] border border-[#3a3a3a] text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#2d2d2d] border border-[#3a3a3a] text-[#f0f0f0] flex items-center justify-center mx-auto">
              <PlusCircle className="w-5 h-5 text-[#a0a0a0]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#f0f0f0]">No practice sessions logged yet</h4>
              <p className="text-xs text-[#a0a0a0] mt-1 max-w-sm mx-auto">
                Ready to practice? Click "Log Practice Session" to record your first entry.
              </p>
            </div>
            <button
              onClick={() => onNavigate('log')}
              className="inline-flex items-center space-x-2 bg-[#404040] hover:bg-[#525252] text-[#f0f0f0] text-xs font-semibold px-4 py-2 rounded-lg border border-[#525252] transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#f0f0f0]" />
              <span>Log First Entry</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {entries.slice(0, 6).map((entry) => {
              const isConsumption = entry.category === 'Consumption';
              const isSpeaking = entry.category === 'Speaking';
              const isWriting = entry.category === 'Writing';

              return (
                <div key={entry.id} className="p-4 rounded-xl border border-[#3a3a3a] bg-[#242424] space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#333333] text-[#f0f0f0] border border-[#404040]">
                        {entry.category}
                      </span>
                      <span className="text-[10px] text-[#a0a0a0] font-mono">{entry.date}</span>
                    </div>

                    <h4 className="text-xs font-bold text-[#f0f0f0] leading-snug">
                      {isConsumption ? entry.title : entry.topic}
                    </h4>

                    {isConsumption && (
                      <p className="text-[11px] text-[#a0a0a0] mt-1">
                        Type: <span className="text-[#f0f0f0] font-medium">{entry.mediaType}</span> • <span className="font-mono text-[#f0f0f0]">{entry.duration} mins</span>
                      </p>
                    )}

                    {isSpeaking && (
                      <p className="text-[11px] text-[#a0a0a0] mt-1">
                        Duration: <span className="font-mono text-[#f0f0f0] font-medium">{entry.duration} mins</span>
                        {entry.note && <span className="block text-[#a0a0a0] italic mt-0.5">"{entry.note}"</span>}
                      </p>
                    )}

                    {isWriting && (
                      <p className="text-[11px] text-[#a0a0a0] mt-1">
                        Count: <span className="font-mono text-[#f0f0f0] font-medium">{entry.wordCount} words</span>
                        {entry.summary && <span className="block text-[#e5e5e5] mt-0.5 font-medium">"{entry.summary}"</span>}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
