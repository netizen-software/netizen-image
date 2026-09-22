import type { LoadedImage } from '../../shared/types'

export interface Viewer {
  element: HTMLElement
  showImage: (image: LoadedImage) => void
  setZoom: (zoom: number) => void
}

export function createViewer(): Viewer {
  const element = document.createElement('section')
  element.className = 'viewer'
  element.hidden = true

  const image = document.createElement('img')
  image.className = 'viewer__image'
  image.alt = ''
  element.append(image)

  let zoom = 1
  let translateX = 0
  let translateY = 0
  let dragPointerId: number | undefined
  let dragStartX = 0
  let dragStartY = 0
  let dragOriginX = 0
  let dragOriginY = 0

  function updateTransform(): void {
    image.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoom})`
  }

  function endDrag(pointerId: number): void {
    if (dragPointerId !== pointerId) {
      return
    }

    if (element.hasPointerCapture(pointerId)) {
      element.releasePointerCapture(pointerId)
    }
    dragPointerId = undefined
    element.classList.remove('viewer--dragging')
  }

  element.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) {
      return
    }

    dragPointerId = event.pointerId
    dragStartX = event.clientX
    dragStartY = event.clientY
    dragOriginX = translateX
    dragOriginY = translateY
    element.setPointerCapture(event.pointerId)
    element.classList.add('viewer--dragging')
  })

  element.addEventListener('pointermove', (event) => {
    if (dragPointerId !== event.pointerId) {
      return
    }

    translateX = dragOriginX + event.clientX - dragStartX
    translateY = dragOriginY + event.clientY - dragStartY
    updateTransform()
  })

  element.addEventListener('pointerup', (event) => endDrag(event.pointerId))
  element.addEventListener('pointercancel', (event) => endDrag(event.pointerId))
  image.addEventListener('dragstart', (event) => event.preventDefault())

  return {
    element,
    showImage: (loadedImage) => {
      image.src = loadedImage.sourceUrl
      image.alt = loadedImage.fileName
      zoom = 1
      translateX = 0
      translateY = 0
      updateTransform()
      element.hidden = false
    },
    setZoom: (nextZoom) => {
      zoom = nextZoom
      updateTransform()
    }
  }
}
