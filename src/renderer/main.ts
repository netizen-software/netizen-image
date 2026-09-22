import { createEmptyState } from './components/empty-state'
import { createToolbar } from './components/toolbar'
import { createViewer } from './components/viewer'
import { clampZoom, type ZoomDirection } from './lib/zoom'
import './style/theme.css'
import './style/app.css'

const app = document.querySelector<HTMLElement>('#app')

if (!app) {
  throw new Error('Application root is unavailable.')
}

const emptyState = createEmptyState(() => {
  void window.netizenImage.openImageDialog()
})
const viewer = createViewer()
let zoom = 1
const toolbar = createToolbar({
  onZoomIn: () => adjustZoom('in'),
  onZoomOut: () => adjustZoom('out')
})

app.append(emptyState.element, viewer.element, toolbar.element)

function adjustZoom(direction: ZoomDirection): void {
  const nextZoom = clampZoom(zoom, direction)

  if (nextZoom === zoom) {
    return
  }

  zoom = nextZoom
  viewer.setZoom(zoom)
  toolbar.setZoomLabel(zoom)
}

window.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'i') {
    adjustZoom('in')
  }

  if (event.key.toLowerCase() === 'o') {
    adjustZoom('out')
  }
})

window.netizenImage.onImageLoaded((result) => {
  if (result.ok) {
    zoom = 1
    emptyState.element.hidden = true
    viewer.showImage(result.image)
    toolbar.setZoomLabel(zoom)
    toolbar.element.hidden = false
  } else if (result.message !== 'No image was selected.') {
    emptyState.setMessage(result.message)
  }
})
