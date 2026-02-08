import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { TodoNodeView } from './todo-node-view'

/**
 * Custom TipTap Node for todo items with checkboxes
 * Stores: { checked: boolean }
 * Renders via NodeView for proper checkbox interaction
 */
export const TodoNode = Node.create({
  name: 'customTodo',
  group: 'block',
  draggable: false,
  
  addAttributes() {
    return {
      checked: {
        default: false,
        parseHTML: element => {
          const checkbox = element.querySelector('input[type="checkbox"]')
          return checkbox ? checkbox.hasAttribute('checked') : false
        },
        renderHTML: attributes => ({
          'data-checked': attributes.checked ? 'true' : 'false',
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'todo-item',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['todo-item', HTMLAttributes, 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(TodoNodeView)
  },
})

/**
 * Helper to insert a todo node
 */
export function insertTodoNode(editor: any, content = '') {
  if (!editor) return false
  try {
    return editor
      .chain()
      .focus()
      .insertContent({
        type: 'customTodo',
        attrs: { checked: false },
        content: content ? [{ type: 'paragraph', content: [{ type: 'text', text: content }] }] : [],
      })
      .run()
  } catch (err) {
    console.error('[TodoNode] insertTodoNode error', err)
    return false
  }
}
