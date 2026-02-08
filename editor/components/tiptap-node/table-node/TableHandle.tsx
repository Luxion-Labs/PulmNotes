"use client"

import React, { useEffect, useState } from "react"
import type { Editor } from "@tiptap/react"
import "./table-handle.scss"

interface Props {
  editor: Editor | null
}

export const TableHandle: React.FC<Props> = ({ editor }) => {
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
    left: `${rect.left + window.scrollX - 48}px`,
    top: `${rect.top + window.scrollY}px`,
    zIndex: 9998,
  }

  const addRow = () => editor?.chain().focus().addRowAfter().run()
  const deleteRow = () => editor?.chain().focus().deleteRow().run()
  const addCol = () => editor?.chain().focus().addColumnAfter().run()
  const deleteCol = () => editor?.chain().focus().deleteColumn().run()

  return (
    <div className="table-handle" style={style}>
      <button title="Add row" onClick={addRow}>＋row</button>
      <button title="Delete row" onClick={deleteRow}>−row</button>
      <button title="Add column" onClick={addCol}>＋col</button>
      <button title="Delete column" onClick={deleteCol}>−col</button>
    </div>
  )
}

function findTableNode(state: any, $pos: any) {
  // Walk up to find table parent
  for (let depth = $pos.depth; depth > 0; depth--) {
    const node = $pos.node(depth)
    if (!node) continue
    if (node.type && node.type.name === "table") {
      // return { node, pos: $pos.before(depth) }
      return { node, pos: $pos.before(depth) }
    }
  }
  return null
}

export default TableHandle