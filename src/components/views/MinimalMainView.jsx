import React, { useState } from 'react';
import { 
  Flame, 
  Tv, 
  Mic, 
  PenTool, 
  Play, 
  Calendar, 
  CheckCircle2,
  Save,
  BookOpen,
  Clock,
  Activity,
  Lock,
  Zap,
  Sparkles
} from 'lucide-react';
import { 
  SPEAKING_TOPICS, 
  WRITING_TOPICS, 
  storage, 
  calculateHeatmapDays, 
  isCategoryLockedToday 
} from '../../utils/storage';

export default function MinimalMainView({ entries = [], vocabList = [], onStartTimer, onQuickSave, onOpenHistoryModal, onOpenVocabModal }) {
  const streak = storage.calculateStreak();

  // Category Selector: 'Speaking' | 'Writing' | 'Consumption'
  const [selectedCategory, setSelectedCategory] = useState('Speaking');

  // Topic States with Auto-Suggest
  const completedSpeaking = storage.getCompletedSpeaking();
  const completedWriting = storage.getCompletedWriting();

  const [speakingTopic, setSpeakingTopic] = useState(() => storage.getNextSpeakingTopic());
  const [customSpeakingTopic, setCustomSpeakingTopic] = useState('');
  const [speakingDuration, setSpeakingDuration] = useState('25');
  const [speakingNote, setSpeakingNote] = useState('');

  const [writingTopic, setWritingTopic] = useState(() => storage.getNextWritingTopic());
  const [customWritingTopic, setCustomWritingTopic] = useState('');
  const [wordCount, setWordCount] = useState('350');
  const [writingSummary, setWritingSummary] = useState('');

  const [title, setTitle] = useState('');
  const [mediaType, setMediaType] = useState('TED talk');
  const [consumptionDuration, setConsumptionDuration] = useState('30');

  const [toastMessage, setToastMessage] = useState('');

  // Dynamic Heatmap starting from earliest entry date
  const { heatmapDays, heatmapColumns, activeDaysCount, totalDaysCount, firstEntryLabel } = calculateHeatmapDays(entries);
  const totalPracticeSessions = entries.length;

  // Daily Entry Lock Status
  const isLocked = isCategoryLockedToday(entries, selectedCategory);

  const getEffectiveTopic = (cat) => {
    if (cat === 'Speaking') {
      return speakingTopic === 'Other' ? (customSpeakingTopic.trim() || 'Custom Speaking Topic') : speakingTopic;
    }
    if (cat === 'Writing') {
      return writingTopic === 'Other' ? (customWritingTopic.trim() || 'Custom Writing Topic') : writingTopic;
    }
    return '';
  };

  const handleStartTimerSession = () => {
    if (isLocked) return;

    let sessionData = { category: selectedCategory };

    if (selectedCategory === 'Consumption') {
      sessionData.title = title.trim() || 'Media Practice';
      sessionData.mediaType = mediaType;
    } else if (selectedCategory === 'Speaking') {
      sessionData.topic = getEffectiveTopic('Speaking');
    } else if (selectedCategory === 'Writing') {
      sessionData.topic = getEffectiveTopic('Writing');
    }

    onStartTimer(sessionData);
  };

  const handleDirectSave = (e) => {
    e.preventDefault();
    if (isLocked) return;

    let entryData = { category: selectedCategory };

    if (selectedCategory === 'Consumption') {
      entryData = {
        ...entryData,
        title: title.trim() || 'Media Practice',
        mediaType,
        duration: Number(consumptionDuration) || 0
      };
      setTitle('');
    } else if (selectedCategory === 'Speaking') {
      entryData = {
        ...entryData,
        topic: getEffectiveTopic('Speaking'),
        duration: Number(speakingDuration) || 0,
        note: speakingNote.trim()
      };
      setSpeakingNote('');
      setCustomSpeakingTopic('');
    } else if (selectedCategory === 'Writing') {
      entryData = {
        ...entryData,
        topic: getEffectiveTopic('Writing'),
        wordCount: Number(wordCount) || 0,
        summary: writingSummary.trim()
      };
      setWritingSummary('');
      setCustomWritingTopic('');
    }

    onQuickSave(entryData);

    // Refresh suggested topics
    setSpeakingTopic(storage.getNextSpeakingTopic());
    setWritingTopic(storage.getNextWritingTopic());

    setToastMessage(`Saved ${selectedCategory} practice log!`);
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
                    <Calendar className="w-4.5 h-4.5 text-[#4ade80]" /> Daily Practice Grid
                  </h2>
                  <p className="text-xs text-[#a0a0a0] mt-0.5">
                    Activity from your first entry to today.
                  </p>
                </div>

                <div className="text-right font-mono text-xs">
                  <span className="text-[#4ade80] font-bold text-sm block">{activeDaysCount} Days</span>
                  <span className="text-[#a0a0a0] text-[10px]">Active Days</span>
                </div>
              </div>

              {/* ENLARGED HEATMAP GRID */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-[11px] text-[#a0a0a0] font-mono px-1">
                  <span>← First Entry ({firstEntryLabel || 'Start'})</span>
                  <span>Today →</span>
                </div>

                {/* Heatmap Grid Container with Day Labels */}
                <div className="overflow-x-auto pb-2">
                  <div className="flex items-start space-x-2">
                    {/* Day Labels Column */}
                    <div className="flex flex-col justify-between h-[168px] sm:h-[184px] py-0.5 text-[10px] font-mono text-[#a0a0a0] select-none pr-1">
                      <span>Sun</span>
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                    </div>

                    {/* Columns of 7 Day Blocks - Packed tightly side-by-side */}
                    <div className="flex space-x-1.5">
                      {heatmapColumns.map((colDays, colIdx) => (
                        <div key={colIdx} className="flex flex-col space-y-1.5">
                          {colDays.map((day) => {
                            let bgClass = 'bg-[#242424] border-[#3a3a3a]';
                            if (day.count === 1) bgClass = 'bg-[#2d5a3d] border-[#4ade80]/50 shadow-sm';
                            else if (day.count >= 2) bgClass = 'bg-[#4ade80] border-[#86efac] shadow-md';

                            return (
                              <div
                                key={day.dateStr}
                                title={`${day.dateLabel} (${day.dayName}): ${day.count} entry(s)`}
                                className={`w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-md border transition-all hover:scale-125 cursor-pointer flex items-center justify-center ${bgClass}`}
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
                </div>

                {/* Legend */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#3a3a3a]">
                  <span className="text-xs text-[#a0a0a0]">Activity:</span>
                  <div className="flex items-center space-x-2 text-[11px] text-[#a0a0a0] font-mono">
                    <span>None</span>
                    <span className="w-3.5 h-3.5 rounded bg-[#242424] border border-[#3a3a3a] inline-block" />
                    <span className="w-3.5 h-3.5 rounded bg-[#2d5a3d] inline-block" />
                    <span className="w-3.5 h-3.5 rounded bg-[#4ade80] inline-block" />
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
                  <Zap className="w-4 h-4 text-[#4ade80]" /> Log Today's Practice
                </h2>
                <span className="text-xs text-[#a0a0a0] font-mono">Select Category</span>
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
                  const catLocked = isCategoryLockedToday(entries, tab.key);

                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setSelectedCategory(tab.key)}
                      className={`relative flex flex-col items-center justify-center py-3.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#404040] text-[#f0f0f0] border-[#525252] shadow-md'
                          : 'bg-[#242424] text-[#a0a0a0] border-[#3a3a3a] hover:border-[#4a4a4a] hover:bg-[#333333] hover:text-[#f0f0f0]'
                      }`}
                    >
                      {catLocked && (
                        <span className="absolute top-2 right-2 text-[#f59e0b]">
                          <Lock className="w-3 h-3" />
                        </span>
                      )}
                      <Icon className="w-4 h-4 mb-1 text-[#f0f0f0]" />
                      <span>{tab.label}</span>
                      {catLocked ? (
                        <span className="text-[10px] text-[#f59e0b] font-mono mt-0.5">Logged Today</span>
                      ) : tab.count !== null ? (
                        <span className="text-[10px] text-[#4ade80] font-mono mt-0.5">
                          {tab.count}/10 Done
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {/* Special Challenge Card: Pen-in-Mouth Pronunciation */}
              {selectedCategory === 'Speaking' && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('Speaking');
                    setSpeakingTopic('11. Pen-in-Mouth 10-Min Speaking Challenge (Clear Pronunciation)');
                    setSpeakingDuration('10');
                  }}
                  className="w-full bg-[#272635] hover:bg-[#312f45] border border-[#818cf8]/40 rounded-xl p-3 flex items-center justify-between text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">🖊️</span>
                    <div>
                      <span className="text-xs font-bold text-[#a5b4fc] block">Pen-in-Mouth 10-Min Challenge</span>
                      <span className="text-[11px] text-[#a0a0a0]">Put a pen in your mouth & speak for clear pronunciation.</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono bg-[#818cf8]/20 text-[#a5b4fc] border border-[#818cf8]/30 px-2.5 py-1 rounded-lg font-semibold group-hover:bg-[#818cf8] group-hover:text-white transition-all flex-shrink-0">
                    10 Mins →
                  </span>
                </button>
              )}

              {/* Form Input Configuration */}
              <form onSubmit={handleDirectSave} className="space-y-4 bg-[#242424] p-4.5 rounded-xl border border-[#3a3a3a]">
                
                {/* DAILY LOCKED NOTICE */}
                {isLocked ? (
                  <div className="p-4 rounded-xl bg-[#2a2420] border border-[#f59e0b]/40 text-[#f59e0b] space-y-2 animate-fadeIn">
                    <div className="flex items-center space-x-2 font-bold text-xs sm:text-sm">
                      <Lock className="w-4 h-4 text-[#f59e0b]" />
                      <span>Today's {selectedCategory} Entry Logged</span>
                    </div>
                    <p className="text-xs text-[#d1d5db]">
                      You have already saved your {selectedCategory} practice for today. Only 1 entry per day is allowed. To log a new one, remove today's entry from{' '}
                      <button 
                        type="button" 
                        onClick={onOpenHistoryModal} 
                        className="underline text-[#f59e0b] font-semibold cursor-pointer hover:text-white"
                      >
                        History
                      </button>.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* SPEAKING CONFIG */}
                    {selectedCategory === 'Speaking' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-semibold uppercase text-[#a0a0a0]">
                            Speaking Topic
                          </label>
                          <span className="text-[10px] text-[#4ade80] bg-[#2d5a3d]/30 border border-[#2d5a3d]/50 px-2 py-0.5 rounded font-semibold">
                            Next Prompt
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
                          <option value="Other">Custom Topic (Type below...)</option>
                        </select>

                        {speakingTopic === 'Other' && (
                          <div>
                            <label className="block text-[11px] font-semibold text-[#a5b4fc] mb-1">
                              Enter Custom Topic Name:
                            </label>
                            <input
                              type="text"
                              required
                              value={customSpeakingTopic}
                              onChange={(e) => setCustomSpeakingTopic(e.target.value)}
                              placeholder="e.g. Practiced interview answers about my career goals..."
                              className="w-full bg-[#1e1e1e] border border-[#6366f1]/50 rounded-xl px-3.5 py-2 text-xs text-[#f0f0f0] placeholder:text-[#737373] focus:outline-none focus:border-[#818cf8]"
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold uppercase text-[#a0a0a0] mb-1">
                              Duration (minutes)
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
                              Notes (optional)
                            </label>
                            <input
                              type="text"
                              value={speakingNote}
                              onChange={(e) => setSpeakingNote(e.target.value)}
                              placeholder="Vocabulary or pronunciation notes..."
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
                            Writing Topic
                          </label>
                          <span className="text-[10px] text-[#4ade80] bg-[#2d5a3d]/30 border border-[#2d5a3d]/50 px-2 py-0.5 rounded font-semibold">
                            Next Prompt
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
                          <option value="Other">Custom Topic (Type below...)</option>
                        </select>

                        {writingTopic === 'Other' && (
                          <div>
                            <label className="block text-[11px] font-semibold text-[#a5b4fc] mb-1">
                              Enter Custom Topic Name:
                            </label>
                            <input
                              type="text"
                              required
                              value={customWritingTopic}
                              onChange={(e) => setCustomWritingTopic(e.target.value)}
                              placeholder="e.g. Wrote an essay on technology in education..."
                              className="w-full bg-[#1e1e1e] border border-[#6366f1]/50 rounded-xl px-3.5 py-2 text-xs text-[#f0f0f0] placeholder:text-[#737373] focus:outline-none focus:border-[#818cf8]"
                            />
                          </div>
                        )}

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
                              placeholder="Key point of what you wrote..."
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
                            placeholder="Title of podcast, talk, video or article..."
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
                              Duration (minutes)
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
                  </>
                )}

              </form>
            </div>

            {/* Bottom App Footer Info */}
            <div className="pt-3 border-t border-[#3a3a3a] flex items-center justify-between text-[11px] text-[#a0a0a0]">
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-[#4ade80]" /> Saved locally
              </span>
              <button
                onClick={onOpenHistoryModal}
                className="text-[#4ade80] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                View Journal & History →
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
