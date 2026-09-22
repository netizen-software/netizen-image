import { ipcMain } from 'electron'
import * as exifr from 'exifr'
import { stat } from 'node:fs/promises'
import { loadImage } from '../file-loader'
import { IPC_CHANNELS, type ImageMetadataResult } from '../../shared/types'

export function registerMetadataIpc(): void {
  ipcMain.handle(
    IPC_CHANNELS.getImageMetadata,
    async (_event, filePath: string) => {
      const image = await loadImage(filePath)

      if (!image.ok) {
        return {
          ok: false,
          message: image.message
        } satisfies ImageMetadataResult
      }

      try {
        const [metadata, file] = await Promise.all([
          exifr.parse(filePath, true),
          stat(filePath)
        ])
        return {
          ok: true,
          metadata: {
            fields: metadata ?? {},
            fileSize: file.size
          }
        } satisfies ImageMetadataResult
      } catch {
        return {
          ok: false,
          message: 'Metadata could not be read from this image.'
        } satisfies ImageMetadataResult
      }
    }
  )
}
