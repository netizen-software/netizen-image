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

  return {
    element,
    showImage: (loadedImage) => {
      image.src = loadedImage.sourceUrl
      image.alt = loadedImage.fileName
      image.style.transform = 'scale(1)'
      element.hidden = false
    },
    setZoom: (zoom) => {
      image.style.transform = `scale(${zoom})`
    }
  }
}
