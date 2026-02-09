"use client"

import { useEffect } from "react"
import { useHyperlinkContext } from "./HyperlinkContext"

/**
 * Global event listener component that handles hyperlink hover events
 * This component attaches event listeners to the document to detect link hovers
 */
export function HyperlinkEventHandler() {
  const { handleLinkMouseOver, handleLinkMouseOut } = useHyperlinkContext()

  useEffect(() => {
    const handleMouseOver = (event: MouseEvent) => {
      handleLinkMouseOver(event)
    }

    const handleMouseOut = (event: MouseEvent) => {
      handleLinkMouseOut()
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (target.tagName === "A") {
        const href = (target as HTMLAnchorElement).href
        if (href) {
          window.open(href, "_blank", "noopener,noreferrer")
          event.preventDefault()
          return
        }
      }
    }

    document.addEventListener("mouseover", handleMouseOver)
    document.addEventListener("mouseout", handleMouseOut)
    document.addEventListener("click", handleClick, true) // Use capture phase

    return () => {
      document.removeEventListener("mouseover", handleMouseOver)
      document.removeEventListener("mouseout", handleMouseOut)
      document.removeEventListener("click", handleClick, true)
    }
  }, [handleLinkMouseOver, handleLinkMouseOut])

  return null // This component doesn't render anything
}