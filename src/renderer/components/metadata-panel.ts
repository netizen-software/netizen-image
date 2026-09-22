import type { ImageMetadata } from '../../shared/types'
import { createIcons, Copy, X } from 'lucide'
import { formatMetadataCopy } from '../lib/metadata-format'

export interface MetadataPanel {
  element: HTMLElement
  hide: () => void
  setError: (message: string) => void
  setLoading: () => void
  showMetadata: (metadata: ImageMetadata) => void
  toggle: () => boolean
}

export function createMetadataPanel(): MetadataPanel {
  const element = document.createElement('aside')
  element.className = 'metadata-panel'
  element.hidden = true
  element.innerHTML = `
    <header class="metadata-panel__header">
      <h2>Metadata</h2>
      <div class="metadata-panel__actions">
        <button class="icon-button" type="button" aria-label="Copy metadata" title="Copy metadata as ASCII text"><i data-lucide="copy"></i></button>
        <button class="icon-button" type="button" aria-label="Close metadata" title="Close metadata"><i data-lucide="x"></i></button>
      </div>
    </header>
    <p class="metadata-panel__status" aria-live="polite"></p>
    <pre class="metadata-panel__content"></pre>
  `

  createIcons({ icons: { Copy, X }, root: element })

  let copyText = ''
  const content = element.querySelector<HTMLElement>('.metadata-panel__content')
  const status = element.querySelector<HTMLElement>('.metadata-panel__status')

  element
    .querySelector<HTMLButtonElement>('[aria-label="Close metadata"]')
    ?.addEventListener('click', () => {
      element.hidden = true
    })
  element
    .querySelector<HTMLButtonElement>('[aria-label="Copy metadata"]')
    ?.addEventListener('click', () => {
      void navigator.clipboard.writeText(copyText).then(
        () => setStatus('Metadata copied.'),
        () => setStatus('Metadata could not be copied.')
      )
    })

  function setStatus(message: string): void {
    if (status) {
      status.textContent = message
    }
  }

  return {
    element,
    hide: () => {
      element.hidden = true
    },
    setError: (message) => {
      copyText = ''
      if (content) {
        content.textContent = ''
      }
      setStatus(message)
    },
    setLoading: () => {
      copyText = ''
      if (content) {
        content.textContent = ''
      }
      setStatus('Loading metadata...')
    },
    showMetadata: (metadata) => {
      const formatted = formatMetadataCopy(metadata)
      copyText = formatted.text
      if (content) {
        content.textContent = formatted.text
      }
      setStatus(
        formatted.usedFallback
          ? 'Showing and copying a curated metadata subset.'
          : ''
      )
    },
    toggle: () => {
      element.hidden = !element.hidden
      return !element.hidden
    }
  }
}
