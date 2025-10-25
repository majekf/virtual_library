
import React, { useState, useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import type { Book } from '../types';
import { useLibraryActions } from '../hooks/useLibraryStore';
import * as THREE from 'three';

interface BookProps {
  book: Book;
  position: [number, number, number];
}

const BOOK_DIMENSIONS = {
  width: 0.04,
  height: 0.28,
  depth: 0.2,
};

// FIX: Changed to a const with React.FC to fix the 'key' prop type error.
const BookComponent: React.FC<BookProps> = ({ book, position }) => {
  const [hovered, setHovered] = useState(false);
  const { selectBook } = useLibraryActions();

  const texture = useTexture(book.coverUrl);

  const materials = useMemo(() => {
    const spineMaterial = new THREE.MeshStandardMaterial({ color: '#333333' });
    const pageMaterial = new THREE.MeshStandardMaterial({ color: '#f0ead6' });
    const coverMaterial = new THREE.MeshStandardMaterial({ map: texture });

    // order: right, left, top, bottom, front, back
    return [
      spineMaterial, // right side (spine)
      spineMaterial, // left side
      pageMaterial, // top
      pageMaterial, // bottom
      coverMaterial, // front
      spineMaterial, // back
    ];
  }, [texture]);
  
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
      material={materials}
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[BOOK_DIMENSIONS.width, BOOK_DIMENSIONS.height, BOOK_DIMENSIONS.depth]} />
    </mesh>
  );
}

export default BookComponent;
