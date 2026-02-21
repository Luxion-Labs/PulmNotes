import React from 'react';
import { NOTE_CARD_GRID_CLASS } from './noteCardLayout';

interface NoteCardGridProps {
  children: React.ReactNode;
}

export const NoteCardGrid: React.FC<NoteCardGridProps> = ({ children }) => {
  return <div className={NOTE_CARD_GRID_CLASS}>{children}</div>;
};
