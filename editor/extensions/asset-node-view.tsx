import React from 'react'
import { NodeViewWrapper, NodeViewContent, ReactNodeViewProps } from '@tiptap/react'

interface AssetNodeViewProps extends ReactNodeViewProps {
  node: any
  selected: boolean
  updateAttributes: (attrs: any) => void
  deleteNode: () => void
}

/**
 * NodeView for rendering asset nodes (images, videos, audio)
 * Displays media with proper controls and selection state
 */
export const AssetNodeView: React.FC<AssetNodeViewProps> = ({
  node,
  selected,
  updateAttributes,
  deleteNode
}) => {
  const { assetId, type, alt, title } = node.attrs

  // Construct asset URL (adjust path based on your asset storage)
  const assetUrl = `/assets/${assetId}`

  return (
    <NodeViewWrapper
      className={`asset-node-view ${selected ? 'selected' : ''}`}
      draggable
    >
      <div className={`relative inline-block ${selected ? 'ring-2 ring-blue-500' : ''}`}>
        {type === 'image' && (
          <img
            src={assetUrl}
            alt={alt || 'Asset'}
            title={title || ''}
            className="max-w-full rounded-lg shadow-md"
            onError={(e) => {
              const img = e.target as HTMLImageElement
              img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ccc" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-family="sans-serif" font-size="14"%3EImage not found%3C/text%3E%3C/svg%3E'
            }}
          />
        )}

        {type === 'video' && (
          <video
            src={assetUrl}
            controls
            className="max-w-full rounded-lg shadow-md"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        )}

        {type === 'audio' && (
          <audio
            src={assetUrl}
            controls
            className="w-full rounded-lg shadow-md"
            style={{ width: '100%' }}
          />
        )}

        {selected && (
          <div className="absolute top-0 right-0 flex gap-2 p-2">
            <button
              onClick={() => deleteNode()}
              className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
              title="Delete asset"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  )
}
