import { stat } from 'node:fs/promises'
import { basename, extname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { ImageLoadResult } from '../shared/types'

const SUPPORTED_EXTENSIONS = new Set([
  '.avif',
  '.bmp',
  '.gif',
  '.jpeg',
  '.jpg',
  '.png',
  '.tif',
  '.tiff',
  '.webp'
])

export async function loadImage(filePath: string): Promise<ImageLoadResult> {
  const resolvedPath = resolve(filePath)
  const extension = extname(resolvedPath).toLowerCase()

  if (!SUPPORTED_EXTENSIONS.has(extension)) {
    return { ok: false, message: 'Choose a supported image file.' }
  }

  try {
    const file = await stat(resolvedPath)

    if (!file.isFile()) {
      return { ok: false, message: 'Choose an image file, not a folder.' }
    }
  } catch {
    return { ok: false, message: 'The selected image could not be read.' }
  }

  return {
    ok: true,
    image: {
      fileName: basename(resolvedPath),
      filePath: resolvedPath,
      sourceUrl: pathToFileURL(resolvedPath).href
    }
  }
}
