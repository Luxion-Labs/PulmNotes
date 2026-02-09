import { mergeAttributes, Node } from "@tiptap/react"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { VideoUploadNode as VideoUploadNodeComponent } from "@/components/tiptap-node/video-upload-node/video-upload-node"
import type { NodeType } from "@tiptap/pm/model"

export type VideoUploadFunction = (
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal
) => Promise<string>

export interface VideoUploadNodeOptions {
  /**
   * The type of the node.
   * @default 'videoUpload'
   */
  type?: string | NodeType | undefined
  /**
   * Acceptable file types for upload.
   * @default 'video/*'
   */
  accept?: string
  /**
   * Maximum number of files that can be uploaded.
   * @default 1
   */
  limit?: number
  /**
   * Maximum file size in bytes (0 for unlimited).
   * @default 0
   */
  maxSize?: number
  /**
   * Function to handle the upload process.
   */
  upload?: VideoUploadFunction
  /**
   * Callback for upload errors.
   */
  onError?: (error: Error) => void
  /**
   * Callback for successful uploads.
   */
  onSuccess?: (url: string) => void
}

/**
 * VideoUploadNode Extension for TipTap
 * Allows users to upload videos and embed them in the editor
 */
export const VideoUploadNodeExtension = Node.create<VideoUploadNodeOptions>({
  name: "videoUploadNode",

  group: "block",

  selectable: true,

  draggable: true,

  atom: true,

  addOptions() {
    return {
      type: "videoUploadNode",
      accept: "video/*",
      limit: 1,
      maxSize: 0,
      upload: undefined,
      onError: undefined,
      onSuccess: undefined,
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => element.getAttribute("src"),
        renderHTML: (attributes) => ({
          src: attributes.src,
        }),
      },
      alt: {
        default: null,
        parseHTML: (element) => element.getAttribute("alt"),
        renderHTML: (attributes) => ({
          alt: attributes.alt,
        }),
      },
      title: {
        default: null,
        parseHTML: (element) => element.getAttribute("title"),
        renderHTML: (attributes) => ({
          title: attributes.title,
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "video-upload-node",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "video-upload-node",
      mergeAttributes(this.options as any, HTMLAttributes),
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoUploadNodeComponent)
  },
})
