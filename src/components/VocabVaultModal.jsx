import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Plus, 
  Search, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Layers, 
  Check, 
  ChevronRight, 
  ChevronLeft 
} from 'lucide-react';

export default function VocabVaultModal({ vocabList = [], onClose, onAddVocab, onDeleteVocab, onUpdateVocab }) {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'flashcards' | 'add'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // New Word Form State
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newCategory, setNewCategory] = useState('Speaking');

  // Flashcards State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Filtered Vocabulary List
  const filteredList = vocabList.filter(item => {
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesSearch = item.word.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const masteredCount = vocabList.filter(v => v.learned).length;

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newWord.trim() || !newMeaning.trim()) return;

    onAddVocab({
      word: newWord.trim(),
      meaning: newMeaning.trim(),
      example: newExample.trim(),
      category: newCategory
    });

    setNewWord('');
    setNewMeaning('');
    setNewExample('');
    setActiveTab('list');
  };

  const handleToggleLearned = (item) => {
    onUpdateVocab({
      ...item,
      learned: !item.learned
    });
  };

  const currentFlashcard = filteredList[currentCardIndex] || filteredList[0];

  const handleNextFlashcard = () => {
    setIsFlipped(false);
    if (currentCardIndex < filteredList.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setCurrentCardIndex(0); // Loop back
    }
  };

  const handlePrevFlashcard = () => {
    setIsFlipped(false);
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    } else {
      setCurrentCardIndex(filteredList.length - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn selection:bg-[#404040]">
      <div className="bg-[#1e1e1e] border border-[#3a3a3a] w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-hidden text-[#f0f0f0]">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 border-b border-[#3a3a3a] flex items-center justify-between bg-[#242424]">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#2d2d2d] border border-[#3a3a3a] flex items-center justify-center text-[#4ade80] flex-shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold text-[#f0f0f0] flex flex-wrap items-center gap-1.5 sm:gap-2">
                Vocab Vault
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#1e1e1e] border border-[#3a3a3a] text-[#4ade80]">
                  {vocabList.length} Words ({masteredCount} Learned)
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-[#a0a0a0] hidden sm:block">Save new vocabulary and test yourself with interactive flashcards.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 sm:p-2.5 rounded-xl bg-[#2d2d2d] hover:bg-[#333333] border border-[#3a3a3a] text-[#a0a0a0] hover:text-[#f0f0f0] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Action Controls & Tab Switcher Bar */}
        <div className="p-3 sm:p-4 border-b border-[#3a3a3a] bg-[#242424] flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1 sm:space-x-2 bg-[#1e1e1e] p-1 rounded-xl border border-[#3a3a3a]">
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-[#404040] text-[#f0f0f0] border border-[#525252] shadow-sm'
                  : 'text-[#a0a0a0] hover:text-[#f0f0f0]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Vault ({vocabList.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('flashcards');
                setCurrentCardIndex(0);
                setIsFlipped(false);
              }}
              className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'flashcards'
                  ? 'bg-[#404040] text-[#f0f0f0] border border-[#525252] shadow-sm'
                  : 'text-[#a0a0a0] hover:text-[#f0f0f0]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#4ade80]" />
              <span>Flashcards</span>
            </button>
          </div>

          <button
            onClick={() => setActiveTab(activeTab === 'add' ? 'list' : 'add')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#2d5a3d] hover:bg-[#3d7852] text-zinc-100 border border-[#4ade80]/40 text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{activeTab === 'add' ? 'Back to Vault' : 'Add New Word'}</span>
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4">
          
          {/* ================= TAB 1: ADD NEW WORD FORM ================= */}
          {activeTab === 'add' && (
            <form onSubmit={handleAddSubmit} className="max-w-lg mx-auto bg-[#242424] p-6 rounded-2xl border border-[#3a3a3a] space-y-4 animate-fadeIn">
              <div className="border-b border-[#3a3a3a] pb-3">
                <h3 className="text-sm font-bold text-[#f0f0f0] flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#4ade80]" /> Add Word to Vocab Vault
                </h3>
                <p className="text-xs text-[#a0a0a0]">Store vocabulary or phrases to review later.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#a0a0a0] mb-1">
                  Word / Phrase *
                </label>
                <input
                  type="text"
                  required
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="e.g. Eloquent, Articulate, Resilient"
                  className="w-full bg-[#1e1e1e] border border-[#3a3a3a] rounded-xl px-4 py-2.5 text-sm text-[#f0f0f0] focus:outline-none focus:border-[#525252]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#a0a0a0] mb-1">
                  Meaning / Definition *
                </label>
                <input
                  type="text"
                  required
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  placeholder="e.g. Fluent or persuasive in speaking or writing"
                  className="w-full bg-[#1e1e1e] border border-[#3a3a3a] rounded-xl px-4 py-2.5 text-sm text-[#f0f0f0] focus:outline-none focus:border-[#525252]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#a0a0a0] mb-1">
                  Example Sentence (Optional)
                </label>
                <textarea
                  rows="2"
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  placeholder="e.g. She gave an eloquent speech at the conference."
                  className="w-full bg-[#1e1e1e] border border-[#3a3a3a] rounded-xl px-4 py-2.5 text-sm text-[#f0f0f0] focus:outline-none focus:border-[#525252] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#a0a0a0] mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-[#3a3a3a] rounded-xl px-4 py-2.5 text-sm text-[#f0f0f0] focus:outline-none focus:border-[#525252]"
                >
                  <option value="Speaking">Speaking</option>
                  <option value="Writing">Writing</option>
                  <option value="Consumption">Consumption</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2 rounded-xl border border-[#3a3a3a] text-xs font-medium text-[#a0a0a0] hover:bg-[#333333]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2d5a3d] hover:bg-[#3d7852] text-zinc-100 text-xs font-bold border border-[#4ade80]/40 flex items-center space-x-1.5"
                >
                  <SaveIcon className="w-3.5 h-3.5" />
                  <span>Save to Vault</span>
                </button>
              </div>
            </form>
          )}

          {/* ================= TAB 2: FLASHCARD QUIZ MODE ================= */}
          {activeTab === 'flashcards' && (
            <div className="max-w-md mx-auto space-y-6 my-auto animate-fadeIn py-6">
              {filteredList.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#a0a0a0] bg-[#242424] rounded-2xl border border-[#3a3a3a]">
                  No words available for flashcard practice. Add some words to your vault first!
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Card Counter Indicator */}
                  <div className="flex items-center justify-between text-xs text-[#a0a0a0] font-mono px-1">
                    <span>Flashcard {currentCardIndex + 1} of {filteredList.length}</span>
                    <span className="text-[#4ade80] font-semibold">{currentFlashcard.category}</span>
                  </div>

                  {/* Main Flip Card */}
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="w-full min-h-[220px] p-8 rounded-3xl bg-[#242424] border border-[#3a3a3a] hover:border-[#525252] shadow-2xl flex flex-col justify-between items-center text-center cursor-pointer transition-all duration-300 transform active:scale-98 select-none"
                  >
                    {!isFlipped ? (
                      /* FRONT SIDE */
                      <div className="my-auto space-y-3">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#a0a0a0] bg-[#1e1e1e] border border-[#3a3a3a] px-3 py-1 rounded-full">
                          Word / Phrase
                        </span>
                        <h3 className="text-3xl font-extrabold text-[#f0f0f0] tracking-tight">
                          {currentFlashcard.word}
                        </h3>
                        <p className="text-xs text-[#737373] flex items-center justify-center gap-1 pt-2">
                          <Eye className="w-3.5 h-3.5 text-[#4ade80]" /> Click card to reveal meaning
                        </p>
                      </div>
                    ) : (
                      /* BACK SIDE */
                      <div className="my-auto space-y-3 animate-fadeIn">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#4ade80] bg-[#2d5a3d]/30 border border-[#2d5a3d]/50 px-3 py-1 rounded-full">
                          Meaning & Example
                        </span>
                        <h4 className="text-lg font-bold text-[#f0f0f0] leading-snug">
                          {currentFlashcard.meaning}
                        </h4>
                        {currentFlashcard.example && (
                          <p className="text-xs text-[#a0a0a0] italic bg-[#1e1e1e] p-3 rounded-xl border border-[#3a3a3a]">
                            "{currentFlashcard.example}"
                          </p>
                        )}
                        <p className="text-[10px] text-[#737373] flex items-center justify-center gap-1 pt-1">
                          <EyeOff className="w-3.5 h-3.5 text-[#a0a0a0]" /> Click card to hide
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Flashcard Controls */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      onClick={handlePrevFlashcard}
                      className="p-3 rounded-xl bg-[#242424] hover:bg-[#333333] border border-[#3a3a3a] text-[#f0f0f0] transition-colors cursor-pointer"
                      title="Previous Card"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleToggleLearned(currentFlashcard)}
                      className={`flex-1 py-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                        currentFlashcard.learned
                          ? 'bg-[#2d5a3d] text-[#4ade80] border-[#2d5a3d]'
                          : 'bg-[#242424] text-[#a0a0a0] border-[#3a3a3a] hover:text-[#f0f0f0]'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>{currentFlashcard.learned ? 'Learned ✓' : 'Mark as Learned'}</span>
                    </button>

                    <button
                      onClick={handleNextFlashcard}
                      className="p-3 rounded-xl bg-[#242424] hover:bg-[#333333] border border-[#3a3a3a] text-[#f0f0f0] transition-colors cursor-pointer"
                      title="Next Card"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 3: ALL WORDS LIST ================= */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              {/* Search & Category Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-[#a0a0a0] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search words or meanings..."
                    className="w-full bg-[#242424] border border-[#3a3a3a] rounded-xl pl-10 pr-4 py-2 text-xs text-[#f0f0f0] placeholder:text-[#737373] focus:outline-none focus:border-[#525252]"
                  />
                </div>

                <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
                  {['All', 'Speaking', 'Writing', 'Consumption', 'General'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                        categoryFilter === cat
                          ? 'bg-[#404040] text-[#f0f0f0] border border-[#525252]'
                          : 'bg-[#242424] text-[#a0a0a0] border border-[#3a3a3a] hover:text-[#f0f0f0]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vocabulary Grid */}
              {filteredList.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#a0a0a0] bg-[#242424] rounded-2xl border border-[#3a3a3a]">
                  No vocabulary words found. Click "Add New Word" to store your first phrase!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredList.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl bg-[#242424] border space-y-2 flex flex-col justify-between transition-all ${
                        item.learned ? 'border-[#2d5a3d]/60 bg-[#2d5a3d]/10' : 'border-[#3a3a3a] hover:border-[#525252]'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-base font-extrabold text-[#f0f0f0]">
                              {item.word}
                            </h4>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#1e1e1e] text-[#a0a0a0] border border-[#3a3a3a]">
                              {item.category}
                            </span>
                          </div>

                          <button
                            onClick={() => handleToggleLearned(item)}
                            className={`p-1 rounded-lg transition-colors cursor-pointer ${
                              item.learned ? 'text-[#4ade80]' : 'text-[#737373] hover:text-[#f0f0f0]'
                            }`}
                            title={item.learned ? 'Learned' : 'Mark as Learned'}
                          >
                            <CheckCircle2 className="w-4.5 h-4.5" />
                          </button>
                        </div>

                        <p className="text-xs text-[#e5e5e5] font-medium leading-relaxed">
                          {item.meaning}
                        </p>

                        {item.example && (
                          <p className="text-[11px] text-[#a0a0a0] italic bg-[#1e1e1e] p-2.5 rounded-xl border border-[#3a3a3a]">
                            "{item.example}"
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-[#3a3a3a]/60 flex items-center justify-between text-[10px] text-[#737373] font-mono">
                        <span>Added: {item.date}</span>
                        <button
                          onClick={() => onDeleteVocab(item.id)}
                          className="text-[#737373] hover:text-[#f0f0f0] p-1 cursor-pointer transition-colors"
                          title="Delete Word"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 border-t border-[#3a3a3a] bg-[#242424] flex items-center justify-between text-xs text-[#a0a0a0]">
          <span>DailyDrill • Vocab Vault</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#404040] hover:bg-[#525252] text-[#f0f0f0] font-semibold text-xs border border-[#525252] cursor-pointer"
          >
            Close Vault
          </button>
        </div>

      </div>
    </div>
  );
}

function SaveIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M152 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7z"/>
      <polyline points="14 3 14 8 8 8"/>
      <line x1="16" x2="16" y1="13" y2="21"/>
    </svg>
  );
}
