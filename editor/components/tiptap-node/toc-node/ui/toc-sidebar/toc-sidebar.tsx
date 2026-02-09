"use client"

import { useCallback, useMemo, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/tiptap-utils"
import { useToc } from "@/components/tiptap-node/toc-node/context/toc-context"
import type {
  TableOfContentData,
  TableOfContentDataItem,
} from "@tiptap/extension-table-of-contents"

import "./toc-sidebar.scss"

export interface TocSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The maximum number of headings to show in the TOC.
   * @default 20
   */
  maxShowCount?: number
  /**
   * Offset from the top of the editor container (in pixels).
   * @default 0
   */
  topOffset?: number
}

export function TocSidebar({
  className,
  maxShowCount = 20,
  topOffset = 0,
  ...props
}: TocSidebarProps) {
  const { tocContent, navigateToHeading, normalizeHeadingDepths } = useToc()
  const hasRestoredHashRef = useRef(false)

  // Track when a click happened so we can ignore scroll events
  // caused by our own programmatic scrolling for a short time.
  const lastClickTimeRef = useRef<number | null>(null)

  // Manual active id (from user clicks). This should override scroll-based
  // and selection-based active states while it's set.
  const [manualActiveId, setManualActiveId] = useState<string | null>(null)

  const headingList = useMemo<TableOfContentData>(
    () => tocContent ?? [],
    [tocContent]
  )

  const visibleHeadings = useMemo(
    () => headingList.slice(0, maxShowCount),
    [headingList, maxShowCount]
  )

  const normalizedDepths = useMemo(
    () => normalizeHeadingDepths(visibleHeadings),
    [visibleHeadings, normalizeHeadingDepths]
  )

  const depthById = useMemo(() => {
    const map = new Map<string, number>()
    visibleHeadings.forEach((h, index) => {
      map.set(h.id, normalizedDepths[index] ?? 1)
    })
    return map
  }, [visibleHeadings, normalizedDepths])

  // Scroll-based highlighted heading (using isActive)
  const highlightedHeading = useMemo<TableOfContentDataItem | null>(
    () => [...headingList].reverse().find((h) => h.isActive) ?? null,
    [headingList]
  )

  // Selection-based active heading (isActive)
  const selectionActiveId = useMemo(
    () => headingList.find((h) => h.isActive)?.id ?? null,
    [headingList]
  )

  // Decide which heading is "active" for UI purposes
  const activeContentId = useMemo(() => {
    // 1. User clicked something: manual always wins.
    if (manualActiveId) {
      return manualActiveId
    }

    // 2. Scroll-highlighted heading (extension scroll logic).
    if (highlightedHeading?.id) {
      return highlightedHeading.id
    }

    // 3. Selection-based active heading (cursor).
    if (selectionActiveId) {
      return selectionActiveId
    }

    // 4. Fallback to first heading.
    return headingList[0]?.id
  }, [manualActiveId, highlightedHeading, selectionActiveId, headingList])

  const handleContentClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, item: TableOfContentDataItem) => {
      e.preventDefault()
      e.stopPropagation()

      // Mark this heading as manually active
      setManualActiveId(item.id)
      lastClickTimeRef.current = Date.now()

      navigateToHeading(item, { topOffset })
    },
    [navigateToHeading, topOffset]
  )

  /**
   * Restore scroll position from URL hash on initial load
   */
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      hasRestoredHashRef.current ||
      !headingList.length
    ) {
      return
    }

    const hash = window.location.hash.replace(/^#/, "")
    if (!hash) return

    const target = headingList.find((h) => h.id === hash)
    if (target?.dom) {
      navigateToHeading(target, { topOffset, behavior: "auto" })
      hasRestoredHashRef.current = true
    }
  }, [headingList, navigateToHeading, topOffset])

  /**
   * Clear manual active id when the user actually scrolls
   * (but ignore the scroll events that immediately follow our own
   * programmatic scroll from a click).
   */
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleScroll = () => {
      const now = Date.now()
      const lastClickTime = lastClickTimeRef.current

      // Ignore scroll events within 500ms of a click
      if (lastClickTime && now - lastClickTime < 500) {
        return
      }

      // User is scrolling manually now; go back to scroll-based logic.
      if (manualActiveId !== null) {
        setManualActiveId(null)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [manualActiveId])

  const hasHeadings = headingList.length > 0

  return (
    <div className={cn("toc-sidebar", className)} {...props}>
      <div className="toc-sidebar-wrapper">
        <div className="toc-sidebar-inner">
          {/* Progress rail */}
          <div className="toc-sidebar-progress">
            {visibleHeadings.map((item) => {
              const depth = depthById.get(item.id) ?? 1
              const isActive = activeContentId === item.id

              return (
                <div
                  key={item.id}
                  className={cn(
                    "toc-sidebar-progress-line",
                    isActive && "toc-sidebar-progress-line--active"
                  )}
                  data-depth={depth}
                  style={{ "--toc-depth": depth } as React.CSSProperties}
                />
              )
            })}
          </div>

          {/* TOC nav */}
          <nav
            className={cn(
              "toc-sidebar-nav",
              !hasHeadings && "toc-sidebar-nav--hidden"
            )}
            aria-label="Table of contents"
          >
            <div className="toc-sidebar-popover">
              {visibleHeadings.map((item) => {
                const depth = depthById.get(item.id) ?? 1
                const isActive = activeContentId === item.id

                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    rel="noopener noreferrer"
                    className={cn(
                      "toc-sidebar-item notranslate",
                      isActive && "toc-sidebar-item--active"
                    )}
                    data-depth={depth}
                    style={{ "--toc-depth": depth } as React.CSSProperties}
                    onClick={(e) => handleContentClick(e, item)}
                    aria-current={isActive ? "location" : undefined}
                  >
                    {item.textContent}
                  </a>
                )
              })}
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}
