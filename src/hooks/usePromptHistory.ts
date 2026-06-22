import { useState } from 'react';
import type { HistoryItem } from '../types';

const STORAGE_KEY = "prompt_history";
const MAX_ITEMS = 20;

interface UsePromptHistoryReturn {
  history: HistoryItem[];
  addItem: (item: HistoryItem) => void;
  deleteItem: (id: string) => void;
  clearAll: () => void;
}

export function usePromptHistory(): UsePromptHistoryReturn {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as HistoryItem[]) : [];
    } catch {
      return [];
    }
  });

  const addItem = (item: HistoryItem) => {
    setHistory((prev) => {
      const updated = [item, ...prev].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteItem = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((h) => h.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearAll = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { history, addItem, deleteItem, clearAll };
}
