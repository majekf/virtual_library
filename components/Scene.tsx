
// FIX: Changed React import to `import * as React from 'react'` to correctly resolve types for react-three-fiber JSX elements.
import * as React from 'react';
import { OrbitControls, Environment } from '@react-three/drei';
import { useLibraryStore } from '../hooks/useLibraryStore';
import Room from './Room';
import BookcaseComponent from './Bookcase';
import type { Book } from '../types';

export default function Scene() {
  const bookcases = useLibraryStore((state) => state.bookcases);
  const books = useLibraryStore((state) => state.books);

  const booksByBookcase = React.useMemo(() => {
    const map = new Map<string, Book[]>();
    books.forEach(book => {
      const { bookcaseId } = book.position;
      if (!map.has(bookcaseId)) {
        map.set(bookcaseId, []);
      }
      map.get(bookcaseId)!.push(book);
    });
    return map;
  }, [books]);

  return (
    <>
      <OrbitControls
        makeDefault
        minDistance={1}
        maxDistance={10}
        maxPolarAngle={Math.PI / 2}
        enablePan={false}
      />
      <Environment preset="city" />

      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <Room />

      {bookcases.map((bookcase) => (
        <BookcaseComponent
          key={bookcase.id}
          bookcase={bookcase}
          books={booksByBookcase.get(bookcase.id) || []}
        />
      ))}
    </>
  );
}
