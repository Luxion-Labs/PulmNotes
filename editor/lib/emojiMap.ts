// Prefer using a comprehensive emoji library when available, fall back to a small map.
export const EMOJI_SHORTCODE_MAP: Record<string, string> = {
  smile: '😊',
  thumbsup: '👍',
  heart: '❤️',
  rocket: '🚀',
  party: '🎉',
  grin: '😁',
  wink: '😉',
  cry: '😢',
  laugh: '😂',
  clap: '👏',
}

export function replaceShortcodesWithEmoji(text: string): string {
  // Try to use node-emoji if installed - but avoid static require so bundlers
  // don't try to resolve the module at build-time if it's not present.
  try {
    const req = new Function('return require')()
    if (req) {
      const nodeEmoji = req('node-emoji')
      if (nodeEmoji && typeof nodeEmoji.emojify === 'function') {
        return nodeEmoji.emojify(text)
      }
    }
  } catch (err) {
    // ignore - fall back to small mapping
  }

  return text.replace(/:([a-z0-9_+\-]+):/gi, (match, name) => {
    const key = name.toLowerCase()
    return EMOJI_SHORTCODE_MAP[key] || match
  })
}