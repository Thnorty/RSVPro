import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface Book {
  id: string;
  title: string;
  author?: string;
  content: string;
  progress: number; // Index of the last read word
  totalWords?: number;
  type: 'document' | 'article' | 'pasted';
  dateAdded: number;
  status?: 'processing' | 'ready' | 'error';
}

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'cancel' | 'default' | 'destructive';
}

export interface AppState {
  wpm: number;
  setWpm: (wpm: number) => void;
  bookWpms: Record<string, number>;
  setBookWpm: (bookId: string, wpm: number) => void;
  books: Book[];
  addBook: (book: Book) => void;
  updateBook: (bookId: string, updates: Partial<Book>) => void;
  updateBookProgress: (bookId: string, progress: number) => void;
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
  updateBears: (newBears: number) => void;
  
  // Custom Alert State
  isAlertVisible: boolean;
  alertTitle: string;
  alertMessage?: string;
  alertButtons?: AlertButton[];
  showAlert: (title: string, message?: string, buttons?: AlertButton[]) => void;
  hideAlert: () => void;
}

export const useStore = create<AppState>((set) => ({
  wpm: 400,
  setWpm: async (wpm) => {
    set({ wpm });
    
    // Sync with Supabase asynchronously without blocking UI
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase
          .from('user_settings')
          .upsert({ user_id: session.user.id, wpm: wpm }, { onConflict: 'user_id' });
      }
    } catch (error) {
      console.error('Error syncing WPM to Supabase:', error);
    }
  },
  bookWpms: {},
  setBookWpm: (bookId, wpm) => set((state) => ({ bookWpms: { ...state.bookWpms, [bookId]: wpm } })),
  books: [],
  addBook: (book) => set((state) => ({ books: [book, ...state.books] })),
  updateBook: (bookId, updates) =>
    set((state) => ({
      books: state.books.map((b) => (b.id === bookId ? { ...b, ...updates } : b)),
    })),
  updateBookProgress: (bookId, progress) =>
    set((state) => ({
      books: state.books.map((b) => (b.id === bookId ? { ...b, progress } : b)),
    })),
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),

  // Custom Alert Initial State
  isAlertVisible: false,
  alertTitle: '',
  alertMessage: undefined,
  alertButtons: [],
  showAlert: (title, message, buttons) =>
    set({ isAlertVisible: true, alertTitle: title, alertMessage: message, alertButtons: buttons || [{ text: 'OK' }] }),
  hideAlert: () => set({ isAlertVisible: false }),
}));
