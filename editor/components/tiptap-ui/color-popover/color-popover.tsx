"use client"

import { forwardRef, useMemo, useRef, useState } from "react"
import { type Editor } from "@tiptap/react"

// --- Hooks ---
import { useMenuNavigation } from "@/hooks/use-menu-navigation"
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Icons ---
import { BanIcon } from "@/editor/components/tiptap-icons/ban-icon"
import { ChevronDownIcon } from "@/editor/components/tiptap-icons/chevron-down-icon"

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button"
import { Button, ButtonGroup } from "@/components/tiptap-ui-primitive/button"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/tiptap-ui-primitive/popover"
import { Separator } from "@/components/tiptap-ui-primitive/separator"
import {
  Card,
  CardBody,
  CardItemGroup,
  CardGroupLabel,
} from "@/components/tiptap-ui-primitive/card"

// --- Tiptap UI ---
import {
  ColorHighlightButton,
  useColorHighlight,
} from "@/components/tiptap-ui/color-highlight-button"

// Text colors - matching reference implementation
const TEXT_COLORS = [
  { value: "var(--tt-color-text)", label: "Default" },
  { value: "var(--tt-color-text-gray)", label: "Gray" },
  { value: "var(--tt-color-text-brown)", label: "Brown" },
  { value: "var(--tt-color-text-orange)", label: "Orange" },
  { value: "var(--tt-color-text-yellow)", label: "Yellow" },
  { value: "var(--tt-color-text-green)", label: "Green" },
  { value: "var(--tt-color-text-blue)", label: "Blue" },
  { value: "var(--tt-color-text-purple)", label: "Purple" },
  { value: "var(--tt-color-text-pink)", label: "Pink" },
  { value: "var(--tt-color-text-red)", label: "Red" },
]

// Highlight colors - matching reference implementation
const HIGHLIGHT_COLORS = [
  { value: "var(--tt-bg-color)", label: "Default" },
  { value: "var(--tt-color-highlight-gray)", label: "Gray" },
  { value: "var(--tt-color-highlight-brown)", label: "Brown" },
  { value: "var(--tt-color-highlight-orange)", label: "Orange" },
  { value: "var(--tt-color-highlight-yellow)", label: "Yellow" },
  { value: "var(--tt-color-highlight-green)", label: "Green" },
  { value: "var(--tt-color-highlight-blue)", label: "Blue" },
  { value: "var(--tt-color-highlight-purple)", label: "Purple" },
  { value: "var(--tt-color-highlight-pink)", label: "Pink" },
  { value: "var(--tt-color-highlight-red)", label: "Red" },
]

interface TextColorButtonProps extends ButtonProps {
  editor?: Editor | null
  textColor: string
  label: string
}

const TextColorButton = forwardRef<HTMLButtonElement, TextColorButtonProps>(
  ({ editor, textColor, label, ...props }, ref) => {
    const handleClick = () => {
      if (!editor) return
      if (textColor === "var(--tt-color-text)" || textColor === "var(--tt-bg-color)") {
        editor.chain().focus().unsetColor().run()
      } else {
        editor.chain().focus().setColor(textColor).run()
      }
    }

    const isActive = editor?.isActive("textStyle", { color: textColor })

    return (
      <Button
        type="button"
        data-style="ghost"
        data-active-state={isActive ? "on" : "off"}
        role="button"
        tabIndex={-1}
        aria-label={`${label} text color`}
        tooltip={label}
        onClick={handleClick}
        ref={ref}
        {...props}
      >
        <span
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            border: "2px solid var(--tt-gray-light-a-100)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: 600,
            color: textColor,
          }}
        >
          A
        </span>
      </Button>
    )
  }
)

TextColorButton.displayName = "TextColorButton"

export interface ColorPopoverContentProps {
  editor?: Editor | null
}

export function ColorPopoverContent({
  editor,
}: ColorPopoverContentProps) {
  const { handleRemoveHighlight } = useColorHighlight({ editor })
  const isMobile = useIsBreakpoint()
  const containerRef = useRef<HTMLDivElement>(null)

  const menuItems = useMemo(
    () => [
      ...TEXT_COLORS.map((c) => ({ ...c, type: "text" })),
      ...HIGHLIGHT_COLORS.map((c) => ({ ...c, type: "highlight" })),
    ],
    []
  )

  const { selectedIndex } = useMenuNavigation({
    containerRef,
    items: menuItems,
    orientation: "both",
    onSelect: (item) => {
      if (!containerRef.current) return false
      const highlightedElement = containerRef.current.querySelector(
        '[data-highlighted="true"]'
      ) as HTMLElement
      if (highlightedElement) highlightedElement.click()
      if (item.value === "none") handleRemoveHighlight()
      return true
    },
    autoSelectFirstItem: false,
  })

  return (
    <Card
      ref={containerRef}
      tabIndex={0}
      style={isMobile ? { boxShadow: "none", border: 0 } : {}}
    >
      <CardBody style={isMobile ? { padding: 0 } : {}}>
        <CardItemGroup>
          <CardGroupLabel>Text Color</CardGroupLabel>
          <ButtonGroup orientation="horizontal">
            {TEXT_COLORS.slice(0, 5).map((color, index) => (
              <TextColorButton
                key={color.value}
                editor={editor}
                textColor={color.value}
                label={color.label}
                tabIndex={index === selectedIndex ? 0 : -1}
                data-highlighted={selectedIndex === index}
              />
            ))}
          </ButtonGroup>
          <ButtonGroup orientation="horizontal">
            {TEXT_COLORS.slice(5).map((color, index) => (
              <TextColorButton
                key={color.value}
                editor={editor}
                textColor={color.value}
                label={color.label}
                tabIndex={index + 5 === selectedIndex ? 0 : -1}
                data-highlighted={selectedIndex === index + 5}
              />
            ))}
          </ButtonGroup>
        </CardItemGroup>

        <CardItemGroup>
          <CardGroupLabel>Highlight Color</CardGroupLabel>
          <ButtonGroup orientation="horizontal">
            {HIGHLIGHT_COLORS.slice(0, 5).map((color, index) => {
              const itemIndex = TEXT_COLORS.length + index
              return (
                <ColorHighlightButton
                  key={color.value}
                  editor={editor}
                  highlightColor={color.value}
                  tooltip={color.label}
                  aria-label={`${color.label} highlight color`}
                  tabIndex={itemIndex === selectedIndex ? 0 : -1}
                  data-highlighted={selectedIndex === itemIndex}
                />
              )
            })}
          </ButtonGroup>
          <ButtonGroup orientation="horizontal">
            {HIGHLIGHT_COLORS.slice(5).map((color, index) => {
              const itemIndex = TEXT_COLORS.length + 5 + index
              return (
                <ColorHighlightButton
                  key={color.value}
                  editor={editor}
                  highlightColor={color.value}
                  tooltip={color.label}
                  aria-label={`${color.label} highlight color`}
                  tabIndex={itemIndex === selectedIndex ? 0 : -1}
                  data-highlighted={selectedIndex === itemIndex}
                />
              )
            })}
          </ButtonGroup>
        </CardItemGroup>
      </CardBody>
    </Card>
  )
}

export interface ColorPopoverProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null
  hideWhenUnavailable?: boolean
}

export const ColorPopover = forwardRef<HTMLButtonElement, ColorPopoverProps>(
  (
    {
      editor: providedEditor,
      hideWhenUnavailable = false,
      ...props
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor)
    const [isOpen, setIsOpen] = useState(false)
    const { isVisible, canColorHighlight } = useColorHighlight({
      editor,
      hideWhenUnavailable,
    })

    const isActive = editor?.isActive("textStyle") || editor?.isActive("highlight")

    if (!isVisible) return null

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            data-style="ghost"
            data-appearance="default"
            data-active-state={isActive ? "on" : "off"}
            role="button"
            tabIndex={-1}
            aria-label="Text and highlight colors"
            tooltip="Colors"
            disabled={!canColorHighlight}
            data-disabled={!canColorHighlight}
            ref={ref}
            {...props}
          >
            <span
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: editor?.getAttributes("textStyle").color || "currentColor",
              }}
            >
              A
            </span>
            <ChevronDownIcon
              style={{ width: "12px", height: "12px", marginLeft: "-2px" }}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent aria-label="Text and highlight colors" side="bottom" align="start">
          <ColorPopoverContent editor={editor} />
        </PopoverContent>
      </Popover>
    )
  }
)

ColorPopover.displayName = "ColorPopover"

export default ColorPopover
