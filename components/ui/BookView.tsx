
import React from 'react';
import { useLibraryStore, useLibraryActions } from '../../hooks/useLibraryStore';
import { XIcon } from './Icons';

export default function BookView() {
  const { selectedBookId, books } = useLibraryStore((state) => ({
    selectedBookId: state.selectedBookId,
    books: state.books,
  }));
  const { toggleBookView } = useLibraryActions();

  const book = books.find((b) => b.id === selectedBookId);

  if (!book) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={() => toggleBookView(false)}>
      <div className="bg-stone-200 text-stone-800 p-12 rounded-lg shadow-2xl w-full max-w-3xl h-full max-h-[80vh] flex flex-col relative animate-fade-in" onClick={e => e.stopPropagation()}>
        <button onClick={() => toggleBookView(false)} className="absolute top-4 right-4 text-stone-500 hover:text-stone-800">
          <XIcon />
        </button>
        <div className="flex-grow overflow-y-auto pr-4" style={{ fontFamily: "'Times New Roman', serif" }}>
          <h1 className="text-4xl font-bold mb-2 text-center">{book.title}</h1>
          <h2 className="text-xl text-stone-600 mb-8 text-center">by {book.author}</h2>
          
          <div className="text-lg leading-relaxed space-y-4 whitespace-pre-wrap">
            <p>{book.description || "This book has no description."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
