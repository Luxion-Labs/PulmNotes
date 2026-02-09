import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { TocNodeComponent } from "@/components/tiptap-node/toc-node/toc-node"

export interface TocNodeAttrs {
  /**
   * The maximum number of headings to show in the TOC node.
   * @default 20
   */
  maxShowCount?: number | null
  /**
   * Offset from the top of the viewport when scrolling to a heading.
   * @default 0
   */
  topOffset?: number | null
  /**
   * Whether to show the "Table of contents" title.
   * @default true
   */
  showTitle?: boolean | null
}

export interface TocNodeOptions extends TocNodeAttrs {
  /**
   * HTML attributes to add to the TOC node element
   * @default {}
   * @example { class: 'foo' }
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  HTMLAttributes: Record<string, any>
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    tocNode: {
      /**
       * Insert a table of contents node.
       *
       * Example:
       * editor.commands.insertTocNode({ maxShowCount: 10 })
       */
      insertTocNode: (attrs?: TocNodeAttrs) => ReturnType
    }
  }
}

/**
 * A Tiptap node extension that creates a table of contents node.
 * @see registry/tiptap-node/toc-node/toc-node-component
 */
export const TocNode = Node.create<TocNodeOptions>({
  name: "tocNode",

  group: "block customNode",

  draggable: true,

  selectable: true,

  atom: true,

  addOptions() {
    return {
      topOffset: 0,
      maxShowCount: 20,
      showTitle: true,
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      topOffset: {
        default: null as number | null,
        parseHTML: (element: HTMLElement) => {
          const val = element.getAttribute("data-top-offset")
          const num = val != null ? Number(val) : null
          return Number.isFinite(num) ? num : null
        },
        renderHTML: (attrs: TocNodeAttrs) => {
          if (attrs.topOffset == null) return {}
          return { "data-top-offset": attrs.topOffset }
        },
      },
      maxShowCount: {
        default: null as number | null,
        parseHTML: (element: HTMLElement) => {
          const val = element.getAttribute("data-max-show-count")
          const num = val != null ? Number(val) : null
          return Number.isFinite(num) ? num : null
        },
        renderHTML: (attrs: TocNodeAttrs) => {
          if (attrs.maxShowCount == null) return {}
          return { "data-max-show-count": attrs.maxShowCount }
        },
      },
      showTitle: {
        default: true,

        parseHTML: (element: HTMLElement) => {
          const val = element.getAttribute("data-show-title")
          if (val === "false") return false
          if (val === "true") return true
          return null
        },

        renderHTML: (attrs: TocNodeAttrs) => {
          if (attrs.showTitle == null) return {}
          return { "data-show-title": String(attrs.showTitle) }
        },
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="toc-node"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "toc-node",
      }),
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(TocNodeComponent, {
      stopEvent: ({ event }) => {
        if (!(event instanceof MouseEvent)) return false

        const el = event.target as HTMLElement | null
        if (!el) return false

        return Boolean(el.closest(".tiptap-table-of-contents-item"))
      },
    })
  },

  addCommands() {
    return {
      insertTocNode:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          })
        },
    }
  },
})

export default TocNode
