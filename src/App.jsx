import React, { useState } from 'react';
import MinimalMainView from './components/views/MinimalMainView';
import TimerOverlay from './components/TimerOverlay';
import DayWiseHistoryModal from './components/DayWiseHistoryModal';
import VocabVaultModal from './components/VocabVaultModal';
import { storage } from './utils/storage';

export default function App() {
  const [entries, setEntries] = useState(() => storage.getEntries());
  const [vocabList, setVocabList] = useState(() => storage.getVocabList());
  const [activeSessionConfig, setActiveSessionConfig] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isVocabModalOpen, setIsVocabModalOpen] = useState(false);

  const handleStartTimer = (sessionConfig) => {
    setActiveSessionConfig(sessionConfig);
  };

  const handleQuickSave = (entryData) => {
    const updatedEntries = storage.addEntry(entryData);
    setEntries(updatedEntries);
  };

  const handleCompleteTimerSession = (finalEntryData) => {
    const updatedEntries = storage.addEntry(finalEntryData);
    setEntries(updatedEntries);
    setActiveSessionConfig(null);
  };

  const handleCancelTimer = () => {
    setActiveSessionConfig(null);
  };

  const handleDeleteEntry = (entryId) => {
    const updatedEntries = storage.deleteEntry(entryId);
    setEntries(updatedEntries);
  };

  const handleUpdateEntry = (updatedEntryData) => {
    const updatedEntries = storage.updateEntry(updatedEntryData);
    setEntries(updatedEntries);
  };

  // Vocab Handlers
  const handleAddVocab = (vocabItem) => {
    const updated = storage.addVocabItem(vocabItem);
    setVocabList(updated);
  };

  const handleDeleteVocab = (id) => {
    const updated = storage.deleteVocabItem(id);
    setVocabList(updated);
  };

  const handleUpdateVocab = (updatedItem) => {
    const updated = storage.updateVocabItem(updatedItem);
    setVocabList(updated);
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#1e1e1e] text-[#f0f0f0] font-sans p-4 sm:p-5 lg:p-6 selection:bg-[#404040]">
      {/* Full Page App Dashboard */}
      <MinimalMainView
        entries={entries}
        vocabList={vocabList}
        onStartTimer={handleStartTimer}
        onQuickSave={handleQuickSave}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
        onOpenVocabModal={() => setIsVocabModalOpen(true)}
      />

      {/* Day-Wise History Journal Modal with Edit & Delete */}
      {isHistoryModalOpen && (
        <DayWiseHistoryModal
          entries={entries}
          onClose={() => setIsHistoryModalOpen(false)}
          onDeleteEntry={handleDeleteEntry}
          onUpdateEntry={handleUpdateEntry}
        />
      )}

      {/* Vocab Vault Modal & Flashcard Quiz */}
      {isVocabModalOpen && (
        <VocabVaultModal
          vocabList={vocabList}
          onClose={() => setIsVocabModalOpen(false)}
          onAddVocab={handleAddVocab}
          onDeleteVocab={handleDeleteVocab}
          onUpdateVocab={handleUpdateVocab}
        />
      )}

      {/* Full-Screen Focus Timer Overlay */}
      {activeSessionConfig && (
        <TimerOverlay
          practiceSession={activeSessionConfig}
          onComplete={handleCompleteTimerSession}
          onCancel={handleCancelTimer}
        />
      )}
    </div>
  );
}
