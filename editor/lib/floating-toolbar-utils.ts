import { NodeSelection, type Selection } from "@tiptap/pm/state"
import { CellSelection } from "@tiptap/pm/tables"
import type { Editor } from "@tiptap/react"
import { isTextSelection, isNodeSelection, posToDOMRect } from "@tiptap/react"

/**
 * Checks if the current selection is valid for showing the floating toolbar
 */
export const isSelectionValid = (
  editor: Editor | null,
  selection?: Selection,
  excludedNodeTypes: string[] = ["imageUpload", "horizontalRule"]
): boolean => {
  if (!editor) return false
  if (!selection) selection = editor.state.selection

  const { state } = editor
  const { doc } = state
  const { empty, from, to } = selection

  const isEmptyTextBlock =
    !doc.textBetween(from, to).length && isTextSelection(selection)
  const isCodeBlock =
    selection.$from.parent.type.spec.code ||
    (isNodeSelection(selection) && selection.node.type.spec.code)
  const isExcludedNode =
    isNodeSelection(selection) &&
    excludedNodeTypes.includes(selection.node.type.name)
  const isTableCell = selection instanceof CellSelection

  return (
    !empty &&
    !isEmptyTextBlock &&
    !isCodeBlock &&
    !isExcludedNode &&
    !isTableCell
  )
}

/**
 * Gets the bounding rect of the current selection in the editor.
 */
export const getSelectionBoundingRect = (editor: Editor): DOMRect | null => {
  const { state } = editor.view
  const { selection } = state
  const { ranges } = selection

  const from = Math.min(...ranges.map((range) => range.$from.pos))
  const to = Math.max(...ranges.map((range) => range.$to.pos))

  if (isNodeSelection(selection)) {
    const node = editor.view.nodeDOM(from) as HTMLElement
    if (node) {
      return node.getBoundingClientRect()
    }
  }

  return posToDOMRect(editor.view, from, to)
}

/**
 * Check if an element is within the editor
 */
export const isElementWithinEditor = (
  editor: Editor | null,
  element: Node
): boolean => {
  if (!editor) return false
  return editor.view.dom.contains(element)
}

/**
 * Determines how a target element overflows relative to a container element
 */
export function getElementOverflowPosition(
  targetElement: Element,
  containerElement: HTMLElement
): "none" | "top" | "bottom" | "both" {
  const targetBounds = targetElement.getBoundingClientRect()
  const containerBounds = containerElement.getBoundingClientRect()

  const isOverflowingTop = targetBounds.top < containerBounds.top
  const isOverflowingBottom = targetBounds.bottom > containerBounds.bottom

  if (isOverflowingTop && isOverflowingBottom) return "both"
  if (isOverflowingTop) return "top"
  if (isOverflowingBottom) return "bottom"
  return "none"
}
