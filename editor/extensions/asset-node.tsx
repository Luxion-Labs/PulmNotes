import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { AssetNodeView } from './asset-node-view'

/**
 * Custom TipTap Node for assets (images, videos, audio)
 * Stores: { assetId, type, alt, title }
 * Renders via NodeView for proper media display
 */
export const AssetNode = Node.create({
  name: 'asset',
  group: 'block',
  draggable: true,
  selectable: true,
  
  addAttributes() {
    return {
      assetId: {
        default: null,
        parseHTML: element => element.getAttribute('data-asset-id'),
        renderHTML: attributes => ({
          'data-asset-id': attributes.assetId,
        }),
      },
      type: {
        default: 'image', // 'image' | 'video' | 'audio'
        parseHTML: element => element.getAttribute('data-type'),
        renderHTML: attributes => ({
          'data-type': attributes.type,
        }),
      },
      alt: {
        default: '',
        parseHTML: element => element.getAttribute('data-alt'),
        renderHTML: attributes => ({
          'data-alt': attributes.alt || '',
        }),
      },
      title: {
        default: '',
        parseHTML: element => element.getAttribute('data-title'),
        renderHTML: attributes => ({
          'data-title': attributes.title || '',
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'asset-node',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['asset-node', HTMLAttributes, 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(AssetNodeView)
  },
})

/**
 * Helper to insert an asset node
 */
export function insertAssetNode(
  editor: any,
  assetId: string,
  type: 'image' | 'video' | 'audio',
  alt?: string,
  title?: string
) {
  if (!editor) return false
  try {
    return editor
      .chain()
      .focus()
      .insertContent({
        type: 'asset',
        attrs: {
          assetId,
          type,
          alt: alt || '',
          title: title || '',
        },
      })
      .run()
  } catch (err) {
    console.error('[AssetNode] insertAssetNode error', err)
    return false
  }
}
