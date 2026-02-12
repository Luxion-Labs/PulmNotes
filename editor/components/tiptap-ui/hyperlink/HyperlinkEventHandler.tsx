"use client"

import { useEffect, useContext } from "react"
import { HyperlinkContext } from "./HyperlinkContext"
import { openExternal } from "@/app/lib/openExternal"

/**
 * Global event listener component that handles hyperlink hover events
 * This component attaches event listeners to the document to detect link hovers
 */
export function HyperlinkEventHandler() {
  const context = useContext(HyperlinkContext)

  useEffect(() => {
    if (!context) return // Context not available yet

    const { handleLinkMouseOver, handleLinkMouseOut } = context

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
          event.preventDefault()
          openExternal(href)
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
  }, [context])

  return null // This component doesn't render anything
}