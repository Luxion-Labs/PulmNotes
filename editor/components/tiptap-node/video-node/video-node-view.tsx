import { NodeViewWrapper } from '@tiptap/react'
import './video-node-view.scss'

interface VideoNodeViewProps {
  node: any
  updateAttributes: (attrs: Record<string, any>) => void
  deleteNode: () => void
  selected: boolean
}

export function VideoNodeView({ node, updateAttributes, deleteNode, selected }: VideoNodeViewProps) {
  return (
    <NodeViewWrapper className={`video-node-wrapper ${selected ? 'selected' : ''}`}>
      <div className="video-node-container">
        <video
          src={node.attrs.src}
          controls={node.attrs.controls}
          className="video-node-element"
        />
        {selected && (
          <div className="video-node-toolbar">
            <button
              onClick={deleteNode}
              className="delete-button"
              title="Delete video"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  )
}
