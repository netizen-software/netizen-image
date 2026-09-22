import type { ImageMetadata } from '../../shared/types'

export const METADATA_COPY_LIMIT = 10_000

export interface FormattedMetadata {
  text: string
  usedFallback: boolean
}

function toAscii(value: string): string {
  return value.replace(/[^\x20-\x7E]/g, '?')
}

function formatValue(value: unknown, visited = new WeakSet<object>()): string {
  if (typeof value === 'string') {
    return JSON.stringify(toAscii(value))
  }

  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint'
  ) {
    return String(value)
  }

  if (value === null || value === undefined) {
    return 'null'
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => formatValue(item, visited)).join(', ')}]`
  }

  if (typeof value === 'object') {
    if (visited.has(value)) {
      return '[Circular]'
    }

    visited.add(value)
    const formatted = Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${toAscii(key)}: ${formatValue(item, visited)}`)
      .join(', ')
    visited.delete(value)
    return `{ ${formatted} }`
  }

  return toAscii(String(value))
}

function formatAllFields(fields: Record<string, unknown>): string {
  const entries = Object.entries(fields).sort(([left], [right]) =>
    left.localeCompare(right)
  )

  if (entries.length === 0) {
    return 'No EXIF metadata available.'
  }

  return entries
    .map(([key, value]) => `${toAscii(key)}: ${formatValue(value)}`)
    .join('\n')
}

function findField(fields: Record<string, unknown>, names: string[]): unknown {
  return names
    .map((name) => fields[name])
    .find((value) => value !== undefined && value !== null)
}

function formatCuratedFields(metadata: ImageMetadata): string {
  const fields = metadata.fields
  const curatedFields: Array<[string, unknown]> = [
    ['File size', `${metadata.fileSize} bytes`],
    ['Format', findField(fields, ['FileType', 'MIMEType'])],
    ['Width', findField(fields, ['ImageWidth', 'ExifImageWidth', 'width'])],
    ['Height', findField(fields, ['ImageHeight', 'ExifImageHeight', 'height'])],
    ['Camera make', findField(fields, ['Make'])],
    ['Camera model', findField(fields, ['Model'])],
    [
      'Date taken',
      findField(fields, ['DateTimeOriginal', 'CreateDate', 'ModifyDate'])
    ],
    ['Latitude', findField(fields, ['latitude', 'GPSLatitude'])],
    ['Longitude', findField(fields, ['longitude', 'GPSLongitude'])]
  ]

  return curatedFields
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([label, value]) => `${label}: ${formatValue(value)}`)
    .join('\n')
}

export function formatMetadataCopy(metadata: ImageMetadata): FormattedMetadata {
  const fullText = formatAllFields(metadata.fields)

  if (fullText.length <= METADATA_COPY_LIMIT) {
    return { text: fullText, usedFallback: false }
  }

  return {
    text: formatCuratedFields(metadata).slice(0, METADATA_COPY_LIMIT),
    usedFallback: true
  }
}
