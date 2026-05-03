import { create } from 'zustand';

export interface AppState {
  wpm: number;
  setWpm: (wpm: number) => void;
  bookWpms: Record<string, number>;
  setBookWpm: (bookId: string, wpm: number) => void;
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
  updateBears: (newBears: number) => void;
}

export const useStore = create<AppState>((set) => ({
  wpm: 400,
  setWpm: (wpm) => set({ wpm }),
  bookWpms: {},
  setBookWpm: (bookId, wpm) => set((state) => ({ bookWpms: { ...state.bookWpms, [bookId]: wpm } })),
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
}));
