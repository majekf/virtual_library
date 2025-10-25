
import React, { useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';

import Scene from './components/Scene';
import HUD from './components/ui/HUD';
import AddBookModal from './components/ui/AddBookModal';
import BookDetailPanel from './components/ui/BookDetailPanel';
import BookView from './components/ui/BookView';
import { useLibraryStore } from './hooks/useLibraryStore';

export default function App() {
  const isAddBookModalOpen = useLibraryStore((state) => state.isAddBookModalOpen);
  const isBookDetailOpen = useLibraryStore((state) => state.isBookDetailOpen);
  const isBookViewOpen = useLibraryStore((state) => state.isBookViewOpen);
  const loadLibrary = useLibraryStore((state) => state.loadLibrary);

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
