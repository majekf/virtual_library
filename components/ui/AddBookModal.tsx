
import React, { useState } from 'react';
import { useLibraryStore } from '../../hooks/useLibraryStore';
import { XIcon } from './Icons';
import Spinner from './Spinner';

export default function AddBookModal() {
  const toggleAddBookModal = useLibraryStore((state) => state.toggleAddBookModal);
  const addBook = useLibraryStore((state) => state.addBook);
  const isLoadingCover = useLibraryStore(state => state.isLoadingCover);
  
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState<File | undefined>();
  const [coverPreview, setCoverPreview] = useState<string | undefined>();

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && author) {
      addBook({ title, author, description, coverUrl: '' }, coverFile);
    }
  };
  
  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg shadow-2xl p-8 w-full max-w-md m-4 relative animate-fade-in">
        <button onClick={() => toggleAddBookModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <XIcon />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-amber-300">Add a New Book</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500" />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-300">Author</label>
            <input type="text" id="author" value={author} onChange={e => setAuthor(e.target.value)} required className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Cover Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover preview" className="mx-auto h-24 w-auto" />
                ) : (
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                )}
                <div className="flex text-sm text-gray-500">
                  <label htmlFor="cover-upload" className="relative cursor-pointer bg-slate-700 rounded-md font-medium text-amber-400 hover:text-amber-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-800 focus-within:ring-amber-500 px-2">
                    <span>Upload a file</span>
                    <input id="cover-upload" name="cover-upload" type="file" className="sr-only" onChange={handleCoverChange} accept="image/*" />
                  </label>
                  <p className="pl-1">or leave blank to generate one</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
          <div className="pt-2">
            <button type="submit" disabled={isLoadingCover} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-slate-900 bg-amber-400 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-amber-500 disabled:bg-gray-500 disabled:cursor-not-allowed">
              {isLoadingCover ? <><Spinner /> Generating Cover...</> : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
