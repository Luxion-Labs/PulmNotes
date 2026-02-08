import Mention from '@tiptap/extension-mention'
import { PluginKey } from '@tiptap/pm/state'
import { createRoot } from 'react-dom/client'
import { MentionMenu } from '@/editor/ui/MentionMenu'

const DEFAULT_NOTES = [
  { id: 'note-1', title: 'Getting Started Guide' },
  { id: 'note-2', title: 'Project Planning' },
  { id: 'note-3', title: 'Meeting Notes' },
  { id: 'note-4', title: 'Code Review Checklist' },
  { id: 'note-5', title: 'API Documentation' },
]

/**
 * Factory function to create MentionSuggestion with dynamic note list.
 * Pass `allNotes` from parent component to keep mentions in sync.
 */
export function createMentionSuggestion(notesArray?: Array<{ id: string; title: string }>) {
  const notesToUse = notesArray || DEFAULT_NOTES
  const pluginKey = new PluginKey(`mentionSuggestion-${Math.random()}`)

  return Mention.configure({
    HTMLAttributes: {
      class: 'mention',
    },
    suggestion: {
      char: '@',
      pluginKey,
      items: ({ query }: { query: string }) => {
        const q = (query || '').toLowerCase()
        return notesToUse.filter((note) => note.title.toLowerCase().includes(q)).slice(0, 5)
      },
      render: () => {
      let container: HTMLElement | null = null
      let root: any = null
      let currentProps: any = null

      const updatePosition = (props: any) => {
        if (!container) return
        const clientRect = props.clientRect && props.clientRect()
        let rect = clientRect
        if (!rect && props.range && props.editor && props.editor.view) {
          try {
            rect = props.editor.view.coordsAtPos(props.range.to)
          } catch (err) {
            rect = null
          }
        }
        if (!rect) return

        const left = rect.left + window.scrollX
        const desiredBelowTop = (rect.bottom || rect.top) + window.scrollY + 6

        container.style.left = `${left}px`
        container.style.top = `${desiredBelowTop}px`

        if (root) {
          root.render(
            <MentionMenu
              position={{ x: 0, y: 0 }}
              notes={props.items}
              query={props.query}
              noTransform
              onSelect={(id: string, title: string) => {
                // Insert using the mention extension's command (label should not include '@')
                props.command({ id, label: title })
                const onExit = currentProps?.onExit
                if (onExit) onExit()
              }}
              onClose={() => currentProps?.onExit?.()}
            />,
          )

          requestAnimationFrame(() => {
            try {
              if (!container) return
              const menuHeight = container.offsetHeight
              const menuWidth = container.offsetWidth
              const viewportBottom = window.scrollY + window.innerHeight
              const margin = 8

              let finalTop = desiredBelowTop
              if (desiredBelowTop + menuHeight > viewportBottom - margin) {
                finalTop = rect.top + window.scrollY - menuHeight - 6
              }

              const viewportRight = window.scrollX + window.innerWidth
              let finalLeft = left
              if (finalLeft + menuWidth > viewportRight - margin) {
                finalLeft = Math.max(margin, viewportRight - menuWidth - margin)
              }
              if (finalLeft < margin) finalLeft = margin

              container.style.left = `${finalLeft}px`
              container.style.top = `${finalTop}px`
            } catch (err) {
              /* ignore */
            }
          })
        }
      }

      return {
        onStart: (props: any) => {
          currentProps = props
          container = document.createElement('div')
          container.style.position = 'absolute'
          container.style.zIndex = '9999'
          document.body.appendChild(container)

          root = createRoot(container)
          updatePosition(props)
        },
        onUpdate: (props: any) => {
          currentProps = props
          updatePosition(props)
        },
        onKeyDown: (props: any) => false,
        onExit: () => {
          if (root) {
            root.unmount()
            root = null
          }
          if (container && container.parentNode) {
            container.parentNode.removeChild(container)
            container = null
          }
          currentProps = null
        },
      }
    }
  }
  })
}

/**
 * Default export for backward compatibility
 */
const MentionSuggestion = createMentionSuggestion()

/**
 * Programmatically open the mention suggestion at the current position.
 * This is a pragmatic helper that inserts the trigger and nudges the editor so
 * the suggestion plugin picks it up. It centralizes the fallback behavior so
 * callers (like Slash) don't need to rely on raw insertContent('+') logic.
 */
export function openMentionMenu(editor: any) {
  try {
    editor.chain().focus().insertContent('@').run()
    setTimeout(() => {
      try {
        if (editor && editor.view) {
          editor.view.dispatch(editor.state.tr)
          editor.view.focus()
        }
      } catch (err) {
        console.error('[Mention] open menu fallback error', err)
      }
    }, 0)
  } catch (err) {
    console.error('[Mention] open menu error', err)
  }
}

export default MentionSuggestion