
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'mileage_app_data_v1';

export const StorageService = {
  getEntries: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to load entries", e);
      return [];
    }
  },

  saveEntries: (entries) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error("Failed to save entries", e);
    }
  },

  addEntry: (entry) => {
    const entries = StorageService.getEntries();
    const newEntry = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...entry
    };
    // Prepend to list (newest first)
    const updatedEntries = [newEntry, ...entries];
    StorageService.saveEntries(updatedEntries);
    return newEntry;
  },

  updateEntry: (id, updatedFields) => {
    const entries = StorageService.getEntries();
    const updatedEntries = entries.map(entry => 
      entry.id === id ? { ...entry, ...updatedFields } : entry
    );
    StorageService.saveEntries(updatedEntries);
    return updatedEntries.find(e => e.id === id);
  },

  deleteEntry: (id) => {
    const entries = StorageService.getEntries();
    const updatedEntries = entries.filter(e => e.id !== id);
    StorageService.saveEntries(updatedEntries);
  }
};
