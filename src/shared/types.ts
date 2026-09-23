export const IPC_CHANNELS = {
  openImageDialog: 'image:open-dialog',
  loadDroppedImage: 'image:load-dropped',
  imageLoaded: 'image:loaded',
  toggleFullscreen: 'window:toggle-fullscreen',
  exitFullscreen: 'window:exit-fullscreen',
  quitApplication: 'app:quit',
  getImageMetadata: 'image:get-metadata',
  rendererReady: 'renderer:ready'
} as const

export interface LoadedImage {
  fileName: string
  filePath: string
  sourceUrl: string
}

export type ImageLoadResult =
  { ok: true; image: LoadedImage } | { ok: false; message: string }

export interface ImageMetadata {
  fields: Record<string, unknown>
  fileSize: number
}

export type ImageMetadataResult =
  { ok: true; metadata: ImageMetadata } | { ok: false; message: string }

export interface NetizenImageApi {
  openImageDialog: () => Promise<ImageLoadResult>
  toggleFullscreen: () => Promise<boolean>
  exitFullscreen: () => Promise<boolean>
  quitApplication: () => void
  getImageMetadata: (filePath: string) => Promise<ImageMetadataResult>
  notifyRendererReady: () => void
  onImageLoaded: (listener: (result: ImageLoadResult) => void) => () => void
}
