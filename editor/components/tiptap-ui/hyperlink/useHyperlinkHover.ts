"use client"

import { useState, useRef } from "react"

export interface HoveredLinkData {
  url: string
  x: number
  y: number
}

export function useHyperlinkHover() {
  const [hoveredLink, setHoveredLink] = useState<HoveredLinkData | null>(null)
  const [isPopoverHovered, setIsPopoverHovered] = useState(false)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleLinkMouseOver = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (target.tagName === "A") {
      // Clear any pending hide timeout
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = null
      }
      const href = (target as HTMLAnchorElement).href
      const rect = (target as HTMLElement).getBoundingClientRect()
      if (href) {
        setHoveredLink({
          url: href,
          x: rect.left + window.scrollX,
          y: rect.bottom + window.scrollY + 8,
        })
      }
    }
  }

  const handleLinkMouseOut = () => {
    // Only hide if popover is not being hovered, with a delay
    if (!isPopoverHovered) {
      hideTimeoutRef.current = setTimeout(() => {
        setHoveredLink(null)
        hideTimeoutRef.current = null
      }, 150) // 150ms delay allows moving to popover
    }
  }

  const handlePopoverMouseEnter = () => {
    // Clear any pending hide timeout when entering popover
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    setIsPopoverHovered(true)
  }

  const handlePopoverMouseLeave = () => {
    setIsPopoverHovered(false)
    setHoveredLink(null)
  }

  return {
    hoveredLink,
    setHoveredLink,
    isPopoverHovered,
    setIsPopoverHovered,
    handleLinkMouseOver,
    handleLinkMouseOut,
    handlePopoverMouseEnter,
    handlePopoverMouseLeave,
  }
}
