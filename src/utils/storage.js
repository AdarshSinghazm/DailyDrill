// Local Storage persistence utility for Daily Practice Tracker

const STORAGE_KEYS = {
  ENTRIES: 'daily_practice_entries',
  COMPLETED_SPEAKING: 'daily_practice_completed_speaking',
  COMPLETED_WRITING: 'daily_practice_completed_writing',
  VOCAB: 'daily_practice_vocab',
};

// 10 Speaking Prompts provided by the user
export const SPEAKING_TOPICS = [
  "1. Introduce yourself and talk about your hobbies",
  "2. Describe your daily routine",
  "3. Talk about your favorite book, movie, or song",
  "4. Retell a story you have read or watched",
  "5. Describe a memorable moment in your life",
  "6. Talk about your family or friends",
  "7. Practice role-plays (shopping, ordering food, interviews)",
  "8. Give your opinion on a simple topic",
  "9. Practice speaking in front of a mirror or by recording yourself",
  "10. Have short conversations with classmates in English"
];

// 10 Writing Prompts provided by the user
export const WRITING_TOPICS = [
  "1. Write a daily journal about your day",
  "2. Write about an important episode in your life",
  "3. Describe your best friend or a family member",
  "4. Write about your favorite movie or TV show",
  "5. Write a short story (real or imaginary)",
  "6. Write about a place you have visited or want to visit",
  "7. Write an email or message to a friend",
  "8. Write a summary of something you read or watched",
  "9. Write about your goals and future plans",
  "10. Write your opinion on a simple topic"
];

export const storage = {
  getEntries: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ENTRIES);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Error reading entries from localStorage:', e);
      return [];
    }
  },

  saveEntries: (entries) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
    } catch (e) {
      console.error('Error saving entries to localStorage:', e);
    }
  },

  addEntry: (entry) => {
    try {
      const entries = storage.getEntries();
      const newEntry = {
        id: `entry-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        ...entry
      };

      if (entry.category === 'Speaking' && entry.topic) {
        storage.markSpeakingDone(entry.topic);
      } else if (entry.category === 'Writing' && entry.topic) {
        storage.markWritingDone(entry.topic);
      }

      const updated = [newEntry, ...entries];
      storage.saveEntries(updated);
      return updated;
    } catch (e) {
      console.error('Error adding entry:', e);
      return [];
    }
  },

  deleteEntry: (id) => {
    try {
      const entries = storage.getEntries();
      const updated = entries.filter(e => e.id !== id);
      storage.saveEntries(updated);
      return updated;
    } catch (e) {
      console.error('Error deleting entry:', e);
      return [];
    }
  },

  updateEntry: (updatedEntry) => {
    try {
      const entries = storage.getEntries();
      const updated = entries.map(e => e.id === updatedEntry.id ? { ...e, ...updatedEntry } : e);
      storage.saveEntries(updated);
      return updated;
    } catch (e) {
      console.error('Error updating entry:', e);
      return [];
    }
  },

  // ================= VOCAB VAULT METHODS =================
  getVocabList: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VOCAB);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Error reading vocab from localStorage:', e);
      return [];
    }
  },

  saveVocabList: (list) => {
    try {
      localStorage.setItem(STORAGE_KEYS.VOCAB, JSON.stringify(list));
    } catch (e) {
      console.error('Error saving vocab list to localStorage:', e);
    }
  },

  addVocabItem: (item) => {
    try {
      const list = storage.getVocabList();
      const newItem = {
        id: `vocab-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        learned: false,
        ...item
      };
      const updated = [newItem, ...list];
      storage.saveVocabList(updated);
      return updated;
    } catch (e) {
      console.error('Error adding vocab item:', e);
      return [];
    }
  },

  deleteVocabItem: (id) => {
    try {
      const list = storage.getVocabList();
      const updated = list.filter(v => v.id !== id);
      storage.saveVocabList(updated);
      return updated;
    } catch (e) {
      console.error('Error deleting vocab item:', e);
      return [];
    }
  },

  updateVocabItem: (updatedItem) => {
    try {
      const list = storage.getVocabList();
      const updated = list.map(v => v.id === updatedItem.id ? { ...v, ...updatedItem } : v);
      storage.saveVocabList(updated);
      return updated;
    } catch (e) {
      console.error('Error updating vocab item:', e);
      return [];
    }
  },

  getCompletedSpeaking: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_SPEAKING);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Error reading completed speaking topics:', e);
      return [];
    }
  },

  getCompletedWriting: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_WRITING);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Error reading completed writing topics:', e);
      return [];
    }
  },

  markSpeakingDone: (topicName) => {
    try {
      let done = storage.getCompletedSpeaking();
      if (!done.includes(topicName)) {
        done.push(topicName);
      }
      if (done.length >= SPEAKING_TOPICS.length) {
        done = [];
      }
      localStorage.setItem(STORAGE_KEYS.COMPLETED_SPEAKING, JSON.stringify(done));
      return done;
    } catch (e) {
      console.error('Error marking speaking topic done:', e);
      return [];
    }
  },

  markWritingDone: (topicName) => {
    try {
      let done = storage.getCompletedWriting();
      if (!done.includes(topicName)) {
        done.push(topicName);
      }
      if (done.length >= WRITING_TOPICS.length) {
        done = [];
      }
      localStorage.setItem(STORAGE_KEYS.COMPLETED_WRITING, JSON.stringify(done));
      return done;
    } catch (e) {
      console.error('Error marking writing topic done:', e);
      return [];
    }
  },

  getNextSpeakingTopic: () => {
    try {
      const done = storage.getCompletedSpeaking();
      const next = SPEAKING_TOPICS.find(t => !done.includes(t));
      return next || SPEAKING_TOPICS[0];
    } catch (e) {
      return SPEAKING_TOPICS[0];
    }
  },

  getNextWritingTopic: () => {
    try {
      const done = storage.getCompletedWriting();
      const next = WRITING_TOPICS.find(t => !done.includes(t));
      return next || WRITING_TOPICS[0];
    } catch (e) {
      return WRITING_TOPICS[0];
    }
  },

  calculateStreak: () => {
    try {
      const entries = storage.getEntries();
      if (entries.length === 0) return 0;

      const dateSet = new Set(entries.map(e => e.date).filter(Boolean));
      const todayStr = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (!dateSet.has(todayStr) && !dateSet.has(yesterdayStr)) {
        return 0;
      }

      let streak = 0;
      let checkDate = dateSet.has(todayStr) ? new Date() : yesterday;

      while (true) {
        const checkStr = checkDate.toISOString().split('T')[0];
        if (dateSet.has(checkStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
      return streak;
    } catch (e) {
      console.error('Error calculating streak:', e);
      return 0;
    }
  }
};
