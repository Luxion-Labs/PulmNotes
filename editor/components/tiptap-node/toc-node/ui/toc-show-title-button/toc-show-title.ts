"use client"

import { useCallback, useEffect, useState } from "react"
import { type Editor } from "@tiptap/react"
import { NodeSelection } from "@tiptap/pm/state"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Lib ---
import {
  isExtensionAvailable,
  isNodeTypeSelected,
} from "@/lib/tiptap-utils"

// --- Icons ---
import { ListIndentedIcon } from "@/components/tiptap-icons/list-indented-icon"

/**
 * Configuration for the TOC show title functionality
 */
export interface UseTocShowTitleConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null
  /**
   * Whether the button should hide when title toggle is not available.
   * @default false
   */
  hideWhenUnavailable?: boolean
  /**
   * Callback function called after a successful title toggle.
   */
  onToggle?: () => void
}

/**
 * Checks if TOC title can be toggled in the current editor state
 */
export function canToggleTocTitle(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  if (!isExtensionAvailable(editor, ["tocNode"])) return false

  return isNodeTypeSelected(editor, ["tocNode"])
}

/**
 * Checks if the currently selected TOC node has title enabled
 */
export function isTocTitleActive(editor: Editor | null): boolean {
  if (!editor) return false

  try {
    const { selection } = editor.state

    const isTocSelected =
      selection instanceof NodeSelection &&
      selection.node.type.name === "tocNode"

    if (!isTocSelected) {
      return false
    }

    const tocNode = selection.node
    return tocNode.attrs.showTitle === true
  } catch {
    return false
  }
}

/**
 * Toggles the TOC title in the editor
 */
export function toggleTocTitle(editor: Editor | null): boolean {
  if (!editor?.isEditable || !canToggleTocTitle(editor)) {
    return false
  }

  try {
    const { selection } = editor.state

    const isTocSelected =
      selection instanceof NodeSelection &&
      selection.node.type.name === "tocNode"

    if (!isTocSelected) {
      return false
    }

    const tocNode = selection.node
    const currentShowTitle = tocNode.attrs.showTitle === true

    return editor
      .chain()
      .focus()
      .updateAttributes("tocNode", { showTitle: !currentShowTitle })
      .run()
  } catch {
    return false
  }
}

/**
 * Determines if the TOC show title button should be shown
 */
export function shouldShowButton(props: {
  editor: Editor | null

  hideWhenUnavailable: boolean
}): boolean {
  const { editor, hideWhenUnavailable } = props

  if (!editor || !editor.isEditable) return false

  if (!isExtensionAvailable(editor, ["tocNode"])) return false

  if (hideWhenUnavailable) {
    return canToggleTocTitle(editor)
  }

  return true
}

/**
 * Custom hook that provides TOC show title functionality for Tiptap editor
 *
 * @example
 * ```tsx
 * // Simple usage
 * function MyTocShowTitleButton() {
 *   const { isVisible, handleToggle } = useTocShowTitle()
 *
 *   if (!isVisible) return null
 *
 *   return <button onClick={handleToggle}>Toggle Title</button>
 * }
 *
 * // Advanced usage
 * function MyAdvancedTocShowTitleButton() {
 *   const { isVisible, handleToggle, label, canToggle, isActive } = useTocShowTitle({
 *     editor: myEditor,
 *     hideWhenUnavailable: true,
 *     onToggle: () => console.log('Title toggled!')
 *   })
 *
 *   if (!isVisible) return null
 *
 *   return (
 *     <MyButton
 *       onClick={handleToggle}
 *       disabled={!canToggle}
 *       aria-label={label}
 *       data-active={isActive}
 *     >
 *       Toggle Title
 *     </MyButton>
 *   )
 * }
 * ```
 */
export function useTocShowTitle(config?: UseTocShowTitleConfig) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onToggle,
  } = config || {}

  const { editor } = useTiptapEditor(providedEditor)
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const [isActive, setIsActive] = useState<boolean>(false)
  const canToggle = canToggleTocTitle(editor)

  useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, hideWhenUnavailable }))
      setIsActive(isTocTitleActive(editor))
    }

    handleSelectionUpdate()

    editor.on("selectionUpdate", handleSelectionUpdate)

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    }
  }, [editor, hideWhenUnavailable])

  const handleToggle = useCallback(() => {
    if (!editor) return false

    const success = toggleTocTitle(editor)

    if (success) {
      onToggle?.()
    }

    return success
  }, [editor, onToggle])

  return {
    isVisible,
    isActive,
    canToggle,
    handleToggle,
    label: "Show title",
    Icon: ListIndentedIcon,
  }
}
