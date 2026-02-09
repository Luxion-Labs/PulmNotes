"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { TiptapCollabProvider } from "@tiptap-pro/provider"
import { Doc as YDoc } from "yjs"
import {
  fetchCollabToken,
  getUrlParam,
  TIPTAP_COLLAB_DOC_PREFIX,
  TIPTAP_COLLAB_APP_ID,
} from "@/lib/tiptap-collab-utils"

export type CollabContextValue = {
  provider: TiptapCollabProvider | null
  ydoc: YDoc
  hasCollab: boolean
}

export const CollabContext = createContext<CollabContextValue>({
  hasCollab: false,
  provider: null,
  ydoc: new YDoc(),
})

export const CollabConsumer = CollabContext.Consumer
export const useCollab = (): CollabContextValue => {
  const context = useContext(CollabContext)
  if (!context) {
    throw new Error("useCollab must be used within an CollabProvider")
  }
  return context
}

export const useCollaboration = (room: string) => {
  const [provider, setProvider] = useState<TiptapCollabProvider | null>(null)
  const [collabToken, setCollabToken] = useState<string | null>(null)
  const [hasCollab, setHasCollab] = useState<boolean>(true)
  const ydoc = useMemo(() => new YDoc(), [])

  useEffect(() => {
    const noCollabParam = getUrlParam("noCollab")
    setHasCollab(parseInt(noCollabParam || "0") !== 1)
  }, [])

  useEffect(() => {
    if (!hasCollab) return

    const getToken = async () => {
      const token = await fetchCollabToken()
      setCollabToken(token)
    }

    getToken()
  }, [hasCollab])

  useEffect(() => {
    if (!hasCollab || !collabToken) return

    const docPrefix = TIPTAP_COLLAB_DOC_PREFIX
    const documentName = room ? `${docPrefix}${room}` : docPrefix
    const appId = TIPTAP_COLLAB_APP_ID

    const newProvider = new TiptapCollabProvider({
      name: documentName,
      appId,
      token: collabToken,
      document: ydoc,
    })

    setProvider(newProvider)

    return () => {
      newProvider.destroy()
    }
  }, [collabToken, ydoc, room, hasCollab])

  return { provider, ydoc, hasCollab }
}

export function CollabProvider({
  children,
  room,
}: Readonly<{
  children: React.ReactNode
  room: string
}>) {
  const { hasCollab, provider, ydoc } = useCollaboration(room)

  const value = useMemo<CollabContextValue>(
    () => ({
      hasCollab,
      provider,
      ydoc,
    }),
    [hasCollab, provider, ydoc]
  )

  return (
    <CollabContext.Provider value={value}>{children}</CollabContext.Provider>
  )
}
