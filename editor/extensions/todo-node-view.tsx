import React, { useState } from 'react'
import { NodeViewWrapper, NodeViewContent, ReactNodeViewProps } from '@tiptap/react'

interface TodoNodeViewProps extends ReactNodeViewProps {
  node: any
  updateAttributes: (attrs: any) => void
}

/**
 * NodeView for rendering todo items with interactive checkboxes
 * Handles checkbox state and persists to node attributes
 */
export const TodoNodeView: React.FC<TodoNodeViewProps> = ({
  node,
  updateAttributes,
}) => {
  const { checked } = node.attrs
  const [isChecked, setIsChecked] = useState(checked || false)

  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked
    setIsChecked(newChecked)
    updateAttributes({ checked: newChecked })
  }

  return (
    <NodeViewWrapper className="custom-todo-item" as="div">
      <div className="flex items-start gap-2 py-1">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckChange}
          className="w-4 h-4 mt-1 rounded border-gray-300 text-blue-600 cursor-pointer"
        />
        <div className={`flex-1 ${isChecked ? 'line-through text-gray-500' : ''}`}>
          <NodeViewContent />
        </div>
      </div>
    </NodeViewWrapper>
  )
}
