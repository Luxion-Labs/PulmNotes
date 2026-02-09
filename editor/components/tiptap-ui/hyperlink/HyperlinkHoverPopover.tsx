"use client"

import { useHyperlinkContext } from "./HyperlinkContext"

export interface HyperlinkHoverPopoverProps {
  onEdit: () => void
}

export function HyperlinkHoverPopover({ onEdit }: HyperlinkHoverPopoverProps) {
  const { hoveredLink, handlePopoverMouseEnter, handlePopoverMouseLeave } = useHyperlinkContext()

  if (!hoveredLink) return null

  return (
    <div
      className="fixed bg-stone-900 text-white rounded-md shadow-lg py-2 px-3 z-50 flex items-center gap-2"
      style={{
        left: `${hoveredLink.x}px`,
        top: `${hoveredLink.y}px`,
        transform: "translateX(-50%)",
        maxWidth: "300px",
      }}
      onMouseEnter={handlePopoverMouseEnter}
      onMouseLeave={handlePopoverMouseLeave}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-xs text-stone-400">🔗</span>
        <a
          href={hoveredLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-stone-200 truncate hover:text-white"
        >
          {hoveredLink.url}
        </a>
      </div>
      <button
        className="text-xs bg-stone-700 hover:bg-stone-600 px-2 py-1 rounded transition-colors flex-shrink-0"
        onClick={onEdit}
      >
        Edit
      </button>
    </div>
  )
}
