
import React from 'react';
import { useLibraryStore } from '../../hooks/useLibraryStore';
import { BookOpenIcon, MoveIcon, TrashIcon, XIcon, SparklesIcon } from './Icons';
import Spinner from './Spinner';

export default function BookDetailPanel() {
  const { selectedBookId, books, movingBookId, isLoadingCover } = useLibraryStore((state) => ({
    selectedBookId: state.selectedBookId,
    books: state.books,
    movingBookId: state.movingBookId,
    isLoadingCover: state.isLoadingCover
  }));
  
  const toggleBookDetail = useLibraryStore((state) => state.toggleBookDetail);
  const toggleBookView = useLibraryStore((state) => state.toggleBookView);
  const deleteBook = useLibraryStore((state) => state.deleteBook);
  const setMovingBookId = useLibraryStore((state) => state.setMovingBookId);
  const generateCoverForBook = useLibraryStore((state) => state.generateCoverForBook);

  const book = books.find((b) => b.id === selectedBookId);

  if (!book) return null;

  const isMoving = movingBookId === book.id;

  return (
    <div className="absolute top-0 right-0 h-full w-full max-w-sm bg-slate-800 bg-opacity-90 backdrop-blur-sm shadow-2xl z-40 p-6 flex flex-col animate-slide-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-amber-300 truncate pr-4">{book.title}</h2>
        <button onClick={() => toggleBookDetail(false)} className="text-gray-400 hover:text-white">
          <XIcon />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto">
        <div className="relative mb-4">
            <img src={book.coverUrl} alt={`Cover of ${book.title}`} className="w-full h-auto object-contain rounded-lg shadow-lg" style={{maxHeight: '400px'}} />
            {book.coverGenerated && (
                <button 
                    disabled={isLoadingCover}
                    onClick={() => generateCoverForBook(book.id)}
                    className="absolute bottom-2 right-2 flex items-center bg-slate-900 bg-opacity-70 text-white py-1 px-3 rounded-full text-sm hover:bg-opacity-90 disabled:bg-opacity-50"
                >
                    {isLoadingCover ? <Spinner /> : <SparklesIcon />}
                    <span className="ml-1">Regenerate</span>
                </button>
            )}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-200">{book.author}</h3>
        
        <p className="text-gray-400 mt-4 text-sm leading-relaxed">{book.description || "No description available."}</p>
      </div>

      {isMoving && (
        <div className="mt-auto p-4 bg-green-900 text-green-200 rounded-md text-center">
            <p className="font-bold">Move Mode Activated</p>
            <p className="text-sm">Click an empty slot on a shelf to move this book.</p>
            <button onClick={() => setMovingBookId(null)} className="mt-2 text-xs underline">Cancel Move</button>
        </div>
      )}

      <div className="mt-auto pt-6 border-t border-slate-700 grid grid-cols-3 gap-4">
        <button onClick={() => toggleBookView(true)} className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors">
          <BookOpenIcon />
          <span className="text-xs mt-1">Open</span>
        </button>
        <button onClick={() => setMovingBookId(isMoving ? null : book.id)} className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${isMoving ? 'bg-green-600 hover:bg-green-500' : 'bg-slate-700 hover:bg-slate-600'}`}>
          <MoveIcon />
          <span className="text-xs mt-1">{isMoving ? 'Cancel' : 'Move'}</span>
        </button>
        <button onClick={() => { if(confirm('Are you sure you want to delete this book?')) deleteBook(book.id); }} className="flex flex-col items-center justify-center p-2 rounded-lg bg-red-800 hover:bg-red-700 transition-colors text-red-100">
          <TrashIcon />
          <span className="text-xs mt-1">Delete</span>
        </button>
      </div>
    </div>
  );
}
