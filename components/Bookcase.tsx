// FIX: Changed React import to `import * as React from 'react'` to correctly resolve types for react-three-fiber JSX elements.
import * as React from 'react';
import { Box } from '@react-three/drei';
import type { Book, Bookcase } from '../types';
import BookComponent from './Book';
import { useLibraryStore } from '../hooks/useLibraryStore';

interface BookcaseProps {
  bookcase: Bookcase;
  books: Book[];
}

const BOOKCASE_WIDTH = 2;
const BOOKCASE_HEIGHT = 2.2;
const BOOKCASE_DEPTH = 0.3;
const WOOD_COLOR = '#6F4E37';

const Slot: React.FC<{ position: [number, number, number]; bookcaseId: string; shelfIndex: number; slotIndex: number; isMoving: boolean;}> = ({ position, bookcaseId, shelfIndex, slotIndex, isMoving }) => {
    const updateBookPosition = useLibraryStore((state) => state.updateBookPosition);
    const movingBookId = useLibraryStore((state) => state.movingBookId);

    const handleMoveClick = () => {
        if (movingBookId) {
            updateBookPosition(movingBookId, { bookcaseId, shelfIndex, slotIndex });
        }
    };

    if (!isMoving) return null;

    return (
        <Box args={[0.05, 0.28, 0.2]} position={position} onClick={handleMoveClick}>
            <meshBasicMaterial color="green" transparent opacity={0.5} />
        </Box>
    );
};

const BookcaseComponent: React.FC<BookcaseProps> = ({ bookcase, books }) => {
  const movingBookId = useLibraryStore((state) => state.movingBookId);
  const isMoving = !!movingBookId;

  const shelfHeight = (BOOKCASE_HEIGHT - 0.2) / bookcase.shelves;

  return (
    <group position={bookcase.position} rotation-y={bookcase.rotationY}>
      {/* Frame */}
      <Box args={[BOOKCASE_WIDTH, BOOKCASE_HEIGHT, BOOKCASE_DEPTH]} castShadow>
        <meshStandardMaterial color={WOOD_COLOR} />
      </Box>
      <Box args={[BOOKCASE_WIDTH - 0.1, BOOKCASE_HEIGHT - 0.1, BOOKCASE_DEPTH - 0.05]} position={[0, 0, -0.025]}>
        <meshStandardMaterial color="#fdf5e6" />
      </Box>

      {/* Shelves */}
      {Array.from({ length: bookcase.shelves }).map((_, i) => (
        <Box
          key={`shelf-${i}`}
          args={[BOOKCASE_WIDTH - 0.1, 0.02, BOOKCASE_DEPTH - 0.1]}
          position={[0, (i + 0.5) * shelfHeight - BOOKCASE_HEIGHT / 2 + 0.05, 0.02]}
        >
          <meshStandardMaterial color={WOOD_COLOR} />
        </Box>
      ))}

      {/* Books and Slots */}
      {Array.from({ length: bookcase.shelves }).map((_, shelfIndex) =>
        Array.from({ length: bookcase.slotsPerShelf }).map((_, slotIndex) => {
          const book = books.find(
            (b) =>
              b.position.shelfIndex === shelfIndex &&
              b.position.slotIndex === slotIndex
          );

          const slotWidth = (BOOKCASE_WIDTH - 0.2) / bookcase.slotsPerShelf;
          const x = (slotIndex + 0.5) * slotWidth - (BOOKCASE_WIDTH - 0.2) / 2;
          const y = (shelfIndex + 0.5) * shelfHeight - BOOKCASE_HEIGHT / 2 + 0.18;
          const z = 0;

          if (book) {
            return <BookComponent key={book.id} book={book} position={[x, y, z]} />;
          } else {
            return <Slot key={`slot-${shelfIndex}-${slotIndex}`} position={[x, y, z]} bookcaseId={bookcase.id} shelfIndex={shelfIndex} slotIndex={slotIndex} isMoving={isMoving} />;
          }
        })
      )}
    </group>
  );
}

// Memoize to prevent re-renders when other parts of the scene change
const MemoizedBookcase = React.memo(BookcaseComponent);
export default MemoizedBookcase;