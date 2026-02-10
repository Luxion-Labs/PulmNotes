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
export function createMentionSuggestion(notesOrGetter?: Array<{ id: string; title: string }> | (() => Array<{ id: string; title: string }>)) {
  const pluginKey = new PluginKey(`mentionSuggestion-${Math.random()}`)

  return Mention.configure({
    HTMLAttributes: {
      class: 'mention',
    },
    suggestion: {
      char: '@',
      pluginKey,
      items: ({ query }: { query: string }) => {
        const notes = typeof notesOrGetter === 'function'
          ? notesOrGetter()
          : (notesOrGetter || DEFAULT_NOTES)
        const q = (query || '').toLowerCase()
        return notes.filter((note) => note.title.toLowerCase().includes(q)).slice(0, 5)
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

          const menuHeight = 280; // Approx max height
          const spaceBelow = window.innerHeight - rect.bottom;
          const spaceAbove = rect.top;

          const left = rect.left + window.scrollX;

          let top;
          // Place above if restricted space below, but only if there is space above
          if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
            top = (rect.top + window.scrollY) - menuHeight - 10;
          } else {
            top = (rect.bottom + window.scrollY) + 10;
          }

          container.style.left = `${left}px`
          container.style.top = `${top}px`
        }

        return {
          onStart: (props: any) => {
            currentProps = props
            container = document.createElement('div')
            container.style.position = 'absolute'
            container.style.zIndex = '9999'
            document.body.appendChild(container)

            root = createRoot(container)
            // Initial render
            root.render(
              <MentionMenu
                position={{ x: 0, y: 0 }}
                notes={props.items}
                query={props.query}
                noTransform
                onSelect={(id: string, title: string) => {
                  props.command({ id, label: title })
                  // Mark container for immediate cleanup and trigger exit
                  if (container) {
                    try { (container as any).__mentionImmediateClose = true } catch (err) { }
                  }
                  currentProps?.onExit?.()
                }}
                onClose={() => {
                  if (container) {
                    try { (container as any).__mentionImmediateClose = true } catch (err) { }
                  }
                  currentProps?.onExit?.()
                }}
              />
            )
            updatePosition(props)
          },
          onUpdate: (props: any) => {
            currentProps = props
            if (root) {
              root.render(
                <MentionMenu
                  position={{ x: 0, y: 0 }}
                  notes={props.items}
                  query={props.query}
                  noTransform
                  onSelect={(id: string, title: string) => {
                    props.command({ id, label: title })
                    // Mark container for immediate cleanup and trigger exit
                    if (container) {
                      try { (container as any).__mentionImmediateClose = true } catch (err) { }
                    }
                    currentProps?.onExit?.()
                  }}
                  onClose={() => {
                    if (container) {
                      try { (container as any).__mentionImmediateClose = true } catch (err) { }
                    }
                    currentProps?.onExit?.()
                  }}
                />
              )
            }
            updatePosition(props)
          },
          onKeyDown: (props: any) => {
            if (props.event.key === 'Escape') {
              props.event.preventDefault()
              if (container) {
                try { (container as any).__mentionImmediateClose = true } catch (err) { }
              }
              currentProps?.onExit?.()
              return true
            }
            return false
          },
          onExit: () => {
            // Avoid synchronous unmount during React renders by scheduling cleanup.
            // We keep references for the scheduled cleanup, then immediately clear
            // the local variables so future renders don't interact with them.
            const scheduledRoot = root
            const scheduledContainer = container
            root = null
            container = null
            currentProps = null

            // check whether immediate close was requested on the DOM container
            const immediateFlag = scheduledContainer ? !!(scheduledContainer as any).__mentionImmediateClose : false
            const cleanupDelay = immediateFlag ? 0 : 200 // small grace period in ms

            if (scheduledContainer) {
              const id = (setTimeout(() => {
                try {
                  // If the id was cleared or replaced, do not cleanup
                  if ((scheduledContainer as any).__mentionCleanupId !== id) return

                  if (scheduledRoot) {
                    try {
                      scheduledRoot.unmount()
                    } catch (err) {
                      console.warn('[Mention] scheduled unmount error', err)
                    }
                  }

                  if (scheduledContainer.parentNode) {
                    scheduledContainer.parentNode.removeChild(scheduledContainer)
                  }
                } finally {
                  try { delete (scheduledContainer as any).__mentionCleanupId } catch (e) { }
                }
              }, cleanupDelay) as unknown) as number

              try {
                ;(scheduledContainer as any).__mentionCleanupId = id
              } catch (err) {
                // ignore assignment failures
              }
            } else if (scheduledRoot) {
              setTimeout(() => {
                try { scheduledRoot.unmount() } catch (err) { console.warn('[Mention] scheduled unmount error', err) }
              }, cleanupDelay)
            }
          },
        }
      },
    },
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
// Force rebuild