"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { flip, offset, shift, size } from "@floating-ui/react"
import { PluginKey } from "@tiptap/pm/state"

// --- Hooks ---
import { useFloatingElement } from "@/editor/hooks/use-floating-element"
import { useMenuNavigation } from "@/editor/hooks/use-menu-navigation"
import { useTiptapEditor } from "@/editor/hooks/use-tiptap-editor"

// --- Tiptap Editor ---
import type { Range } from "@tiptap/react"

// --- Tiptap UI ---
import { Suggestion } from "@tiptap/suggestion"

// --- UI Primitives ---
import {
  SuggestionPluginKey,
  type SuggestionKeyDownProps,
  type SuggestionProps,
} from "@tiptap/suggestion"

import { calculateStartPosition } from "@/editor/components/tiptap-ui-utils/suggestion-menu/suggestion-menu-utils"
import type {
  SuggestionItem,
  SuggestionMenuProps,
} from "@/editor/components/tiptap-ui-utils/suggestion-menu/suggestion-menu-types"

/**
 * A component that renders a suggestion menu for Tiptap editors.
 * Displays a floating menu when a trigger character is typed.
 */
export const SuggestionMenu = ({
  editor: providedEditor,
  floatingOptions,
  keepOpenOnEditorClick = false,
  persistOnExit = false,
  closeOnEscape = true,
  selector = "tiptap-suggestion-menu",
  children,
  maxHeight = 384,
  pluginKey = SuggestionPluginKey,
  autoUpdateOptions,
  ...internalSuggestionProps
}: SuggestionMenuProps) => {
  const { editor } = useTiptapEditor(providedEditor)

  const [show, setShow] = useState<boolean>(false)

  // If later we want the floating stick to the position while browser is scrolling,
  // we can uncomment this part and pass the getBoundingClientRect prop to FloatingElement instead of referenceElement.
  // const [internalClientRect, setInternalClientRect] = useState<DOMRect | null>(
  //   null
  // )
  const [internalDecorationNode, setInternalDecorationNode] =
    useState<HTMLElement | null>(null)
  const [internalClientRect, setInternalClientRect] = useState<DOMRect | null>(null)
  const [internalCommand, setInternalCommand] = useState<
    ((item: SuggestionItem) => void) | null
  >(null)
  const [internalItems, setInternalItems] = useState<SuggestionItem[]>([])
  const [internalQuery, setInternalQuery] = useState<string>("")
  const [, setInternalRange] = useState<Range | null>(null)
  const lastKnownClientRect = useRef<DOMRect | null>(null)

  // Choose reference: prefer client rect (caret pos) when available, otherwise fallback to decoration node
  const floatingReference = internalClientRect || internalDecorationNode

  const mergedFloatingOptions = useMemo(() => {
    const base = {
      ...floatingOptions,
    } as Partial<{
      dismissOptions?: {
        outsidePress?: (event: MouseEvent | TouchEvent) => boolean
      }
    }>

    if (keepOpenOnEditorClick) {
      base.dismissOptions = {
        ...base.dismissOptions,
        // Avoid dismissing while the slash menu is active. We keep it visible
        // regardless of clicks/hover outside so the UI state stays stable.
        outsidePress: (event) => {
          return false
        },
      }
    }

    return base
  }, [floatingOptions, keepOpenOnEditorClick, editor])

  const { ref, style, getFloatingProps, isMounted } = useFloatingElement(
    show,
    floatingReference,
    1000,
    {
      placement: "bottom-start",
      middleware: [
        offset(6), // smaller offset to keep popup near trigger
        flip({
          mainAxis: true,
          crossAxis: false,
          padding: 8,
        }),
        shift({ padding: 8 }),
        size({
          apply({ availableHeight, elements }) {
            if (elements.floating) {
              const maxHeightValue = maxHeight
                ? Math.min(maxHeight, availableHeight)
                : availableHeight

              elements.floating.style.setProperty(
                "--suggestion-menu-max-height",
                `${maxHeightValue}px`
              )
            }
          },
        }),
      ],
      onOpenChange(open) {
        if (!open) {
          setShow(false)
        }
      },
      ...mergedFloatingOptions,
    },
    autoUpdateOptions
  )

  const internalSuggestionPropsRef = useRef(internalSuggestionProps)

  useEffect(() => {
    internalSuggestionPropsRef.current = internalSuggestionProps
  }, [internalSuggestionProps])

  const closePopup = useCallback(() => {
    setShow(false)
  }, [])

  const hasActiveTrigger = useCallback(
    (currentEditor: typeof editor) => {
      const triggerChar = internalSuggestionPropsRef.current.char
      if (!currentEditor || !triggerChar) return false

      try {
        const { $from } = currentEditor.state.selection
        const text = $from.nodeBefore?.isText ? $from.nodeBefore.text || "" : ""
        if (!text) return false

        const index = text.lastIndexOf(triggerChar)
        if (index === -1) return false

        // If the cursor is after the trigger in the same text node, consider it active.
        const cursorOffset = $from.parentOffset
        return cursorOffset >= index + 1
      } catch (err) {
        return false
      }
    },
    []
  )

  const resolveClientRect = useCallback(
    (props: SuggestionProps<SuggestionItem>) => {
      let rect = props.clientRect?.() ?? null

      if (!rect && props.decorationNode instanceof HTMLElement) {
        rect = props.decorationNode.getBoundingClientRect()
      }

      if (rect) {
        lastKnownClientRect.current = rect
      }

      return rect ?? lastKnownClientRect.current
    },
    []
  )

  useEffect(() => {
    if (!editor || editor.isDestroyed) {
      return
    }

    const existingPlugin = editor.state.plugins.find(
      (plugin) => plugin.spec.key === pluginKey
    )
    if (existingPlugin) {
      editor.unregisterPlugin(pluginKey)
    }

    const suggestion = Suggestion({
      pluginKey:
        pluginKey instanceof PluginKey ? pluginKey : new PluginKey(pluginKey),
      editor,

      allow(props) {
        // Guard against stale ranges: if the suggestion's range is outside the current
        // document (e.g., the doc changed while a suggestion was active), don't allow it.
        const docSize = editor.state.doc.content.size
        if (props.range.from > docSize || props.range.to > docSize) {
          return false
        }

        let $from
        try {
          $from = editor.state.doc.resolve(props.range.from)
        } catch (err) {
          // If resolve throws for any reason, refuse to allow the suggestion
          return false
        }

        // Check if we're inside an image node
        for (let depth = $from.depth; depth > 0; depth--) {
          if ($from.node(depth).type.name === "image") {
            return false // Don't allow slash command inside image (since we support captions)
          }
        }

        return true
      },

      shouldShow({ editor }) {
        // Only show suggestions while the editor is focused. This prevents the menu
        // from lingering when focus moves outside the editor.
        if (!editor.view.hasFocus() && !editor.view.composing) {
          return false
        }
        return true
      },

      command({ editor, range, props }) {
        if (!range) {
          return
        }

        const { view, state } = editor
        const { selection } = state

        const isMention = editor.extensionManager.extensions.some(
          (extension) => {
            const name = extension.name
            return (
              name === "mention" &&
              extension.options?.suggestion?.char ===
                internalSuggestionPropsRef.current.char
            )
          }
        )

        if (!isMention) {
          const cursorPosition = selection.$from.pos
          const previousNode = selection.$head?.nodeBefore

          const startPosition = previousNode
            ? calculateStartPosition(
                cursorPosition,
                previousNode,
                internalSuggestionPropsRef.current.char
              )
            : selection.$from.start()

          const transaction = state.tr.deleteRange(
            startPosition,
            cursorPosition
          )
          view.dispatch(transaction)
        }

        const nodeAfter = view.state.selection.$to.nodeAfter
        const overrideSpace = nodeAfter?.text?.startsWith(" ")

        const rangeToUse = { ...range }

        if (overrideSpace) {
          rangeToUse.to += 1
        }

        props.onSelect({ editor, range: rangeToUse, context: props.context })
      },

      render: () => {
        return {
          onStart: (props: SuggestionProps<SuggestionItem>) => {
            const dec = (props.decorationNode as HTMLElement) ?? null
            setInternalDecorationNode(dec)
            setInternalCommand(() => props.command)
            setInternalItems(props.items)
            setInternalQuery(props.query)
            setInternalRange(props.range)
            // If clientRect becomes unavailable during selection updates, keep the last
            // known rect to avoid the floating UI disappearing.
            const safeRect = resolveClientRect(props)
            setInternalClientRect((prev) => safeRect ?? prev)

            // Ensure decoration shows our configured content and empty state
            try {
              const decoContent = (internalSuggestionPropsRef.current as any)?.decorationContent ?? ""
              if (dec) {
                if (decoContent) dec.setAttribute('data-decoration-content', decoContent)
                if (!props.query) dec.classList.add('is-empty')
                else dec.classList.remove('is-empty')
              }
            } catch (err) {
              // ignore
            }

            setShow(true)
          },

          onUpdate: (props: SuggestionProps<SuggestionItem>) => {
            const dec = (props.decorationNode as HTMLElement) ?? null
            setInternalDecorationNode(dec)
            setInternalCommand(() => props.command)
            setInternalItems(props.items)
            setInternalQuery(props.query)
            setInternalRange(props.range)
            // Keep the floating UI mounted even if a minor cursor move triggers dismiss logic.
            // The suggestion is still active, so we re-sync visibility here to keep UI + state aligned.
            setShow(true)

            const safeRect = resolveClientRect(props)
            setInternalClientRect((prev) => safeRect ?? prev)

            // Keep decoration attributes in sync with query
            try {
              const decoContent = (internalSuggestionPropsRef.current as any)?.decorationContent ?? ""
              if (dec) {
                if (decoContent) dec.setAttribute('data-decoration-content', decoContent)
                if (!props.query) dec.classList.add('is-empty')
                else dec.classList.remove('is-empty')
              }
            } catch (err) {
              // ignore
            }
          },

          onKeyDown: (props: SuggestionKeyDownProps) => {
            if (props.event.key === "Escape") {
              if (closeOnEscape) {
                closePopup()
                return true
              }

              return false
            }
            return false
          },

          onExit: () => {
            const dec = internalDecorationNode
            if (dec) {
              try {
                dec.removeAttribute('data-decoration-content')
                dec.classList.remove('is-empty')
              } catch (err) {
                // ignore
              }
            }

            if (!persistOnExit) {
              setInternalDecorationNode(null)
              setInternalCommand(null)
              setInternalItems([])
              setInternalQuery("")
              setInternalRange(null)
              setInternalClientRect(null)
              lastKnownClientRect.current = null
              setShow(false)
            } else {
              // Keep the menu visible until an item is selected,
              // but hide it if the trigger was removed.
              if (hasActiveTrigger(editor)) {
                setShow(true)
              } else {
                setInternalDecorationNode(null)
                setInternalCommand(null)
                setInternalItems([])
                setInternalQuery("")
                setInternalRange(null)
                setInternalClientRect(null)
                lastKnownClientRect.current = null
                setShow(false)
              }
            }
          },
        }
      },
      ...internalSuggestionPropsRef.current,
    })

    editor.registerPlugin(suggestion)

    return () => {
      if (!editor.isDestroyed) {
        editor.unregisterPlugin(pluginKey)
      }
    }
  }, [editor, pluginKey, closePopup, persistOnExit, closeOnEscape, hasActiveTrigger])

  useEffect(() => {
    if (!editor) return

    if (keepOpenOnEditorClick) {
      return undefined
    }

    const handleBlur = () => closePopup()

    editor.on("blur", handleBlur)

    return () => {
      editor.off("blur", handleBlur)
    }
  }, [editor, closePopup, keepOpenOnEditorClick])

  useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      if (!show && !persistOnExit) return

      if (persistOnExit && !hasActiveTrigger(editor)) {
        closePopup()
        return
      }

      try {
        const pos = editor.state.selection.$anchor.pos
        const coords = editor.view.coordsAtPos(pos)
        const rect = new DOMRect(
          coords.left,
          coords.top,
          coords.right - coords.left,
          coords.bottom - coords.top
        )

        lastKnownClientRect.current = rect
        setInternalClientRect(rect)
      } catch (err) {
        // If coords can't be resolved, keep the last known rect.
        // This makes cursor movement safe even when ProseMirror can't compute a rect.
      }
    }

    editor.on("selectionUpdate", handleSelectionUpdate)

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    }
  }, [editor, show, persistOnExit])

  const onSelect = useCallback(
    (item: SuggestionItem) => {
      closePopup()

      if (internalCommand) {
        internalCommand(item)
      }
    },
    [closePopup, internalCommand]
  )

  const { selectedIndex } = useMenuNavigation({
    editor: editor,
    query: internalQuery,
    items: internalItems,
    onSelect,
  })

  if (!isMounted || !show || !editor) {
    return null
  }

  return (
    <div
      ref={ref}
      style={style}
      {...getFloatingProps()}
      data-selector={selector}
      className="tiptap-suggestion-menu"
      role="listbox"
      aria-label="Suggestions"
      onPointerDown={(e) => e.preventDefault()}
    >
      {children({
        items: internalItems,
        selectedIndex,
        onSelect,
      })}
    </div>
  )
}
