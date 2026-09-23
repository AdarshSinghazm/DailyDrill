import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Mic, 
  PenTool, 
  Tv, 
  Trash2, 
  Clock, 
  BookOpen, 
  Edit2, 
  Check 
} from 'lucide-react';
import { SPEAKING_TOPICS, WRITING_TOPICS } from '../utils/storage';

export default function DayWiseHistoryModal({ entries = [], onClose, onDeleteEntry, onUpdateEntry }) {
  // Group entries by date string
  const groupedEntries = entries.reduce((acc, entry) => {
    const dateKey = entry.date || 'Unknown Date';
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(entry);
    return acc;
  }, {});

  const datesSorted = Object.keys(groupedEntries).sort((a, b) => new Date(b) - new Date(a));
  
  // Selected date state (defaults to most recent date or today)
  const [selectedDate, setSelectedDate] = useState(datesSorted[0] || new Date().toISOString().split('T')[0]);

  // Edit Mode state
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const selectedDayLogs = groupedEntries[selectedDate] || [];

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setEditFormData({ ...entry });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    onUpdateEntry(editFormData);
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-[#1e1e1e] border border-[#3a3a3a] w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-[#f0f0f0]">
        
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-[#3a3a3a] flex items-center justify-between bg-[#242424]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2d2d2d] border border-[#3a3a3a] flex items-center justify-center text-[#4ade80]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#f0f0f0]">DailyDrill — Practice Journal</h2>
              <p className="text-xs text-[#a0a0a0]">Edit duration, topic, notes, or delete past entries.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-[#2d2d2d] hover:bg-[#333333] border border-[#3a3a3a] text-[#a0a0a0] hover:text-[#f0f0f0] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left Date Selector Sidebar + Right Day Logs */}
        {datesSorted.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#a0a0a0]">
            No practice entries logged yet. Start a session or save an entry on the main page!
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Date List */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#3a3a3a] bg-[#242424] p-3 overflow-y-auto space-y-1.5 flex-shrink-0 max-h-48 md:max-h-full">
              <span className="text-[10px] font-bold text-[#a0a0a0] uppercase tracking-wider px-3 py-1 block">
                Select Date ({datesSorted.length} Days)
              </span>

              {datesSorted.map((dateStr) => {
                const isSelected = dateStr === selectedDate;
                const count = groupedEntries[dateStr].length;
                const dateFormatted = new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  weekday: 'short'
                });

                return (
                  <button
                    key={dateStr}
                    onClick={() => {
                      setSelectedDate(dateStr);
                      setEditingId(null);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#404040] text-[#f0f0f0] border border-[#525252] shadow-sm'
                        : 'text-[#a0a0a0] hover:text-[#f0f0f0] hover:bg-[#2d2d2d]'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Calendar className={`w-3.5 h-3.5 ${isSelected ? 'text-[#4ade80]' : 'text-[#a0a0a0]'}`} />
                      <span>{dateFormatted}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e1e1e] border border-[#3a3a3a]">
                      {count} entries
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Day Logs Detail & Editing Form */}
            <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between border-b border-[#3a3a3a] pb-3">
                <h3 className="text-sm font-bold text-[#f0f0f0] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#4ade80]" />
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h3>
                <span className="text-xs font-mono text-[#a0a0a0]">
                  {selectedDayLogs.length} entries on this day
                </span>
              </div>

              {selectedDayLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#a0a0a0]">
                  No entries logged for this date.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDayLogs.map((entry) => {
                    const isEditing = editingId === entry.id;
                    const isConsumption = entry.category === 'Consumption';
                    const isSpeaking = entry.category === 'Speaking';
                    const isWriting = entry.category === 'Writing';

                    const Icon = isConsumption ? Tv : isSpeaking ? Mic : PenTool;

                    if (isEditing) {
                      return (
                        <form
                          key={entry.id}
                          onSubmit={handleSaveEdit}
                          className="p-4 rounded-2xl bg-[#1e1e1e] border border-[#4ade80]/60 space-y-3 shadow-lg"
                        >
                          <div className="flex items-center justify-between border-b border-[#3a3a3a] pb-2">
                            <span className="text-xs font-bold text-[#4ade80] flex items-center gap-1.5">
                              <Edit2 className="w-3.5 h-3.5" /> Editing {entry.category} Entry
                            </span>
                            <span className="text-[10px] font-mono text-[#a0a0a0]">{entry.id}</span>
                          </div>

                          {/* Date Field */}
                          <div>
                            <label className="block text-[10px] font-semibold uppercase text-[#a0a0a0] mb-1">
                              Entry Date
                            </label>
                            <input
                              type="date"
                              required
                              value={editFormData.date || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                              className="w-full bg-[#242424] border border-[#3a3a3a] rounded-xl px-3 py-1.5 text-xs text-[#f0f0f0] font-mono focus:outline-none focus:border-[#525252]"
                            />
                          </div>

                          {/* SPEAKING EDIT */}
                          {isSpeaking && (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-[10px] font-semibold uppercase text-[#a0a0a0] mb-1">
                                  Topic Prompt
                                </label>
                                <select
                                  value={editFormData.topic || ''}
                                  onChange={(e) => setEditFormData({ ...editFormData, topic: e.target.value })}
                                  className="w-full bg-[#242424] border border-[#3a3a3a] rounded-xl px-3 py-1.5 text-xs text-[#f0f0f0] focus:outline-none focus:border-[#525252]"
                                >
                                  {SPEAKING_TOPICS.map((t, idx) => (
                                    <option key={idx} value={t}>{t}</option>
                                  ))}
                                </select>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[10px] font-semibold uppercase text-[#a0a0a0] mb-1">
                                    How long? (minutes)
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    required
                                    value={editFormData.duration || 0}
                                    onChange={(e) => setEditFormData({ ...editFormData, duration: Number(e.target.value) })}
                                    className="w-full bg-[#242424] border border-[#3a3a3a] rounded-xl px-3 py-1.5 text-xs text-[#f0f0f0] font-mono focus:outline-none focus:border-[#525252]"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-semibold uppercase text-[#a0a0a0] mb-1">
                                    Any notes?
                                  </label>
                                  <input
                                    type="text"
                                    value={editFormData.note || ''}
                                    onChange={(e) => setEditFormData({ ...editFormData, note: e.target.value })}
                                    className="w-full bg-[#242424] border border-[#3a3a3a] rounded-xl px-3 py-1.5 text-xs text-[#f0f0f0] focus:outline-none focus:border-[#525252]"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* WRITING EDIT */}
                          {isWriting && (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-[10px] font-semibold uppercase text-[#a0a0a0] mb-1">
                                  Topic Prompt
                                </label>
                                <select
                                  value={editFormData.topic || ''}
                                  onChange={(e) => setEditFormData({ ...editFormData, topic: e.target.value })}
                                  className="w-full bg-[#242424] border border-[#3a3a3a] rounded-xl px-3 py-1.5 text-xs text-[#f0f0f0] focus:outline-none focus:border-[#525252]"
                                >
                                  {WRITING_TOPICS.map((t, idx) => (
                                    <option key={idx} value={t}>{t}</option>
                                  ))}
                                </select>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[10px] font-semibold uppercase text-[#a0a0a0] mb-1">
                                    Word Count
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    required
                                    value={editFormData.wordCount || 0}
                                    onChange={(e) => setEditFormData({ ...editFormData, wordCount: Number(e.target.value) })}
                                    className="w-full bg-[#242424] border border-[#3a3a3a] rounded-xl px-3 py-1.5 text-xs text-[#f0f0f0] font-mono focus:outline-none focus:border-[#525252]"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-semibold uppercase text-[#a0a0a0] mb-1">
                                    One-Line Summary
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    value={editFormData.summary || ''}
                                    onChange={(e) => setEditFormData({ ...editFormData, summary: e.target.value })}
                                    className="w-full bg-[#242424] border border-[#3a3a3a] rounded-xl px-3 py-1.5 text-xs text-[#f0f0f0] focus:outline-none focus:border-[#525252]"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* CONSUMPTION EDIT */}
                          {isConsumption && (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-[10px] font-semibold uppercase text-[#a0a0a0] mb-1">
                                  Title / Media Name
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={editFormData.title || ''}
                                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                  className="w-full bg-[#242424] border border-[#3a3a3a] rounded-xl px-3 py-1.5 text-xs text-[#f0f0f0] focus:outline-none focus:border-[#525252]"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[10px] font-semibold uppercase text-[#a0a0a0] mb-1">
                                    Media Type
                                  </label>
                                  <select
                                    value={editFormData.mediaType || ''}
                                    onChange={(e) => setEditFormData({ ...editFormData, mediaType: e.target.value })}
                                    className="w-full bg-[#242424] border border-[#3a3a3a] rounded-xl px-3 py-1.5 text-xs text-[#f0f0f0] focus:outline-none focus:border-[#525252]"
                                  >
                                    <option value="TED talk">TED talk</option>
                                    <option value="Podcast">Podcast</option>
                                    <option value="Show">Show</option>
                                    <option value="Movie">Movie</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-[10px] font-semibold uppercase text-[#a0a0a0] mb-1">
                                    How long? (minutes)
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    required
                                    value={editFormData.duration || 0}
                                    onChange={(e) => setEditFormData({ ...editFormData, duration: Number(e.target.value) })}
                                    className="w-full bg-[#242424] border border-[#3a3a3a] rounded-xl px-3 py-1.5 text-xs text-[#f0f0f0] font-mono focus:outline-none focus:border-[#525252]"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Save & Cancel Edit Controls */}
                          <div className="pt-2 flex items-center justify-end space-x-2">
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="px-3 py-1.5 rounded-lg border border-[#3a3a3a] text-xs font-medium text-[#a0a0a0] hover:bg-[#333333]"
                            >
                              Cancel
                            </button>

                            <button
                              type="submit"
                              className="px-4 py-1.5 rounded-lg bg-[#2d5a3d] hover:bg-[#3d7852] text-zinc-100 font-bold text-xs border border-[#4ade80]/40 flex items-center space-x-1.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Save Changes</span>
                            </button>
                          </div>
                        </form>
                      );
                    }

                    return (
                      <div
                        key={entry.id}
                        className="p-4.5 rounded-2xl bg-[#242424] border border-[#3a3a3a] space-y-3 flex items-start justify-between hover:border-[#525252] transition-all"
                      >
                        <div className="space-y-2 flex-1 pr-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#333333] text-[#f0f0f0] border border-[#404040] flex items-center gap-1">
                              <Icon className="w-3 h-3 text-[#4ade80]" />
                              {entry.category}
                            </span>
                            <h4 className="text-sm font-bold text-[#f0f0f0]">
                              {isConsumption ? entry.title : entry.topic}
                            </h4>
                          </div>

                          {/* Speaking Details */}
                          {isSpeaking && (
                            <div className="text-xs text-[#a0a0a0] space-y-1">
                              <p className="flex items-center gap-1 font-mono">
                                <Clock className="w-3.5 h-3.5 text-[#a0a0a0]" /> How long? <strong className="text-[#f0f0f0]">{entry.duration} mins</strong>
                              </p>
                              {entry.note ? (
                                <p className="text-xs text-[#f0f0f0] italic bg-[#1e1e1e] p-3 rounded-xl border border-[#3a3a3a] mt-1">
                                  "{entry.note}"
                                </p>
                              ) : (
                                <p className="text-[11px] text-[#737373] italic">No notes added.</p>
                              )}
                            </div>
                          )}

                          {/* Writing Details */}
                          {isWriting && (
                            <div className="text-xs text-[#a0a0a0] space-y-1">
                              <p className="flex items-center gap-1 font-mono">
                                <PenTool className="w-3.5 h-3.5 text-[#a0a0a0]" /> Word Count: <strong className="text-[#f0f0f0]">{entry.wordCount} words</strong>
                              </p>
                              {entry.summary && (
                                <div className="text-xs text-[#f0f0f0] bg-[#1e1e1e] p-3 rounded-xl border border-[#3a3a3a] mt-1 space-y-0.5">
                                  <span className="text-[10px] uppercase font-bold text-[#a0a0a0] block">What was written:</span>
                                  <p className="font-medium">"{entry.summary}"</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Consumption Details */}
                          {isConsumption && (
                            <div className="text-xs text-[#a0a0a0] space-y-1">
                              <p>Media Type: <strong className="text-[#f0f0f0]">{entry.mediaType}</strong></p>
                              <p className="font-mono">How long? <strong className="text-[#f0f0f0]">{entry.duration} mins</strong></p>
                            </div>
                          )}
                        </div>

                        {/* Edit & Delete Action Buttons */}
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <button
                            onClick={() => startEdit(entry)}
                            className="p-2 rounded-xl text-[#a0a0a0] hover:text-[#4ade80] hover:bg-[#333333] transition-colors cursor-pointer"
                            title="Edit Entry"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onDeleteEntry(entry.id)}
                            className="p-2 rounded-xl text-[#737373] hover:text-[#f0f0f0] hover:bg-[#333333] transition-colors cursor-pointer"
                            title="Delete Entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Bottom Footer */}
        <div className="p-4 border-t border-[#3a3a3a] bg-[#242424] flex items-center justify-between text-xs text-[#a0a0a0]">
          <span>DailyDrill • Practice Journal</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#404040] hover:bg-[#525252] text-[#f0f0f0] font-semibold text-xs border border-[#525252] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
