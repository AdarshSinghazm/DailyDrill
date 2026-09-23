import React, { useState } from 'react';
import { 
  Tv, 
  Mic, 
  PenTool, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw
} from 'lucide-react';
import { SPEAKING_TOPICS, WRITING_TOPICS, storage } from '../../utils/storage';

export default function LogEntryView({ onSaveEntry, onNavigate }) {
  // Main Category Selector: 'Consumption' | 'Speaking' | 'Writing'
  const [entryCategory, setEntryCategory] = useState('Consumption');

  // Completed Topic Sets
  const [completedSpeaking, setCompletedSpeaking] = useState(() => storage.getCompletedSpeaking());
  const [completedWriting, setCompletedWriting] = useState(() => storage.getCompletedWriting());

  // Fields for Consumption
  const [title, setTitle] = useState('');
  const [mediaType, setMediaType] = useState('TED talk');
  const [consumptionDuration, setConsumptionDuration] = useState('30');

  // Fields for Speaking
  const [speakingTopic, setSpeakingTopic] = useState(() => storage.getNextSpeakingTopic());
  const [speakingDuration, setSpeakingDuration] = useState('25');
  const [speakingNote, setSpeakingNote] = useState('');

  // Fields for Writing
  const [writingTopic, setWritingTopic] = useState(() => storage.getNextWritingTopic());
  const [wordCount, setWordCount] = useState('350');
  const [writingSummary, setWritingSummary] = useState('');

  // Confirmation state
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [cycleResetNotice, setCycleResetNotice] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    let entryData = {
      category: entryCategory,
    };

    let resetsCycle = false;

    if (entryCategory === 'Consumption') {
      entryData = {
        ...entryData,
        title: title.trim() || 'Untitled Media',
        mediaType,
        duration: Number(consumptionDuration) || 0
      };
    } else if (entryCategory === 'Speaking') {
      entryData = {
        ...entryData,
        topic: speakingTopic,
        duration: Number(speakingDuration) || 0,
        note: speakingNote.trim()
      };
      if (completedSpeaking.length + 1 >= SPEAKING_TOPICS.length) {
        resetsCycle = true;
      }
    } else if (entryCategory === 'Writing') {
      entryData = {
        ...entryData,
        topic: writingTopic,
        wordCount: Number(wordCount) || 0,
        summary: writingSummary.trim()
      };
      if (completedWriting.length + 1 >= WRITING_TOPICS.length) {
        resetsCycle = true;
      }
    }

    onSaveEntry(entryData);
    setSavedSuccess(true);
    if (resetsCycle) {
      setCycleResetNotice(true);
    }

    setCompletedSpeaking(storage.getCompletedSpeaking());
    setCompletedWriting(storage.getCompletedWriting());
    setSpeakingTopic(storage.getNextSpeakingTopic());
    setWritingTopic(storage.getNextWritingTopic());

    setTitle('');
    setSpeakingNote('');
    setWritingSummary('');

    setTimeout(() => {
      setSavedSuccess(false);
      setCycleResetNotice(false);
      onNavigate('dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#3a3a3a] pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#f0f0f0] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#f0f0f0]" />
            Log Practice Entry
          </h2>
          <p className="text-xs sm:text-sm text-[#a0a0a0] mt-1">
            Choose practice category (Consumption, Speaking, or Writing) and record your entry.
          </p>
        </div>

        <span className="text-xs font-mono bg-[#2d2d2d] text-[#e5e5e5] border border-[#3a3a3a] px-3 py-1 rounded-full">
          Auto-saves today's date
        </span>
      </div>

      {/* Confirmation Toast */}
      {savedSuccess && (
        <div className="p-4 rounded-xl bg-[#2d5a3d]/30 text-[#4ade80] border border-[#2d5a3d]/60 flex items-center space-x-3 shadow-md animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#4ade80] flex-shrink-0" />
          <div>
            <p className="text-sm font-bold">Entry Saved Successfully! 🎉</p>
            {cycleResetNotice ? (
              <p className="text-xs text-[#4ade80] flex items-center gap-1 mt-0.5 font-medium">
                <RotateCcw className="w-3.5 h-3.5" /> All 10 topics completed! Cycle reset for a new round.
              </p>
            ) : (
              <p className="text-xs text-[#4ade80]/90">Your practice log has been saved. Redirecting to dashboard...</p>
            )}
          </div>
        </div>
      )}

      {/* Entry Category Selector */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { key: 'Consumption', icon: Tv, label: 'Consumption' },
          { key: 'Speaking', icon: Mic, label: 'Speaking' },
          { key: 'Writing', icon: PenTool, label: 'Writing' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = entryCategory === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setEntryCategory(tab.key)}
              className={`flex flex-col items-center justify-center py-3.5 px-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#404040] text-[#f0f0f0] border-[#525252] shadow-sm'
                  : 'bg-[#242424] text-[#a0a0a0] border-[#3a3a3a] hover:border-[#4a4a4a] hover:bg-[#333333] hover:text-[#f0f0f0]'
              }`}
            >
              <Icon className="w-4 h-4 mb-1.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="minimal-card p-6 sm:p-8 rounded-2xl space-y-6">
        
        {/* ================= CONSUMPTION FIELDS ================= */}
        {entryCategory === 'Consumption' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-[#3a3a3a] pb-3">
              <h3 className="text-sm font-bold text-[#f0f0f0] flex items-center gap-2">
                <Tv className="w-4 h-4 text-[#a0a0a0]" /> Consumption Details
              </h3>
              <p className="text-xs text-[#a0a0a0]">Track videos, shows, podcasts, and talks consumed.</p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#a0a0a0] mb-1.5">
                Title / Name
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Huberman Lab Podcast, TED Talk on Leadership"
                className="w-full bg-[#242424] border border-[#3a3a3a] rounded-xl px-4 py-2.5 text-sm text-[#f0f0f0] placeholder:text-[#737373] focus:outline-none focus:border-[#525252]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Type Dropdown */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#a0a0a0] mb-1.5">
                  Media Type
                </label>
                <select
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value)}
                  className="w-full bg-[#242424] border border-[#3a3a3a] rounded-xl px-4 py-2.5 text-sm text-[#f0f0f0] focus:outline-none focus:border-[#525252]"
                >
                  <option value="Movie">Movie</option>
                  <option value="Show">Show</option>
                  <option value="Podcast">Podcast</option>
                  <option value="TED talk">TED talk</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Duration in Minutes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#a0a0a0] mb-1.5">
                  Duration (Minutes)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    required
                    value={consumptionDuration}
                    onChange={(e) => setConsumptionDuration(e.target.value)}
                    placeholder="30"
                    className="w-full bg-[#242424] border border-[#3a3a3a] rounded-xl px-4 py-2.5 text-sm text-[#f0f0f0] font-mono focus:outline-none focus:border-[#525252]"
                  />
                  <span className="absolute right-4 top-2.5 text-xs text-[#a0a0a0]">mins</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SPEAKING FIELDS ================= */}
        {entryCategory === 'Speaking' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-[#3a3a3a] pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#f0f0f0] flex items-center gap-2">
                  <Mic className="w-4 h-4 text-[#a0a0a0]" /> Speaking Practice Details
                </h3>
                <p className="text-xs text-[#a0a0a0]">Pre-suggested next pending topic from your 10 prompts.</p>
              </div>
              <span className="text-[11px] font-semibold text-[#4ade80] bg-[#2d5a3d]/30 border border-[#2d5a3d]/50 px-2.5 py-1 rounded-full">
                {completedSpeaking.length}/10 Done
              </span>
            </div>

            {/* Topic Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#a0a0a0]">
                  Speaking Topic
                </label>
                <span className="text-[10px] text-[#e5e5e5] bg-[#242424] border border-[#3a3a3a] px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#f0f0f0]" /> Auto-Suggested Next Topic
                </span>
              </div>

              <select
                value={speakingTopic}
                onChange={(e) => setSpeakingTopic(e.target.value)}
                className="w-full bg-[#242424] border border-[#3a3a3a] rounded-xl px-4 py-2.5 text-sm text-[#f0f0f0] focus:outline-none focus:border-[#525252]"
              >
                {SPEAKING_TOPICS.map((topic, i) => {
                  const isDone = completedSpeaking.includes(topic);
                  return (
                    <option key={i} value={topic} className="bg-[#242424] text-[#f0f0f0]">
                      {topic} {isDone ? '✓ (Done)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Duration in Minutes */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#a0a0a0] mb-1.5">
                Speaking Duration (Minutes)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  required
                  value={speakingDuration}
                  onChange={(e) => setSpeakingDuration(e.target.value)}
                  placeholder="25"
                  className="w-full bg-[#242424] border border-[#3a3a3a] rounded-xl px-4 py-2.5 text-sm text-[#f0f0f0] font-mono focus:outline-none focus:border-[#525252]"
                />
                <span className="absolute right-4 top-2.5 text-xs text-[#a0a0a0]">mins</span>
              </div>
            </div>

            {/* Optional Note */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#a0a0a0] mb-1.5 flex items-center justify-between">
                <span>Notes (Optional)</span>
                <span className="text-[10px] text-[#737373] lowercase font-normal">optional</span>
              </label>
              <textarea
                rows="3"
                value={speakingNote}
                onChange={(e) => setSpeakingNote(e.target.value)}
                placeholder="Optional notes on fluency, vocabulary used, or key takeaways..."
                className="w-full bg-[#242424] border border-[#3a3a3a] rounded-xl px-4 py-2.5 text-sm text-[#f0f0f0] placeholder:text-[#737373] focus:outline-none focus:border-[#525252] resize-none"
              />
            </div>
          </div>
        )}

        {/* ================= WRITING FIELDS ================= */}
        {entryCategory === 'Writing' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-[#3a3a3a] pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#f0f0f0] flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-[#a0a0a0]" /> Writing Practice Details
                </h3>
                <p className="text-xs text-[#a0a0a0]">Pre-suggested next pending topic from your 10 prompts.</p>
              </div>
              <span className="text-[11px] font-semibold text-[#4ade80] bg-[#2d5a3d]/30 border border-[#2d5a3d]/50 px-2.5 py-1 rounded-full">
                {completedWriting.length}/10 Done
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Topic Dropdown */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#a0a0a0]">
                    Writing Topic
                  </label>
                  <span className="text-[10px] text-[#e5e5e5] bg-[#242424] border border-[#3a3a3a] px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#f0f0f0]" /> Auto-Suggested Next Topic
                  </span>
                </div>

                <select
                  value={writingTopic}
                  onChange={(e) => setWritingTopic(e.target.value)}
                  className="w-full bg-[#242424] border border-[#3a3a3a] rounded-xl px-4 py-2.5 text-sm text-[#f0f0f0] focus:outline-none focus:border-[#525252]"
                >
                  {WRITING_TOPICS.map((topic, i) => {
                    const isDone = completedWriting.includes(topic);
                    return (
                      <option key={i} value={topic} className="bg-[#242424] text-[#f0f0f0]">
                        {topic} {isDone ? '✓ (Done)' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Word Count */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#a0a0a0] mb-1.5">
                  Word Count
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    required
                    value={wordCount}
                    onChange={(e) => setWordCount(e.target.value)}
                    placeholder="350"
                    className="w-full bg-[#242424] border border-[#3a3a3a] rounded-xl px-4 py-2.5 text-sm text-[#f0f0f0] font-mono focus:outline-none focus:border-[#525252]"
                  />
                  <span className="absolute right-4 top-2.5 text-xs text-[#a0a0a0]">words</span>
                </div>
              </div>

              {/* One-Line Summary */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#a0a0a0] mb-1.5">
                  One-Line Summary
                </label>
                <input
                  type="text"
                  required
                  value={writingSummary}
                  onChange={(e) => setWritingSummary(e.target.value)}
                  placeholder="A concise one-line summary of what you wrote..."
                  className="w-full bg-[#242424] border border-[#3a3a3a] rounded-xl px-4 py-2.5 text-sm text-[#f0f0f0] placeholder:text-[#737373] focus:outline-none focus:border-[#525252]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit Actions */}
        <div className="pt-3 border-t border-[#3a3a3a] flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="px-5 py-2.5 rounded-xl border border-[#3a3a3a] text-xs sm:text-sm font-medium text-[#a0a0a0] hover:bg-[#333333] hover:text-[#f0f0f0] cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex items-center space-x-2 bg-[#404040] hover:bg-[#525252] text-[#f0f0f0] font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl border border-[#525252] shadow-sm cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-[#f0f0f0]" />
            <span>Save Entry</span>
          </button>
        </div>

      </form>
    </div>
  );
}
