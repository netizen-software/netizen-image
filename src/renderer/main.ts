import { createEmptyState } from './components/empty-state'
import { createMetadataPanel } from './components/metadata-panel'
import { createToolbar } from './components/toolbar'
import { createViewer } from './components/viewer'
import { clampZoom, type ZoomDirection } from './lib/zoom'
import type { LoadedImage } from '../shared/types'
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
let currentImage: LoadedImage | undefined
const metadataPanel = createMetadataPanel()
const toolbar = createToolbar({
  onZoomIn: () => adjustZoom('in'),
  onZoomOut: () => adjustZoom('out'),
  onToggleFullscreen: () => {
    void window.netizenImage.toggleFullscreen()
  },
  onToggleMetadata: () => {
    void toggleMetadata()
  }
})

app.append(
  emptyState.element,
  viewer.element,
  toolbar.element,
  metadataPanel.element
)

function adjustZoom(direction: ZoomDirection): void {
  const nextZoom = clampZoom(zoom, direction)

  if (nextZoom === zoom) {
    return
  }

  zoom = nextZoom
  viewer.setZoom(zoom)
  toolbar.setZoomLabel(zoom)
}

async function toggleMetadata(): Promise<void> {
  if (!metadataPanel.toggle()) {
    return
  }

  if (!currentImage) {
    metadataPanel.setError('Open an image to view metadata.')
    return
  }

  const requestedPath = currentImage.filePath
  metadataPanel.setLoading()
  const result = await window.netizenImage.getImageMetadata(requestedPath)

  if (currentImage?.filePath !== requestedPath) {
    return
  }

  if (result.ok) {
    metadataPanel.showMetadata(result.metadata)
  } else {
    metadataPanel.setError(result.message)
  }
}

window.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'i') {
    adjustZoom('in')
  }

  if (event.key.toLowerCase() === 'o') {
    adjustZoom('out')
  }

  if (event.key.toLowerCase() === 'f') {
    void window.netizenImage.toggleFullscreen()
  }
})

window.netizenImage.onImageLoaded((result) => {
  if (result.ok) {
    zoom = 1
    currentImage = result.image
    emptyState.element.hidden = true
    metadataPanel.hide()
    viewer.showImage(result.image)
    toolbar.setZoomLabel(zoom)
    toolbar.element.hidden = false
  } else if (result.message !== 'No image was selected.') {
    emptyState.setMessage(result.message)
  }
})
