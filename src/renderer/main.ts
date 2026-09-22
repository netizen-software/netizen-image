import { createEmptyState } from './components/empty-state'
import { createViewer } from './components/viewer'
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

app.append(emptyState.element, viewer.element)

window.netizenImage.onImageLoaded((result) => {
  if (result.ok) {
    emptyState.element.hidden = true
    viewer.showImage(result.image)
  } else if (result.message !== 'No image was selected.') {
    emptyState.setMessage(result.message)
  }
})
