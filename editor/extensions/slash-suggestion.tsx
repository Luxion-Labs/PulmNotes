import { Extension } from '@tiptap/core'

// Minimal adapter Extension - DEPRECATED
// We now use the Notion-style `SlashDropdownMenu` (React component + SuggestionMenu) mounted in the editor UI.
// Keep this lightweight to avoid breaking existing imports.

export const SlashSuggestion = Extension.create({
  name: 'slashSuggestion',
  addOptions() {
    return {
      deprecatedWarning: true,
    }
  },

  onCreate() {
    if (typeof window !== 'undefined' && (this.options as any).deprecatedWarning) {
      // eslint-disable-next-line no-console
      console.warn('[slash-suggestion] Deprecated: use SlashDropdownMenu (Notion style) instead of this extension.')
    }
  },
})

export default SlashSuggestion
