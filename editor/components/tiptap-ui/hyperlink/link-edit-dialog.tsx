"use client"

import { useState, useEffect } from "react"
import { type Editor } from "@tiptap/react"
import { TrashIcon } from "@/editor/components/tiptap-icons/trash-icon"

export interface LinkEditDialogProps {
  editor: Editor | null
  isOpen: boolean
  onClose: () => void
}

export function LinkEditDialog({ editor, isOpen, onClose }: LinkEditDialogProps) {
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")

  useEffect(() => {
    if (isOpen && editor) {
      const { href } = editor.getAttributes("link")
      setUrl(href || "")
      
      // Get the selected text as title
      const { from, to } = editor.state.selection
      const selectedText = editor.state.doc.textBetween(from, to)
      setTitle(selectedText || "")
    }
  }, [isOpen, editor])

  if (!isOpen) return null

  const handleSave = () => {
    if (!editor) return

    if (url && title) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .insertContent(title)
        .run()
    }
    onClose()
  }

  const handleRemove = () => {
    if (!editor) return

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .unsetLink()
      .run()

    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    }
    if (e.key === "Escape") {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
      <div className="bg-stone-800 text-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 space-y-4">
        {/* Title */}
        <h2 className="text-lg font-semibold text-stone-100">Edit Link</h2>

        {/* Page or URL */}
        <div>
          <label className="block text-sm font-medium text-stone-300 mb-2">
            Page or URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://www.example.com"
            className="w-full bg-stone-700 text-white rounded px-3 py-2 text-sm border border-stone-600 focus:border-stone-500 focus:outline-none transition-colors"
            autoFocus
          />
        </div>

        {/* Link Title */}
        <div>
          <label className="block text-sm font-medium text-stone-300 mb-2">
            Link title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Link text"
            className="w-full bg-stone-700 text-white rounded px-3 py-2 text-sm border border-stone-600 focus:border-stone-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Remove Link Button */}
        <button
          onClick={handleRemove}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-stone-300 hover:text-white bg-stone-700 hover:bg-red-900/50 rounded border border-stone-600 hover:border-red-600 transition-colors"
        >
          <TrashIcon width={16} height={16} />
          Remove link
        </button>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-stone-300 hover:text-white bg-stone-700 hover:bg-stone-600 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!url || !title}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-stone-600 disabled:text-stone-400 rounded transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
