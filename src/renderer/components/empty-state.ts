export interface EmptyState {
  element: HTMLElement
  setMessage: (message: string) => void
}

export function createEmptyState(onBrowse: () => void): EmptyState {
  const element = document.createElement('section')
  element.className = 'empty-state'
  element.innerHTML = `
    <div class="empty-state__content">
      <p class="empty-state__eyebrow">Netizen Image Viewer</p>
      <h1>Open an image</h1>
      <p class="empty-state__message">Drop an image anywhere in this window or browse for one.</p>
      <button class="button" type="button">Browse...</button>
    </div>
  `

  const button = element.querySelector('button')
  button?.addEventListener('click', onBrowse)

  return {
    element,
    setMessage: (message) => {
      const status = element.querySelector('.empty-state__message')
      if (status) {
        status.textContent = message
      }
    }
  }
}
