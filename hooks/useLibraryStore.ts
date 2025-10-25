import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Book, Bookcase, BookPosition } from '../types';
import { generateAICover } from '../services/geminiService';

const BOOKCASE_SHELVES = 5;
const BOOKCASE_SLOTS_PER_SHELF = 12;

interface LibraryState {
  books: Book[];
  bookcases: Bookcase[];
  selectedBookId: string | null;
  movingBookId: string | null;
  isAddBookModalOpen: boolean;
  isBookDetailOpen: boolean;
  isBookViewOpen: boolean;
  isLoadingCover: boolean;

  actions: {
    addBook: (bookData: Omit<Book, 'id' | 'position' | 'createdAt' | 'coverGenerated'>, coverFile?: File) => Promise<void>;
    updateBookPosition: (bookId: string, newPosition: BookPosition) => void;
    deleteBook: (bookId: string) => void;
    addBookcase: () => void;
    
    selectBook: (bookId: string | null) => void;
    setMovingBookId: (bookId: string | null) => void;
    
    toggleAddBookModal: (isOpen?: boolean) => void;
    toggleBookDetail: (isOpen?: boolean) => void;
    toggleBookView: (isOpen?: boolean) => void;
    
    loadLibrary: () => void;
    importLibrary: (file: File) => void;
    exportLibrary: () => void;
    
    findNextAvailableSlot: () => BookPosition | null;
    generateCoverForBook: (bookId: string) => Promise<void>;
  };
}

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};


export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      books: [],
      bookcases: [],
      selectedBookId: null,
      movingBookId: null,
      isAddBookModalOpen: false,
      isBookDetailOpen: false,
      isBookViewOpen: false,
      isLoadingCover: false,

      actions: {
        addBook: async (bookData, coverFile) => {
          set({ isLoadingCover: true });
          let coverUrl = bookData.coverUrl;
          let coverGenerated = false;

          try {
            if (coverFile) {
              coverUrl = await fileToDataUrl(coverFile);
            } else if (!coverUrl) {
              const prompt = `Minimalist book cover for '${bookData.title}' by ${bookData.author}. Style: modern, warm palette, bold title typography.`;
              const base64Image = await generateAICover(prompt);
              coverUrl = `data:image/png;base64,${base64Image}`;
              coverGenerated = true;
            }

            const position = get().actions.findNextAvailableSlot();
            if (!position) {
              console.error("No available slots to add a new book.");
              alert("All bookcases are full! Please add a new bookcase first.");
              return;
            }

            const newBook: Book = {
              ...bookData,
              id: uuidv4(),
              position,
              createdAt: new Date().toISOString(),
              coverUrl,
              coverGenerated
            };

            set((state) => ({ books: [...state.books, newBook] }));
            get().actions.toggleAddBookModal(false);
          } catch (error) {
            console.error("Error adding book:", error);
            alert("Failed to add book. If generating a cover, the API might have failed.");
          } finally {
            set({ isLoadingCover: false });
          }
        },
        updateBookPosition: (bookId, newPosition) => {
          set((state) => ({
            books: state.books.map((book) =>
              book.id === bookId ? { ...book, position: newPosition } : book
            ),
            movingBookId: null, // Exit move mode after successful move
          }));
        },
        deleteBook: (bookId) => {
          set((state) => ({
            books: state.books.filter((book) => book.id !== bookId),
            selectedBookId: state.selectedBookId === bookId ? null : state.selectedBookId,
            isBookDetailOpen: state.selectedBookId === bookId ? false : state.isBookDetailOpen
          }));
        },
        addBookcase: () => {
          const newBookcase: Bookcase = {
            id: `bookcase-${get().bookcases.length + 1}`,
            position: [get().bookcases.length * -4, 0, -2.5],
            rotationY: 0,
            shelves: BOOKCASE_SHELVES,
            slotsPerShelf: BOOKCASE_SLOTS_PER_SHELF,
          };
          set((state) => ({ bookcases: [...state.bookcases, newBookcase] }));
        },
        selectBook: (bookId) => {
          set({ selectedBookId: bookId, isBookDetailOpen: !!bookId, isBookViewOpen: false, movingBookId: null });
        },
        setMovingBookId: (bookId) => {
          set({ movingBookId: bookId, isBookDetailOpen: false });
        },
        toggleAddBookModal: (isOpen) => set((state) => ({ isAddBookModalOpen: isOpen !== undefined ? isOpen : !state.isAddBookModalOpen })),
        toggleBookDetail: (isOpen) => set((state) => ({ isBookDetailOpen: isOpen !== undefined ? isOpen : !state.isBookDetailOpen, selectedBookId: isOpen === false ? null : state.selectedBookId })),
        toggleBookView: (isOpen) => set((state) => ({ isBookViewOpen: isOpen !== undefined ? isOpen : !state.isBookViewOpen, isBookDetailOpen: isOpen ? false : state.isBookDetailOpen })),
        loadLibrary: () => {
          if (get().bookcases.length === 0) {
            get().actions.addBookcase(); // Add initial bookcase if library is empty
          }
        },
        importLibrary: (file) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const importedState = JSON.parse(event.target?.result as string);
              if (importedState.books && importedState.bookcases) {
                set({ books: importedState.books, bookcases: importedState.bookcases });
              } else {
                alert("Invalid library file format.");
              }
            } catch (error) {
              console.error("Error importing library:", error);
              alert("Failed to import library file.");
            }
          };
          reader.readAsText(file);
        },
        exportLibrary: () => {
          const stateToExport = {
            books: get().books,
            bookcases: get().bookcases,
          };
          const blob = new Blob([JSON.stringify(stateToExport, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'virtual-library.json';
          a.click();
          URL.revokeObjectURL(url);
        },
        findNextAvailableSlot: () => {
          const { bookcases, books } = get();
          for (const bookcase of bookcases) {
            for (let shelfIndex = 0; shelfIndex < bookcase.shelves; shelfIndex++) {
              for (let slotIndex = 0; slotIndex < bookcase.slotsPerShelf; slotIndex++) {
                const isOccupied = books.some(
                  (book) =>
                    book.position.bookcaseId === bookcase.id &&
                    book.position.shelfIndex === shelfIndex &&
                    book.position.slotIndex === slotIndex
                );
                if (!isOccupied) {
                  return { bookcaseId: bookcase.id, shelfIndex, slotIndex };
                }
              }
            }
          }
          return null; // All slots are full
        },
        generateCoverForBook: async (bookId) => {
            const book = get().books.find(b => b.id === bookId);
            if (!book) return;
            set({isLoadingCover: true});
            try {
                const prompt = `Minimalist book cover for '${book.title}' by ${book.author}. Style: modern, warm palette, bold title typography.`;
                const base64Image = await generateAICover(prompt);
                const coverUrl = `data:image/png;base64,${base64Image}`;
                set(state => ({
                    books: state.books.map(b => b.id === bookId ? {...b, coverUrl, coverGenerated: true} : b)
                }));
            } catch (error) {
                console.error("Error regenerating cover:", error);
                alert("Failed to generate new cover.");
            } finally {
                set({isLoadingCover: false});
            }
        },
      },
    }),
    {
      name: 'virtual-library-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist the core data, not the UI state
      partialize: (state) => ({ books: state.books, bookcases: state.bookcases }),
      // Re-add actions after rehydration
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as object),
        actions: currentState.actions,
      }),
    }
  )
);

// Custom hook to access actions without causing re-renders for state changes
export const useLibraryActions = () => useLibraryStore((state) => state.actions);
