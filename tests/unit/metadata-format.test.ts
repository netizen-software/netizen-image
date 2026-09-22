import { describe, expect, it } from 'vitest'
import {
  METADATA_COPY_LIMIT,
  formatMetadataCopy
} from '../../src/renderer/lib/metadata-format'

describe('formatMetadataCopy', () => {
  it('copies every metadata field as ASCII text', () => {
    const result = formatMetadataCopy({
      fields: { Model: 'N?tz?n', ISO: 400, Nested: { Lens: '50mm' } },
      fileSize: 1024
    })

    expect(result.usedFallback).toBe(false)
    expect(result.text).toContain('ISO: 400')
    expect(result.text).toContain('Model: "N?tz?n"')
    expect(result.text).toContain('Nested: { Lens: "50mm" }')
  })

  it('uses a curated metadata subset when all fields exceed the copy limit', () => {
    const result = formatMetadataCopy({
      fields: {
        Make: 'Netizen',
        Model: 'Viewer',
        ImageWidth: 1920,
        ImageHeight: 1080,
        Comment: 'x'.repeat(METADATA_COPY_LIMIT + 1)
      },
      fileSize: 2048
    })

    expect(result.usedFallback).toBe(true)
    expect(result.text).toContain('File size: "2048 bytes"')
    expect(result.text).toContain('Camera make: "Netizen"')
    expect(result.text).not.toContain('Comment:')
    expect(result.text.length).toBeLessThanOrEqual(METADATA_COPY_LIMIT)
  })
})
