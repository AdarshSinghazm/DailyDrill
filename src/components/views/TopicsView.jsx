import React, { useState } from 'react';
import { 
  FolderKanban, 
  Mic, 
  PenTool, 
  CheckCircle2
} from 'lucide-react';
import { SPEAKING_TOPICS, WRITING_TOPICS, storage } from '../../utils/storage';

export default function TopicsView() {
  const [activeTab, setActiveTab] = useState('speaking'); // 'speaking' | 'writing'

  const completedSpeaking = storage.getCompletedSpeaking();
  const completedWriting = storage.getCompletedWriting();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3a3a3a] pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#f0f0f0] flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-[#f0f0f0]" />
            Practice Prompts & Topic Cycle Progress
          </h2>
          <p className="text-xs sm:text-sm text-[#a0a0a0] mt-1">
            Track completed prompts in your current 10-topic cycle. Once all 10 are completed, the cycle resets automatically.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#242424] border border-[#3a3a3a] p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('speaking')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'speaking'
                ? 'bg-[#404040] text-[#f0f0f0] border border-[#525252] shadow-sm'
                : 'text-[#a0a0a0] hover:text-[#f0f0f0]'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Speaking ({completedSpeaking.length}/10)</span>
          </button>
          <button
            onClick={() => setActiveTab('writing')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'writing'
                ? 'bg-[#404040] text-[#f0f0f0] border border-[#525252] shadow-sm'
                : 'text-[#a0a0a0] hover:text-[#f0f0f0]'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Writing ({completedWriting.length}/10)</span>
          </button>
        </div>
      </div>

      {/* Speaking Topics Grid */}
      {activeTab === 'speaking' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between bg-[#2d2d2d] p-4 rounded-xl border border-[#3a3a3a]">
            <div>
              <h3 className="text-sm font-bold text-[#f0f0f0] flex items-center gap-2">
                <Mic className="w-4 h-4 text-[#a0a0a0]" /> 4. Speaking — What to Speak About
              </h3>
              <p className="text-xs text-[#a0a0a0]">Current cycle progress: {completedSpeaking.length} of 10 done.</p>
            </div>

            {/* Cycle progress bar */}
            <div className="w-36 text-right">
              <div className="text-xs font-mono font-bold text-[#4ade80] mb-1">
                {Math.round((completedSpeaking.length / 10) * 100)}% Done
              </div>
              <div className="w-full bg-[#1e1e1e] rounded-full h-2 overflow-hidden border border-[#3a3a3a]">
                <div
                  className="bg-[#2d5a3d] h-full rounded-full transition-all duration-300"
                  style={{ width: `${(completedSpeaking.length / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SPEAKING_TOPICS.map((topic, index) => {
              const isDone = completedSpeaking.includes(topic);

              return (
                <div
                  key={index}
                  className={`minimal-card-interactive p-4 sm:p-5 rounded-2xl ${
                    isDone ? 'bg-[#2d5a3d]/20 border-[#2d5a3d]/50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h4 className={`text-sm font-bold leading-snug ${isDone ? 'text-[#4ade80] font-semibold' : 'text-[#f0f0f0]'}`}>
                          {topic}
                        </h4>
                      </div>
                    </div>

                    <div className="flex-shrink-0 ml-2">
                      {isDone ? (
                        <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#2d5a3d]/30 text-[#4ade80] border border-[#2d5a3d]/50">
                          <CheckCircle2 className="w-3 h-3 text-[#4ade80]" /> Done
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#242424] text-[#a0a0a0] border border-[#3a3a3a]">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Writing Topics Grid */}
      {activeTab === 'writing' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between bg-[#2d2d2d] p-4 rounded-xl border border-[#3a3a3a]">
            <div>
              <h3 className="text-sm font-bold text-[#f0f0f0] flex items-center gap-2">
                <PenTool className="w-4 h-4 text-[#a0a0a0]" /> 3. Writing — What to Write About
              </h3>
              <p className="text-xs text-[#a0a0a0]">Current cycle progress: {completedWriting.length} of 10 done.</p>
            </div>

            {/* Cycle progress bar */}
            <div className="w-36 text-right">
              <div className="text-xs font-mono font-bold text-[#4ade80] mb-1">
                {Math.round((completedWriting.length / 10) * 100)}% Done
              </div>
              <div className="w-full bg-[#1e1e1e] rounded-full h-2 overflow-hidden border border-[#3a3a3a]">
                <div
                  className="bg-[#2d5a3d] h-full rounded-full transition-all duration-300"
                  style={{ width: `${(completedWriting.length / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WRITING_TOPICS.map((topic, index) => {
              const isDone = completedWriting.includes(topic);

              return (
                <div
                  key={index}
                  className={`minimal-card-interactive p-4 sm:p-5 rounded-2xl ${
                    isDone ? 'bg-[#2d5a3d]/20 border-[#2d5a3d]/50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h4 className={`text-sm font-bold leading-snug ${isDone ? 'text-[#4ade80] font-semibold' : 'text-[#f0f0f0]'}`}>
                          {topic}
                        </h4>
                      </div>
                    </div>

                    <div className="flex-shrink-0 ml-2">
                      {isDone ? (
                        <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#2d5a3d]/30 text-[#4ade80] border border-[#2d5a3d]/50">
                          <CheckCircle2 className="w-3 h-3 text-[#4ade80]" /> Done
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#242424] text-[#a0a0a0] border border-[#3a3a3a]">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
