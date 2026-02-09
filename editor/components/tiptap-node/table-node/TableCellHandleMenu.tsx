"use client"

import React from "react"
import type { Editor } from "@tiptap/react"
import "./table-cell-handle-menu.scss"

interface Props {
  editor: Editor | null
  onMouseDown?: (e: React.MouseEvent) => void
}

export const TableCellHandleMenu: React.FC<Props> = ({ editor, onMouseDown }) => {
  if (!editor) return null

  const align = (type: 'textAlign' | 'verticalAlign', value: string) => {
    // using setCellAttribute from table node commands
    try {
      editor.chain().focus().setCellAttribute(type === 'textAlign' ? 'align' : 'valign', value).run()
    } catch (err) {
      // fallback: set attribute manually on selection
      console.error('align failed', err)
    }
  }

  const merge = () => editor.chain().focus().mergeCells().run()
  const split = () => editor.chain().focus().splitCell().run()

  return (
    <div className="table-cell-handle-menu" onMouseDown={onMouseDown}>
      <div className="group">
        <button onClick={() => align('textAlign', 'left')}>Left</button>
        <button onClick={() => align('textAlign', 'center')}>Center</button>
        <button onClick={() => align('textAlign', 'right')}>Right</button>
      </div>
      <div className="group">
        <button onClick={merge}>Merge</button>
        <button onClick={split}>Split</button>
      </div>
    </div>
  )
}

export default TableCellHandleMenu