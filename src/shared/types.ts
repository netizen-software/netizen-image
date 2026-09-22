export const IPC_CHANNELS = {
  openImageDialog: 'image:open-dialog',
  loadDroppedImage: 'image:load-dropped',
  imageLoaded: 'image:loaded',
  toggleFullscreen: 'window:toggle-fullscreen'
} as const

export interface LoadedImage {
  fileName: string
  filePath: string
  sourceUrl: string
}

export type ImageLoadResult =
  { ok: true; image: LoadedImage } | { ok: false; message: string }

export interface NetizenImageApi {
  openImageDialog: () => Promise<ImageLoadResult>
  toggleFullscreen: () => Promise<boolean>
  onImageLoaded: (listener: (result: ImageLoadResult) => void) => () => void
}
