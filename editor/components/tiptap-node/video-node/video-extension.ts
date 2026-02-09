import { Youtube } from '@tiptap/extension-youtube'

/**
 * Get the configured YouTube extension
 */
export function getVideoExtension() {
  return Youtube.configure({
    width: 640,
    height: 480,
    controls: true,
    nocookie: false,
    allowFullscreen: true,
    autoplay: false,
  })
}
