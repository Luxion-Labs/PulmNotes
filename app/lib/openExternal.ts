export const isTauriApp = (): boolean => {
  if (typeof window === "undefined") return false
  const w = window as any
  return Boolean(w.__TAURI_INTERNALS__ || w.__TAURI__)
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
