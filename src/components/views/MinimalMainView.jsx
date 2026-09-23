import React, { useState } from 'react';
import { 
  Flame, 
  Tv, 
  Mic, 
  PenTool, 
  Sparkles, 
  Play, 
  Calendar, 
  CheckCircle2,
  Save,
  BookOpen,
  Clock,
  Activity
} from 'lucide-react';
import { SPEAKING_TOPICS, WRITING_TOPICS, storage } from '../../utils/storage';

export default function MinimalMainView({ entries = [], vocabList = [], onStartTimer, onQuickSave, onOpenHistoryModal, onOpenVocabModal }) {
  const streak = storage.calculateStreak();

  // Category Selector: 'Speaking' | 'Writing' | 'Consumption'
  const [selectedCategory, setSelectedCategory] = useState('Speaking');

  // Topic States with Auto-Suggest
  const completedSpeaking = storage.getCompletedSpeaking();
  const completedWriting = storage.getCompletedWriting();

  const [speakingTopic, setSpeakingTopic] = useState(() => storage.getNextSpeakingTopic());
  const [speakingDuration, setSpeakingDuration] = useState('25');
  const [speakingNote, setSpeakingNote] = useState('');

  const [writingTopic, setWritingTopic] = useState(() => storage.getNextWritingTopic());
  const [wordCount, setWordCount] = useState('350');
  const [writingSummary, setWritingSummary] = useState('');

  const [title, setTitle] = useState('');
  const [mediaType, setMediaType] = useState('TED talk');
  const [consumptionDuration, setConsumptionDuration] = useState('30');

  const [toastMessage, setToastMessage] = useState('');

  // 12-Week Enlarged Heatmap calculation (84 Days)
  const today = new Date();
  const heatmapDays = [];
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayEntries = entries.filter(e => e.date === dateStr);
    heatmapDays.push({
      dateStr,
      dateLabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' }),
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      count: dayEntries.length
    });
  }

  const heatmapColumns = [];
  for (let col = 0; col < 12; col++) {
    heatmapColumns.push(heatmapDays.slice(col * 7, (col + 1) * 7));
  }

  const activeDaysCount = heatmapDays.filter(d => d.count > 0).length;
  const totalPracticeSessions = entries.length;

  const handleStartTimerSession = () => {
    let sessionData = { category: selectedCategory };

    if (selectedCategory === 'Consumption') {
      sessionData.title = title.trim() || 'Untitled Media';
      sessionData.mediaType = mediaType;
    } else if (selectedCategory === 'Speaking') {
      sessionData.topic = speakingTopic;
    } else if (selectedCategory === 'Writing') {
      sessionData.topic = writingTopic;
    }

    onStartTimer(sessionData);
  };

  const handleDirectSave = (e) => {
    e.preventDefault();
    let entryData = { category: selectedCategory };

    if (selectedCategory === 'Consumption') {
      entryData = {
        ...entryData,
        title: title.trim() || 'Untitled Media',
        mediaType,
        duration: Number(consumptionDuration) || 0
      };
      setTitle('');
    } else if (selectedCategory === 'Speaking') {
      entryData = {
        ...entryData,
        topic: speakingTopic,
        duration: Number(speakingDuration) || 0,
        note: speakingNote.trim()
      };
      setSpeakingNote('');
    } else if (selectedCategory === 'Writing') {
      entryData = {
        ...entryData,
        topic: writingTopic,
        wordCount: Number(wordCount) || 0,
        summary: writingSummary.trim()
      };
      setWritingSummary('');
    }

    onQuickSave(entryData);

    // Refresh auto-suggested topics
    setSpeakingTopic(storage.getNextSpeakingTopic());
    setWritingTopic(storage.getNextWritingTopic());

    setToastMessage(`Saved ${selectedCategory} practice to today's log!`);
    setTimeout(() => setToastMessage(''), 2500);
  };

  return (
    <div className="h-full w-full flex flex-col space-y-4 animate-fadeIn">
      {/* Toast Confirmation */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-[#2d5a3d] text-[#4ade80] border border-[#4ade80]/40 flex items-center space-x-3 shadow-2xl animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#4ade80]" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* ================= TOP APP HEADER BAR ================= */}
      <header className="minimal-card rounded-2xl p-4 sm:px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#242424] border border-[#3a3a3a] flex items-center justify-center text-[#4ade80]">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#f0f0f0] tracking-tight flex items-center gap-2">
              DailyDrill
            </h1>
            <p className="text-xs text-[#a0a0a0] hidden sm:block">
              Daily practice tracker & focus timer
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-3">
          {/* Vocab Vault Button */}
          <button
            onClick={onOpenVocabModal}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#242424] hover:bg-[#333333] border border-[#3a3a3a] hover:border-[#525252] text-xs font-semibold text-[#f0f0f0] transition-all cursor-pointer shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4ade80]" />
            <span className="hidden sm:inline">Vocab Vault</span>
            <span className="sm:hidden text-[11px]">Vocab</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1e1e1e] border border-[#3a3a3a] text-[#4ade80]">
              {vocabList.length}
            </span>
          </button>

          {/* Day-Wise History Button */}
          <button
            onClick={onOpenHistoryModal}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#242424] hover:bg-[#333333] border border-[#3a3a3a] hover:border-[#525252] text-xs font-semibold text-[#f0f0f0] transition-all cursor-pointer shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4ade80]" />
            <span className="hidden sm:inline">View History</span>
            <span className="sm:hidden text-[11px]">History</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1e1e1e] border border-[#3a3a3a] text-[#a0a0a0]">
              {totalPracticeSessions}
            </span>
          </button>

          {/* Streak Counter Badge */}
          <div className={`flex items-center space-x-1 sm:space-x-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border text-xs font-bold ${
            streak > 0 
              ? 'bg-[#2d5a3d]/30 text-[#4ade80] border-[#2d5a3d]/50'
              : 'bg-[#242424] text-[#a0a0a0] border-[#3a3a3a]'
          }`}>
            <Flame className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${streak > 0 ? 'text-[#4ade80] fill-[#4ade80]' : 'text-[#a0a0a0]'}`} />
            <span className="text-xs">{streak} <span className="hidden xs:inline">{streak === 1 ? 'Day' : 'Days'}</span></span>
          </div>
        </div>
      </header>

      {/* ================= FULL PAGE 2-COLUMN APP MAIN GRID ================= */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-hidden">
        
        {/* LEFT COLUMN: ENLARGED HEATMAP & STATS PANEL (6 COLS) */}
        <div className="lg:col-span-6 flex flex-col space-y-4 min-h-0">
          <div className="minimal-card rounded-2xl p-5 sm:p-6 flex-1 flex flex-col justify-between overflow-y-auto">
            
            <div className="space-y-4">
              {/* Heatmap Title & Summary */}
              <div className="flex items-center justify-between border-b border-[#3a3a3a] pb-3">
                <div>
                  <h2 className="text-base font-bold text-[#f0f0f0] flex items-center gap-2">
                    <Calendar className="w-4.5 h-4.5 text-[#4ade80]" /> Your Progress (Last 12 Weeks)
                  </h2>
                  <p className="text-xs text-[#a0a0a0] mt-0.5">
                    Your daily consistency over the last 84 days.
                  </p>
                </div>

                <div className="text-right font-mono text-xs">
                  <span className="text-[#4ade80] font-bold text-sm block">{activeDaysCount} Days</span>
                  <span className="text-[#a0a0a0] text-[10px]">Days Active</span>
                </div>
              </div>

              {/* ENLARGED HEATMAP GRID */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-[11px] text-[#a0a0a0] font-mono px-1">
                  <span>← 12 Weeks Ago</span>
                  <span>Today →</span>
                </div>

                {/* Heatmap Grid Container with Larger Cells */}
                <div className="overflow-x-auto pb-2">
                  <div className="flex space-x-2 min-w-[560px] justify-between">
                    {heatmapColumns.map((colDays, colIdx) => (
                      <div key={colIdx} className="flex flex-col space-y-2">
                        {colDays.map((day) => {
                          let bgClass = 'bg-[#242424] border-[#3a3a3a]';
                          if (day.count === 1) bgClass = 'bg-[#2d5a3d] border-[#4ade80]/40 shadow-sm';
                          else if (day.count >= 2) bgClass = 'bg-[#4ade80] border-[#86efac] shadow-md';

                          return (
                            <div
                              key={day.dateStr}
                              title={`${day.dateLabel}: ${day.count} entry(s)`}
                              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg border transition-all hover:scale-125 cursor-pointer flex items-center justify-center ${bgClass}`}
                            >
                              {day.count > 0 && (
                                <span className="text-[9px] font-mono font-bold text-[#121212]">
                                  {day.count}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#3a3a3a]">
                  <span className="text-xs text-[#a0a0a0]">Activity:</span>
                  <div className="flex items-center space-x-2 text-[11px] text-[#a0a0a0] font-mono">
                    <span>None</span>
                    <span className="w-4 h-4 rounded-md bg-[#242424] border border-[#3a3a3a] inline-block" />
                    <span className="w-4 h-4 rounded-md bg-[#2d5a3d] inline-block" />
                    <span className="w-4 h-4 rounded-md bg-[#4ade80] inline-block" />
                    <span>2+ Entries</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Quick Metric Cards */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#3a3a3a] mt-4">
              <div className="bg-[#242424] p-3 rounded-xl border border-[#3a3a3a] space-y-1">
                <span className="text-[10px] uppercase font-semibold text-[#a0a0a0] block">Current Streak</span>
                <div className="text-base font-bold text-[#4ade80] font-mono">{streak} Days</div>
              </div>
              <div className="bg-[#242424] p-3 rounded-xl border border-[#3a3a3a] space-y-1">
                <span className="text-[10px] uppercase font-semibold text-[#a0a0a0] block">Total Entries</span>
                <div className="text-base font-bold text-[#f0f0f0] font-mono">{totalPracticeSessions} Logged</div>
              </div>
              <button
                type="button"
                onClick={onOpenVocabModal}
                className="bg-[#242424] hover:bg-[#333333] p-3 rounded-xl border border-[#3a3a3a] hover:border-[#525252] space-y-1 text-left transition-all cursor-pointer"
              >
                <span className="text-[10px] uppercase font-semibold text-[#a0a0a0] block">Vocab Vault</span>
                <div className="text-base font-bold text-[#4ade80] font-mono flex items-center justify-between">
                  <span>{vocabList.length} Words</span>
                  <BookOpen className="w-3.5 h-3.5 text-[#4ade80]" />
                </div>
              </button>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: PRACTICE SELECTOR & TIMER LAUNCHER (6 COLS) */}
        <div className="lg:col-span-6 flex flex-col space-y-4 min-h-0">
          <div className="minimal-card rounded-2xl p-5 sm:p-6 flex-1 flex flex-col justify-between overflow-y-auto space-y-5">
            
            <div className="space-y-4">
              <div className="border-b border-[#3a3a3a] pb-3 flex items-center justify-between">
                <h2 className="text-base font-bold text-[#f0f0f0] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#4ade80]" /> Log Today's Practice
                </h2>
                <span className="text-xs text-[#a0a0a0] font-mono">Select Type</span>
              </div>

              {/* Category Selector Cards */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'Speaking', icon: Mic, label: 'Speaking', count: completedSpeaking.length },
                  { key: 'Writing', icon: PenTool, label: 'Writing', count: completedWriting.length },
                  { key: 'Consumption', icon: Tv, label: 'Consumption', count: null }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = selectedCategory === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setSelectedCategory(tab.key)}
                      className={`flex flex-col items-center justify-center py-3.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#404040] text-[#f0f0f0] border-[#525252] shadow-md scale-102'
                          : 'bg-[#242424] text-[#a0a0a0] border-[#3a3a3a] hover:border-[#4a4a4a] hover:bg-[#333333] hover:text-[#f0f0f0]'
                      }`}
                    >
                      <Icon className="w-4 h-4 mb-1 text-[#f0f0f0]" />
                      <span>{tab.label}</span>
                      {tab.count !== null && (
                        <span className="text-[10px] text-[#4ade80] font-mono mt-0.5">
                          {tab.count}/10 Done
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Form Input Configuration */}
              <form onSubmit={handleDirectSave} className="space-y-4 bg-[#242424] p-4.5 rounded-xl border border-[#3a3a3a]">
                
                {/* SPEAKING CONFIG */}
                {selectedCategory === 'Speaking' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold uppercase text-[#a0a0a0]">
                        Topic Prompt
                      </label>
                      <span className="text-[10px] text-[#4ade80] bg-[#2d5a3d]/30 border border-[#2d5a3d]/50 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Next Topic
                      </span>
                    </div>
                    <select
                      value={speakingTopic}
                      onChange={(e) => setSpeakingTopic(e.target.value)}
                      className="w-full bg-[#1e1e1e] border border-[#3a3a3a] rounded-xl px-3.5 py-2 text-xs text-[#f0f0f0] focus:outline-none focus:border-[#525252]"
                    >
                      {SPEAKING_TOPICS.map((topic, i) => {
                        const isDone = completedSpeaking.includes(topic);
                        return (
                          <option key={i} value={topic}>
                            {topic} {isDone ? '✓ (Done)' : ''}
                          </option>
                        );
                      })}
                    </select>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-[#a0a0a0] mb-1">
                          How long? (minutes)
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={speakingDuration}
                          onChange={(e) => setSpeakingDuration(e.target.value)}
                          className="w-full bg-[#1e1e1e] border border-[#3a3a3a] rounded-xl px-3 py-2 text-xs text-[#f0f0f0] font-mono focus:outline-none focus:border-[#525252]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-[#a0a0a0] mb-1">
                          Any notes?
                        </label>
                        <input
                          type="text"
                          value={speakingNote}
                          onChange={(e) => setSpeakingNote(e.target.value)}
                          placeholder="Vocabulary or fluency notes..."
                          className="w-full bg-[#1e1e1e] border border-[#3a3a3a] rounded-xl px-3 py-2 text-xs text-[#f0f0f0] placeholder:text-[#737373] focus:outline-none focus:border-[#525252]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* WRITING CONFIG */}
                {selectedCategory === 'Writing' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold uppercase text-[#a0a0a0]">
                        Topic Prompt
                      </label>
                      <span className="text-[10px] text-[#4ade80] bg-[#2d5a3d]/30 border border-[#2d5a3d]/50 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Next Topic
                      </span>
                    </div>
                    <select
                      value={writingTopic}
                      onChange={(e) => setWritingTopic(e.target.value)}
                      className="w-full bg-[#1e1e1e] border border-[#3a3a3a] rounded-xl px-3.5 py-2 text-xs text-[#f0f0f0] focus:outline-none focus:border-[#525252]"
                    >
                      {WRITING_TOPICS.map((topic, i) => {
                        const isDone = completedWriting.includes(topic);
                        return (
                          <option key={i} value={topic}>
                            {topic} {isDone ? '✓ (Done)' : ''}
                          </option>
                        );
                      })}
                    </select>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-[#a0a0a0] mb-1">
                          Word Count
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={wordCount}
                          onChange={(e) => setWordCount(e.target.value)}
                          className="w-full bg-[#1e1e1e] border border-[#3a3a3a] rounded-xl px-3 py-2 text-xs text-[#f0f0f0] font-mono focus:outline-none focus:border-[#525252]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-[#a0a0a0] mb-1">
                          One-Line Summary
                        </label>
                        <input
                          type="text"
                          required
                          value={writingSummary}
                          onChange={(e) => setWritingSummary(e.target.value)}
                          placeholder="What did you write..."
                          className="w-full bg-[#1e1e1e] border border-[#3a3a3a] rounded-xl px-3 py-2 text-xs text-[#f0f0f0] placeholder:text-[#737373] focus:outline-none focus:border-[#525252]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* CONSUMPTION CONFIG */}
                {selectedCategory === 'Consumption' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#a0a0a0] mb-1">
                        Title / Media Name
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Huberman Lab Podcast, TED Talk"
                        className="w-full bg-[#1e1e1e] border border-[#3a3a3a] rounded-xl px-3.5 py-2 text-xs text-[#f0f0f0] placeholder:text-[#737373] focus:outline-none focus:border-[#525252]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-[#a0a0a0] mb-1">
                          Media Type
                        </label>
                        <select
                          value={mediaType}
                          onChange={(e) => setMediaType(e.target.value)}
                          className="w-full bg-[#1e1e1e] border border-[#3a3a3a] rounded-xl px-3 py-2 text-xs text-[#f0f0f0] focus:outline-none focus:border-[#525252]"
                        >
                          <option value="TED talk">TED talk</option>
                          <option value="Podcast">Podcast</option>
                          <option value="Show">Show</option>
                          <option value="Movie">Movie</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-[#a0a0a0] mb-1">
                          How long? (minutes)
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={consumptionDuration}
                          onChange={(e) => setConsumptionDuration(e.target.value)}
                          className="w-full bg-[#1e1e1e] border border-[#3a3a3a] rounded-xl px-3 py-2 text-xs text-[#f0f0f0] font-mono focus:outline-none focus:border-[#525252]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Controls */}
                <div className="pt-1 flex items-center space-x-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#2d5a3d] hover:bg-[#3d7852] text-zinc-100 font-bold text-xs border border-[#4ade80]/40 flex items-center justify-center space-x-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Entry</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleStartTimerSession}
                    className="flex-1 py-3 rounded-xl bg-[#404040] hover:bg-[#525252] text-[#f0f0f0] font-bold text-xs border border-[#525252] flex items-center justify-center space-x-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current text-[#4ade80]" />
                    <span>Start Timer</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Bottom App Footer Info */}
            <div className="pt-3 border-t border-[#3a3a3a] flex items-center justify-between text-[11px] text-[#a0a0a0]">
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-[#4ade80]" /> Saved to local storage
              </span>
              <button
                onClick={onOpenHistoryModal}
                className="text-[#4ade80] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                View All Entries →
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
