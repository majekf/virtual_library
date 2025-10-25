
export interface BookPosition {
  bookcaseId: string;
  shelfIndex: number;
  slotIndex: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  coverGenerated: boolean;
  position: BookPosition;
  createdAt: string;
}

export interface Bookcase {
  id: string;
  position: [number, number, number];
  rotationY: number;
  shelves: number;
  slotsPerShelf: number;
}
