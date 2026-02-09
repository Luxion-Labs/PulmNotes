"use client"

import { createContext, useContext, ReactNode } from "react"
import { useHyperlinkHover } from "./useHyperlinkHover"

interface HyperlinkContextType {
  hoveredLink: ReturnType<typeof useHyperlinkHover>["hoveredLink"]
  handleLinkMouseOver: ReturnType<typeof useHyperlinkHover>["handleLinkMouseOver"]
  handleLinkMouseOut: ReturnType<typeof useHyperlinkHover>["handleLinkMouseOut"]
  handlePopoverMouseEnter: ReturnType<typeof useHyperlinkHover>["handlePopoverMouseEnter"]
  handlePopoverMouseLeave: ReturnType<typeof useHyperlinkHover>["handlePopoverMouseLeave"]
}

const HyperlinkContext = createContext<HyperlinkContextType | null>(null)

export { HyperlinkContext }

export function HyperlinkProvider({ children }: { children: ReactNode }) {
  const hyperlinkState = useHyperlinkHover()

  return (
    <HyperlinkContext.Provider value={hyperlinkState}>
      {children}
    </HyperlinkContext.Provider>
  )
}

export function useHyperlinkContext() {
  const context = useContext(HyperlinkContext)
  if (!context) {
    throw new Error("useHyperlinkContext must be used within a HyperlinkProvider")
  }
  return context
}