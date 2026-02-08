"use client"

import React, { useEffect, useState } from "react"
import type { Editor } from "@tiptap/react"
import "./table-selection-overlay.scss"

interface Props {
  editor: Editor | null
  showResizeHandles?: boolean
}

export const TableSelectionOverlay: React.FC<Props> = ({ editor, showResizeHandles = true }) => {
  const [rect, setRect] = useState<DOMRect | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!editor) return

    const update = () => {
      try {
        const { state, view } = editor
        const { selection } = state
        const $from = selection.$from
        const table = findTableNode(state, $from)
        if (table) {
          const dom = view.nodeDOM(table.pos) as HTMLElement | null
          if (dom) {
            const r = dom.getBoundingClientRect()
            setRect(r)
            setVisible(true)
            return
          }
        }
      } catch (err) {
        // ignore
      }
      setVisible(false)
      setRect(null)
    }

    update()
    editor.on("selectionUpdate", update)
    editor.on("transaction", update)

    return () => {
      editor.off("selectionUpdate", update)
      editor.off("transaction", update)
    }
  }, [editor])

  if (!visible || !rect) return null

  const style: React.CSSProperties = {
    position: "absolute",
    left: `${rect.left + window.scrollX}px`,
    top: `${rect.top + window.scrollY}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    zIndex: 9997,
    pointerEvents: "none",
  }

  return (
    <div className="table-selection-overlay" style={style}>
      <div className="overlay-box" />
      {showResizeHandles && <div className="resize-handle br" />}
    </div>
  )
}

function findTableNode(state: any, $pos: any) {
  for (let depth = $pos.depth; depth > 0; depth--) {
    const node = $pos.node(depth)
    if (!node) continue
    if (node.type && node.type.name === "table") {
      return { node, pos: $pos.before(depth) }
    }
  }
  return null
}

export default TableSelectionOverlay