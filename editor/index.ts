// Active exports only (legacy Editor and Block removed)
export { generateId } from './core/utils';
export { TipTapNoteEditor } from './ui/tiptapEditor';
export { SimpleEditor } from './components/tiptap-templates/simple/simple-editor';
export { convertBlocksToTipTap, convertTipTapToBlocks } from './lib/converters';
export type { 
  Block as BlockType, 
  BlockType as BlockTypeEnum, 
  Note, 
  MenuItem, 
  Coordinates 
} from './schema/types';
