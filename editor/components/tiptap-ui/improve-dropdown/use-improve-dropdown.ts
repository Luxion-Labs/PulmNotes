"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { Editor } from "@tiptap/react"
import type { Language, TextOptions, Tone } from "@tiptap-pro/extension-ai"
import { NodeSelection } from "@tiptap/pm/state"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Icons ---
import { AiSparklesIcon } from "@/components/tiptap-icons/ai-sparkles-icon"

// --- Lib ---
import { isNodeTypeSelected } from "@/lib/tiptap-utils"

/**
 * AI commands that can be executed on selected text
 */
export type AICommand =
  | "fixSpellingAndGrammar"
  | "extend"
  | "shorten"
  | "simplify"
  | "emojify"
  | "complete"
  | "summarize"

/**
 * Configuration for the improve dropdown functionality
 */
export interface UseImproveDropdownConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null
  /**
   * Optional text options for AI commands
   * @default { stream: true, format: "rich-text" }
   */
  textOptions?: TextOptions
  /**
   * Whether to hide the dropdown when AI features are not available
   * @default false
   */
  hideWhenUnavailable?: boolean
}

const AI_EXCLUDED_BLOCKS = [
  "image",
  "imageUpload",
  "video",
  "audio",
  "table",
  "codeBlock",
  "horizontalRule",
  "hardBreak",
]

/**
 * Checks if AI commands can be used with the current selection
 */
export function canUseAi(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false

  const { selection } = editor.state

  if (selection.empty) {
    return false
  }

  if (selection instanceof NodeSelection) {
    if (!selection.node.content.size) {
      return false
    }

    const node = selection.node
    if (AI_EXCLUDED_BLOCKS.includes(node.type.name)) {
      return false
    }
  }

  return true
}

/**
 * Determines if the improve dropdown should be visible
 */
export function shouldShowImproveDropdown(params: {
  editor: Editor | null
  hideWhenUnavailable: boolean
}): boolean {
  const { editor, hideWhenUnavailable } = params

  if (!editor || !editor.isEditable) {
    return false
  }

  // The third argument 'true' checks whether the current selection is inside an image caption, and prevents showing AI features (improve dropdown) there
  // If the selection is inside an image caption, we can't show the improve dropdown (AI features)
  if (isNodeTypeSelected(editor, ["image"], true)) return false

  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canUseAi(editor)
  }

  return true
}

/**
 * Custom hook that provides improve dropdown functionality for Tiptap editor
 *
 * @example
 * ```tsx
 * // Simple usage
 * function MyImproveDropdown() {
 *   const {
 *     isVisible,
 *     isDisabled,
 *     executeAICommand,
 *     adjustTone,
 *     translate,
 *   } = useImproveDropdown()
 *
 *   if (!isVisible) return null
 *
 *   return (
 *     <DropdownMenu>
 *       <Button onClick={() => executeAICommand('extend')}>
 *         Extend text
 *       </Button>
 *     </DropdownMenu>
 *   )
 * }
 *
 * // Advanced usage with configuration
 * function MyAdvancedImproveDropdown() {
 *   const {
 *     isVisible,
 *     isDisabled,
 *     executeAICommand,
 *   } = useImproveDropdown({
 *     editor: myEditor,
 *     hideWhenUnavailable: true,
 *     textOptions: { stream: false, format: 'plain-text' },
 *   })
 *
 *   // component implementation
 * }
 * ```
 */
export function useImproveDropdown(config?: UseImproveDropdownConfig) {
  const {
    editor: providedEditor,
    textOptions,
    hideWhenUnavailable = false,
  } = config || {}

  const { editor } = useTiptapEditor(providedEditor)
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const isDisabled = !canUseAi(editor)

  const defaultOptions = useMemo(
    () => ({
      stream: true,
      format: "rich-text" as const,
      ...textOptions,
    }),
    [textOptions]
  )

  const handleOpenChange = useCallback(
    (open: boolean, callback?: (isOpen: boolean) => void) => {
      if (!editor || isDisabled) return
      setIsOpen(open)
      callback?.(open)
    },
    [editor, isDisabled]
  )

  const executeAICommand = useCallback(
    (command: AICommand) => {
      if (!editor) return

      editor.chain().focus().aiGenerationShow().run()

      setTimeout(() => {
        switch (command) {
          case "fixSpellingAndGrammar":
            editor.commands.aiFixSpellingAndGrammar(defaultOptions)
            break
          case "extend":
            editor.commands.aiExtend(defaultOptions)
            break
          case "shorten":
            editor.commands.aiShorten(defaultOptions)
            break
          case "simplify":
            editor.commands.aiSimplify(defaultOptions)
            break
          case "emojify":
            editor.commands.aiEmojify(defaultOptions)
            break
          case "complete":
            editor.commands.aiComplete(defaultOptions)
            break
          case "summarize":
            editor.commands.aiSummarize(defaultOptions)
            break
        }
      }, 0)
    },
    [editor, defaultOptions]
  )

  const adjustTone = useCallback(
    (tone: Tone) => {
      if (!editor) return
      editor.chain().focus().aiGenerationShow().run()

      setTimeout(() => {
        editor.commands.aiAdjustTone(tone, defaultOptions)
      }, 0)
    },
    [editor, defaultOptions]
  )

  const translate = useCallback(
    (language: Language) => {
      if (!editor) return
      editor.chain().focus().aiGenerationShow().run()

      setTimeout(() => {
        editor.commands.aiTranslate(language, defaultOptions)
      }, 0)
    },
    [editor, defaultOptions]
  )

  useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      setIsVisible(
        shouldShowImproveDropdown({
          editor,
          hideWhenUnavailable,
        })
      )
    }

    handleSelectionUpdate()
    editor.on("selectionUpdate", handleSelectionUpdate)

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    }
  }, [editor, hideWhenUnavailable])

  return {
    isVisible,
    isDisabled,
    isOpen,
    setIsOpen,
    handleOpenChange,
    executeAICommand,
    adjustTone,
    translate,
    label: "Improve",
    Icon: AiSparklesIcon,
  }
}
