
import React, { useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';

import Scene from './components/Scene';
import HUD from './components/ui/HUD';
import AddBookModal from './components/ui/AddBookModal';
import BookDetailPanel from './components/ui/BookDetailPanel';
import BookView from './components/ui/BookView';
// FIX: Import `useLibraryActions` to correctly access store actions.
import { useLibraryStore, useLibraryActions } from './hooks/useLibraryStore';

export default function App() {
  // FIX: `loadLibrary` is an action and must be retrieved via `useLibraryActions`, not from the main store state.
  const {
    isAddBookModalOpen,
    isBookDetailOpen,
    isBookViewOpen,
  } = useLibraryStore();
  const { loadLibrary } = useLibraryActions();

  useEffect(() => {
    loadLibrary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-full bg-gray-900 text-white">
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-zinc-900"><p>Loading 3D Scene...</p></div>}>
        <Canvas shadows camera={{ position: [0, 1.6, 5], fov: 60 }}>
          <Scene />
          <Preload all />
        </Canvas>
      </Suspense>
      
      <HUD />

      {isAddBookModalOpen && <AddBookModal />}
      {isBookDetailOpen && <BookDetailPanel />}
      {isBookViewOpen && <BookView />}
    </div>
  );
}
