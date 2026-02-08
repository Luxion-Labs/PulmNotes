import Image from '@tiptap/extension-image'
import '@/components/tiptap-node/image-node/image-node.scss'
import { handleImageUpload } from '@/editor/lib/tiptap-utils'

// Configure the official Image extension with resize enabled and sane defaults
const ImageExtension = Image.configure({
  inline: false,
  allowBase64: true,
  HTMLAttributes: {
    class: 'tiptap-image',
  },
  resize: {
    enabled: true,
    directions: [
      'right',
      'top-right',
      'bottom-right',
    ],
    minWidth: 64,
    minHeight: 64,
    alwaysPreserveAspectRatio: true,
  },
})

// Convenience helper to insert an actual image node (renders immediately)
export function setImageNode(
  editor: any,
  src: string,
  opts?: { alt?: string; title?: string; width?: number; height?: number }
) {
  if (!editor) return false
  try {
    return editor
      .chain()
      .focus()
      .setImage({ src, alt: opts?.alt, title: opts?.title, width: opts?.width, height: opts?.height })
      .run()
  } catch (err) {
    console.error('[ImageExtension] setImageNode error', err)
    return false
  }
}

/**
 * Insert the image upload node (the upload UI placeholder).
 * Uses the node command `setImageUploadNode` when available, otherwise falls back
 * to inserting raw `imageUpload` node content.
 */
export function insertImageUpload(editor: any, options?: Record<string, any>) {
  if (!editor) return false
  try {
    if ((editor.commands as any).setImageUploadNode) {
      return (editor as any).chain().focus().setImageUploadNode(options).run()
    }

    return editor
      .chain()
      .focus()
      .insertContent({ type: 'imageUpload', attrs: options })
      .run()
  } catch (err) {
    console.error('[ImageExtension] insertImageUpload error', err)
    return false
  }
}

/**
 * Upload a File and insert the resulting image into the editor.
 * Returns true on success, false otherwise.
 */
export async function insertImageFromFile(
  editor: any,
  file: File,
  onProgress?: (progress: number) => void
) {
  if (!editor || !file) return false
  try {
    const url = await handleImageUpload(
      file,
      (e) => onProgress?.(e.progress)
    )
    if (!url) return false

    return setImageNode(editor, url, {
      alt: file.name.replace(/\.[^/.]+$/, '') || undefined,
      title: file.name,
    })
  } catch (err) {
    console.error('[ImageExtension] insertImageFromFile error', err)
    return false
  }
}

export default ImageExtension
