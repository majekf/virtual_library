
import React, { useRef } from 'react';
import { useLibraryActions } from '../../hooks/useLibraryStore';
import { PlusIcon, BookOpenIcon, ChevronsLeftRightIcon, DownloadIcon, UploadIcon } from './Icons';

const HUDButton: React.FC<{ onClick: () => void; children: React.ReactNode; tooltip: string }> = ({ onClick, children, tooltip }) => (
  <button
    onClick={onClick}
    className="relative group bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400"
  >
    {children}
    <span className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
      {tooltip}
    </span>
  </button>
);


export default function HUD() {
  const { toggleAddBookModal, addBookcase, exportLibrary, importLibrary } = useLibraryActions();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importLibrary(file);
    }
  };

  return (
    <>
      <div className="absolute top-4 left-4 flex flex-col items-start space-y-3">
         <h1 className="text-2xl font-bold text-white drop-shadow-lg">Virtual Cozy Library</h1>
         <p className="text-sm text-gray-300 drop-shadow-md max-w-xs">Orbit with mouse. Click a book to view details.</p>
      </div>

      <div className="absolute bottom-4 right-4 flex items-center space-x-3">
        <HUDButton onClick={addBookcase} tooltip="Add New Bookcase">
          <ChevronsLeftRightIcon />
        </HUDButton>
        <HUDButton onClick={() => toggleAddBookModal(true)} tooltip="Add New Book">
          <PlusIcon />
        </HUDButton>
        
        <div className="relative group">
            <button className="bg-slate-700 p-3 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400">
                <BookOpenIcon />
            </button>
            <div className="absolute bottom-full right-0 mb-2 w-max p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex flex-col space-y-2">
                <button onClick={exportLibrary} className="flex items-center space-x-2 hover:text-amber-300">
                    <DownloadIcon /><span>Export Library</span>
                </button>
                <button onClick={handleImportClick} className="flex items-center space-x-2 hover:text-amber-300">
                    <UploadIcon /><span>Import Library</span>
                </button>
            </div>
        </div>

        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </>
  );
}
