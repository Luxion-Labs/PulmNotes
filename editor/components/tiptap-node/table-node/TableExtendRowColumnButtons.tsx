"use client"

import React from "react"
import type { Editor } from "@tiptap/react"
import "./table-extend-row-column-button.scss"

interface Props {
  editor: Editor | null
}

export const TableExtendRowColumnButtons: React.FC<Props> = ({ editor }) => {
  if (!editor) return null

  const addRow = () => editor.chain().focus().addRowAfter().run()
  const addCol = () => editor.chain().focus().addColumnAfter().run()

  return (
    <div className="table-extend-buttons">
      <button onClick={addRow} aria-label="Add row">Add row</button>
      <button onClick={addCol} aria-label="Add column">Add column</button>
    </div>
  )
}

export default TableExtendRowColumnButtons