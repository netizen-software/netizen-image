export interface Toolbar {
  element: HTMLElement
  setZoomLabel: (zoom: number) => void
}

interface ToolbarHandlers {
  onZoomIn: () => void
  onZoomOut: () => void
}

export function createToolbar(handlers: ToolbarHandlers): Toolbar {
  const element = document.createElement('header')
  element.className = 'toolbar'
  element.hidden = true
  element.innerHTML = `
    <div class="toolbar__group" aria-label="Zoom controls">
      <button class="icon-button" type="button" aria-label="Zoom out" title="Zoom out (O)">-</button>
      <output class="toolbar__zoom" aria-live="polite">100%</output>
      <button class="icon-button" type="button" aria-label="Zoom in" title="Zoom in (I)">+</button>
    </div>
  `

  const buttons = element.querySelectorAll<HTMLButtonElement>('button')
  buttons[0]?.addEventListener('click', handlers.onZoomOut)
  buttons[1]?.addEventListener('click', handlers.onZoomIn)

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
