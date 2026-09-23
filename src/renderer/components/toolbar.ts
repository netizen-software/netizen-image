import { createIcons, Maximize, Minus, Plus } from 'lucide'

export interface Toolbar {
  element: HTMLElement
  setZoomLabel: (zoom: number) => void
}

interface ToolbarHandlers {
  onZoomIn: () => void
  onZoomOut: () => void
  onToggleFullscreen: () => void
}

export function createToolbar(handlers: ToolbarHandlers): Toolbar {
  const element = document.createElement('header')
  element.className = 'toolbar'
  element.hidden = true
  element.innerHTML = `
    <div class="toolbar__group" aria-label="Zoom controls">
      <button class="icon-button" type="button" aria-label="Zoom out" title="Zoom out (O)"><i data-lucide="minus"></i></button>
      <output class="toolbar__zoom" aria-live="polite">100%</output>
      <button class="icon-button" type="button" aria-label="Zoom in" title="Zoom in (I)"><i data-lucide="plus"></i></button>
    </div>
    <button class="icon-button toolbar__fullscreen" type="button" aria-label="Toggle fullscreen" title="Toggle fullscreen (F)"><i data-lucide="maximize"></i></button>
  `

  createIcons({ icons: { Maximize, Minus, Plus }, root: element })

  element
    .querySelector<HTMLButtonElement>('[aria-label="Zoom out"]')
    ?.addEventListener('click', handlers.onZoomOut)
  element
    .querySelector<HTMLButtonElement>('[aria-label="Zoom in"]')
    ?.addEventListener('click', handlers.onZoomIn)
  element
    .querySelector<HTMLButtonElement>('[aria-label="Toggle fullscreen"]')
    ?.addEventListener('click', handlers.onToggleFullscreen)

  return {
    element,
    setZoomLabel: (zoom) => {
      const output = element.querySelector<HTMLOutputElement>('.toolbar__zoom')
      if (output) {
        output.value = `${Math.round(zoom * 100)}%`
        output.textContent = output.value
      }
    }
  }
}
