import {
  BrowserWindow,
  dialog,
  ipcMain,
  type OpenDialogOptions,
  type WebContents
} from 'electron'
import { loadImage } from '../file-loader'
import { IPC_CHANNELS, type ImageLoadResult } from '../../shared/types'

const imageFilters = [
  {
    name: 'Images',
    extensions: [
      'avif',
      'bmp',
      'gif',
      'jpeg',
      'jpg',
      'png',
      'tif',
      'tiff',
      'webp'
    ]
  }
]

function publishImageResult(
  webContents: WebContents,
  result: ImageLoadResult
): ImageLoadResult {
  webContents.send(IPC_CHANNELS.imageLoaded, result)
  return result
}

export function registerImageIpc(): void {
  ipcMain.handle(IPC_CHANNELS.openImageDialog, async (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    const options: OpenDialogOptions = {
      properties: ['openFile'],
      filters: imageFilters
    }
    const selection = window
      ? await dialog.showOpenDialog(window, options)
      : await dialog.showOpenDialog(options)

    if (selection.canceled || selection.filePaths.length === 0) {
      return { ok: false, message: 'No image was selected.' }
    }

    return publishImageResult(
      event.sender,
      await loadImage(selection.filePaths[0])
    )
  })

  ipcMain.handle(
    IPC_CHANNELS.loadDroppedImage,
    async (event, filePath: string) => {
      return publishImageResult(event.sender, await loadImage(filePath))
    }
  )
}

export function sendImageResult(
  webContents: WebContents,
  result: ImageLoadResult
): void {
  publishImageResult(webContents, result)
}
