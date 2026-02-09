"use client"

import { useCallback, useMemo } from "react"
import { NodeViewWrapper } from "@tiptap/react"
import type { NodeViewProps } from "@tiptap/react"
import type {
  TableOfContentData,
  TableOfContentDataItem,
} from "@tiptap/extension-table-of-contents"

import { useToc } from "@/components/tiptap-node/toc-node/context/toc-context"

import "./toc-node.scss"

type TocTreeNode = {
  item: TableOfContentDataItem
  depth: number
}

export function TocNodeComponent(props: NodeViewProps) {
  const { node, extension } = props
  const { tocContent, navigateToHeading, normalizeHeadingDepths } = useToc()

  const {
    topOffset: optionTopOffset = 0,
    maxShowCount: optionMaxShowCount = 20,
    showTitle: optionShowTitle = true,
  } = extension.options

  const attrs = node.attrs ?? {}
  const { backgroundColor } = attrs
  const topOffset = attrs.topOffset ?? optionTopOffset
  const maxShowCount = attrs.maxShowCount ?? optionMaxShowCount
  const showTitle = attrs.showTitle ?? optionShowTitle

  const headingList = useMemo<TableOfContentData>(
    () => tocContent ?? [],
    [tocContent]
  )

  const visibleHeadings = useMemo(
    () => headingList.slice(0, maxShowCount),
    [headingList, maxShowCount]
  )

  const normalizedDepths = useMemo<number[]>(
    () => normalizeHeadingDepths(visibleHeadings),
    [visibleHeadings, normalizeHeadingDepths]
  )

  const flatTocList = useMemo<TocTreeNode[]>(() => {
    return visibleHeadings.map((item, index) => ({
      item,
      depth: normalizedDepths[index] ?? 1,
    }))
  }, [visibleHeadings, normalizedDepths])

  const handleContentClick = useCallback(
    (e: React.MouseEvent, item: TableOfContentDataItem) => {
      e.preventDefault()
      e.stopPropagation()
      navigateToHeading(item, { topOffset })
    },
    [navigateToHeading, topOffset]
  )

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { style: _, ...HTMLAttributes } = props.HTMLAttributes

  const wrapperProps = {
    className: "tiptap-table-of-contents-node",
    style: { backgroundColor: backgroundColor || undefined },
    ...HTMLAttributes,
  }

  if (!visibleHeadings.length) {
    return (
      <NodeViewWrapper {...wrapperProps}>
        <div className="tiptap-table-of-contents-empty">
          Add headings to create a table of contents.
        </div>
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper {...wrapperProps}>
      {showTitle && (
        <div className="tiptap-table-of-contents-title">Table of contents</div>
      )}
      <nav
        aria-label="Table of contents"
        className="tiptap-table-of-contents-list"
      >
        {flatTocList.map((node, index) => (
          <a
            key={node.item.id ?? `${index}-${node.item.textContent}`}
            href={`#${node.item.id}`}
            rel="noopener noreferrer"
            className="tiptap-table-of-contents-item notranslate"
            data-depth={node.depth}
            style={{ "--toc-depth": node.depth } as React.CSSProperties}
            onClick={(e) => handleContentClick(e, node.item)}
          >
            {node.item.textContent}
          </a>
        ))}
      </nav>
    </NodeViewWrapper>
  )
}

export default TocNodeComponent
