import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, X, Clock, PenTool, Mic, Tv } from 'lucide-react';

export default function TimerOverlay({ practiceSession, onComplete, onCancel }) {
  // Timer state in seconds
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Completion modal state
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [note, setNote] = useState('');
  const [wordCount, setWordCount] = useState('250');
  const [summary, setSummary] = useState('');

  const { category, topic, title, mediaType } = practiceSession;

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
  };

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinishClick = () => {
    setIsActive(false);
    // Show additional inputs if Writing or Speaking note needed, otherwise finish directly
    setShowCompletionForm(true);
  };

  const handleFinalSave = (e) => {
    e.preventDefault();
    const durationMinutes = Math.max(1, Math.round(seconds / 60));

    const finalData = {
      category,
      duration: durationMinutes,
      ...(category === 'Consumption' && { title: title || 'Untitled Media', mediaType: mediaType || 'Video' }),
      ...(category === 'Speaking' && { topic, note: note.trim() }),
      ...(category === 'Writing' && { topic, wordCount: Number(wordCount) || 100, summary: summary.trim() })
    };

    onComplete(finalData);
  };

  const CategoryIcon = category === 'Consumption' ? Tv : category === 'Speaking' ? Mic : PenTool;

  return (
    <div className="fixed inset-0 z-50 bg-[#121212] text-[#f0f0f0] flex flex-col justify-between p-6 sm:p-12 animate-fadeIn selection:bg-[#404040]">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 bg-[#242424] border border-[#3a3a3a] px-4 py-2 rounded-xl">
          <CategoryIcon className="w-5 h-5 text-[#4ade80]" />
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[#a0a0a0] block">{category}</span>
            <span className="text-sm font-semibold text-[#f0f0f0]">{category === 'Consumption' ? title || 'Media Session' : topic}</span>
          </div>
        </div>

        <button
          onClick={onCancel}
          className="p-3.5 rounded-full bg-[#242424] hover:bg-[#333333] border border-[#3a3a3a] text-[#a0a0a0] hover:text-[#f0f0f0] transition-colors cursor-pointer"
          title="Cancel Session"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Center: Main Timer Display */}
      {!showCompletionForm ? (
        <div className="flex flex-col items-center justify-center text-center space-y-8 my-auto">
          {/* Practice Type Label */}
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-[#2d5a3d]/30 text-[#4ade80] border border-[#2d5a3d]/50 text-xs font-semibold tracking-wider uppercase">
              {isActive ? '● Focus Session Active' : '⏸ Session Paused'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#a0a0a0]">
              {category === 'Consumption' ? title || 'Media Practice' : topic}
            </h2>
          </div>

          {/* Giant Digital Clock */}
          <div className="font-mono text-6xl xs:text-8xl sm:text-9xl font-extrabold text-[#f0f0f0] tracking-tighter drop-shadow-md select-none">
            {formatTime(seconds)}
          </div>

          {/* Timer Controls */}
          <div className="flex items-center space-x-3 sm:space-x-6 pt-4">
            <button
              onClick={resetTimer}
              className="p-3.5 sm:p-4 rounded-2xl bg-[#242424] hover:bg-[#333333] border border-[#3a3a3a] text-[#a0a0a0] hover:text-[#f0f0f0] transition-all cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={toggleTimer}
              className="p-5 sm:p-6 rounded-2xl bg-[#404040] hover:bg-[#525252] border border-[#525252] text-[#f0f0f0] transition-all shadow-lg cursor-pointer transform active:scale-95"
              title={isActive ? 'Pause' : 'Start'}
            >
              {isActive ? <Pause className="w-6 h-6 sm:w-8 sm:h-8 fill-current" /> : <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-current ml-0.5" />}
            </button>

            <button
              onClick={handleFinishClick}
              className="flex items-center space-x-1.5 sm:space-x-2 px-4 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-[#2d5a3d] hover:bg-[#3d7852] text-zinc-100 font-bold border border-[#4ade80]/40 shadow-lg transition-all cursor-pointer text-xs sm:text-base"
            >
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Finish & Save</span>
            </button>
          </div>
        </div>
      ) : (
        /* Completion Details Overlay */
        <div className="max-w-lg mx-auto w-full bg-[#242424] border border-[#3a3a3a] p-6 sm:p-8 rounded-3xl space-y-6 my-auto animate-fadeIn">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-bold text-[#f0f0f0]">Complete Practice Session</h3>
            <p className="text-xs text-[#a0a0a0] font-mono">
              Elapsed Time: <strong className="text-[#4ade80]">{formatTime(seconds)}</strong> ({Math.max(1, Math.round(seconds/60))} mins)
            </p>
          </div>

          <form onSubmit={handleFinalSave} className="space-y-4">
            {category === 'Speaking' && (
              <div>
                <label className="block text-xs font-semibold uppercase text-[#a0a0a0] mb-1">
                  Any notes?
                </label>
                <textarea
                  rows="3"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Notes on vocabulary, fluency, or reflection..."
                  className="w-full bg-[#1e1e1e] border border-[#3a3a3a] rounded-xl p-3 text-sm text-[#f0f0f0] focus:outline-none focus:border-[#525252] resize-none"
                />
              </div>
            )}

            {category === 'Writing' && (
              <>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#a0a0a0] mb-1">
                    Word Count
                  </label>
                  <input
                    type="number"
                    required
                    value={wordCount}
                    onChange={(e) => setWordCount(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-[#3a3a3a] rounded-xl p-3 text-sm text-[#f0f0f0] font-mono focus:outline-none focus:border-[#525252]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#a0a0a0] mb-1">
                    One-Line Summary
                  </label>
                  <input
                    type="text"
                    required
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Brief summary of your essay or journal entry..."
                    className="w-full bg-[#1e1e1e] border border-[#3a3a3a] rounded-xl p-3 text-sm text-[#f0f0f0] focus:outline-none focus:border-[#525252]"
                  />
                </div>
              </>
            )}

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCompletionForm(false)}
                className="px-4 py-2.5 rounded-xl border border-[#3a3a3a] text-xs font-medium text-[#a0a0a0] hover:bg-[#333333]"
              >
                Back to Timer
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#2d5a3d] hover:bg-[#3d7852] text-zinc-100 text-xs font-bold border border-[#4ade80]/40 flex items-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save to History</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bottom Hint */}
      <div className="text-center text-xs text-[#737373] font-mono">
        DailyDrill • Focus Mode
      </div>
    </div>
  );
}
