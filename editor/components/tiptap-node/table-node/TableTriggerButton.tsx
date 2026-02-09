"use client"

import React, { useState } from "react"
import type { Editor } from "@tiptap/react"
import "./table-trigger-button.scss"

export interface TableTriggerButtonProps {
  editor?: Editor | null
  maxRows?: number
  maxCols?: number
  text?: string
  onInserted?: (rows: number, cols: number) => void
}

export const TableTriggerButton: React.FC<TableTriggerButtonProps> = ({
  editor = null,
  maxRows = 8,
  maxCols = 8,
  text = "Table",
  onInserted,
}) => {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<{ r: number; c: number }>({ r: 0, c: 0 })

  const canInsert = !!editor && editor.can().insertContent({ type: "table" })

  const handleCellHover = (r: number, c: number) => setHovered({ r, c })

  const handleCellClick = (r: number, c: number) => {
    if (!editor) return
    try {
      editor.chain().focus().insertTable({ rows: r, cols: c }).run()
      onInserted?.(r, c)
    } catch (err) {
      console.error('Insert table failed', err)
    } finally {
      setOpen(false)
    }
  }

  return (
    <div className="table-trigger">
      <button
        className="table-trigger-button"
        onClick={() => setOpen((v) => !v)}
        disabled={!canInsert}
        aria-expanded={open}
      >
        {text}
      </button>

      {open && (
        <div className="table-grid" role="dialog" aria-label="Insert table">
          {Array.from({ length: maxRows }).map((_, r) => (
            <div className="table-grid-row" key={r}>
              {Array.from({ length: maxCols }).map((_, c) => {
                const rr = r + 1
                const cc = c + 1
                const active = rr <= hovered.r && cc <= hovered.c
                return (
                  <button
                    key={c}
                    className={`table-grid-cell ${active ? 'active' : ''}`}
                    onMouseEnter={() => handleCellHover(rr, cc)}
                    onClick={() => handleCellClick(rr, cc)}
                    aria-label={`Insert ${rr} by ${cc} table`}
                  >
                    {rr <= hovered.r && cc <= hovered.c ? '●' : ''}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TableTriggerButton