export const isTauriApp = (): boolean => {
  if (typeof window === "undefined") return false
  const w = window as any
  return Boolean(w.__TAURI_INTERNALS__ || w.__TAURI__)
}

// Global drag data store for Tauri compatibility
// Tauri restricts dataTransfer, so we use a global variable as fallback
const dragDataStore = {
  type: '',
  id: ''
}

export const setDragData = (type: string, id: string) => {
  dragDataStore.type = type
  dragDataStore.id = id
  console.log('[openExternal] setDragData:', { type, id })
}

export const getDragData = () => {
  return { ...dragDataStore }
}

export const clearDragData = () => {
  // Delay clearing to ensure drop event can read the data first
  setTimeout(() => {
    console.log('[openExternal] clearDragData (delayed)')
    dragDataStore.type = ''
    dragDataStore.id = ''
  }, 100)
}

export const openExternal = async (url: string): Promise<boolean> => {
  if (!url || typeof window === "undefined") return false

  if (!isTauriApp()) {
    window.open(url, "_blank", "noopener,noreferrer")
    return true
  }

  try {
    const { open } = await import("@tauri-apps/plugin-shell")
    await open(url)
    return true
  } catch (error) {
    console.warn("[openExternal] Failed to open via Tauri shell:", error)
    window.open(url, "_blank", "noopener,noreferrer")
    return true
  }
}
