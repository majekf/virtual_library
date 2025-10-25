// FIX: Changed React import to `import * as React from 'react'` to correctly resolve types for react-three-fiber JSX elements.
import * as React from 'react';
import { useTexture } from '@react-three/drei';
import type { Book } from '../types';
import { useLibraryStore } from '../hooks/useLibraryStore';

interface BookProps {
  book: Book;
  position: [number, number, number];
}

const BOOK_DIMENSIONS = {
  width: 0.04,
  height: 0.28,
  depth: 0.2,
};

// A transparent 1x1 pixel PNG as a fallback to prevent crashes
const FALLBACK_COVER_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const BookComponent: React.FC<BookProps> = ({ book, position }) => {
  const [hovered, setHovered] = React.useState(false);
  const selectBook = useLibraryStore((state) => state.selectBook);

  const texture = useTexture(book.coverUrl || FALLBACK_COVER_URL);
  
  const handleClick = (e: any) => {
    e.stopPropagation();
    selectBook(book.id);
  };

  const scale = hovered ? 1.05 : 1;

  return (
    <mesh
      castShadow
      receiveShadow
      position={position}
      scale={scale}
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[BOOK_DIMENSIONS.width, BOOK_DIMENSIONS.height, BOOK_DIMENSIONS.depth]} />
      {/* Material order: right, left, top, bottom, front, back */}
      <meshStandardMaterial attach="material-0" color="#333333" /> {/* Right side (spine) */}
      <meshStandardMaterial attach="material-1" color="#f0ead6" /> {/* Left side (pages) */}
      <meshStandardMaterial attach="material-2" color="#f0ead6" /> {/* Top side (pages) */}
      <meshStandardMaterial attach="material-3" color="#f0ead6" /> {/* Bottom side (pages) */}
      <meshStandardMaterial attach="material-4" map={texture} />   {/* Front side (cover) */}
      <meshStandardMaterial attach="material-5" color="#333333" /> {/* Back side */}
    </mesh>
  );
}

export default BookComponent;