"use client"

import * as React from "react"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Tiptap UI ---
import type { UseTocShowTitleConfig } from "@/components/tiptap-node/toc-node/ui/toc-show-title-button/toc-show-title"
import { useTocShowTitle } from "@/components/tiptap-node/toc-node/ui/toc-show-title-button/toc-show-title"

// --- UI Primitives ---

import type { ButtonProps } from "@/components/tiptap-ui-primitive/button"

import { Button } from "@/components/tiptap-ui-primitive/button"

export interface TocShowTitleButtonProps
  extends Omit<ButtonProps, "type" | "onToggle">, UseTocShowTitleConfig {
  /**
   * Optional text to display alongside the icon.
   */
  text?: string
}

/**
 * Button component for toggling TOC title in a Tiptap editor.
 * Only appears when a TOC node is selected in the editor.
 *
 * For custom button implementations, use the `useTocShowTitle` hook instead.
 */
export const TocShowTitleButton = React.forwardRef<
  HTMLButtonElement,
  TocShowTitleButtonProps
>(
  (
    {
      editor: providedEditor,
      text,
      hideWhenUnavailable = false,
      onToggle,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor)

    const { isVisible, isActive, canToggle, handleToggle, label, Icon } =
      useTocShowTitle({
        editor,
        hideWhenUnavailable,
        onToggle,
      })

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        handleToggle()
      },
      [handleToggle, onClick]
    )

    if (!isVisible) {
      return null
    }

    return (
      <Button
        type="button"
        data-style="ghost"
        data-active-state={isActive ? "on" : "off"}
        role="button"
        tabIndex={-1}
        disabled={!canToggle}
        data-disabled={!canToggle}
        aria-label={label}
        tooltip={label}
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <Icon className="tiptap-button-icon" />

            {text && <span className="tiptap-button-text">{text}</span>}
          </>
        )}
      </Button>
    )
  }
)

TocShowTitleButton.displayName = "TocShowTitleButton"
