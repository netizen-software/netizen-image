import { contextBridge, ipcRenderer, webUtils } from 'electron'
import {
  IPC_CHANNELS,
  type ImageLoadResult,
  type NetizenImageApi
} from '../shared/types'

const api: NetizenImageApi = {
  openImageDialog: () => ipcRenderer.invoke(IPC_CHANNELS.openImageDialog),
  toggleFullscreen: () => ipcRenderer.invoke(IPC_CHANNELS.toggleFullscreen),
  getImageMetadata: (filePath) =>
    ipcRenderer.invoke(IPC_CHANNELS.getImageMetadata, filePath),
  notifyRendererReady: () => ipcRenderer.send(IPC_CHANNELS.rendererReady),
  onImageLoaded: (listener) => {
    const handler = (
      _event: Electron.IpcRendererEvent,
      result: ImageLoadResult
    ) => listener(result)
    ipcRenderer.on(IPC_CHANNELS.imageLoaded, handler)
    return () => ipcRenderer.removeListener(IPC_CHANNELS.imageLoaded, handler)
  }
}

window.addEventListener('dragover', (event) => event.preventDefault())
window.addEventListener('drop', (event) => {
  event.preventDefault()
  const file = event.dataTransfer?.files[0]

  if (file) {
    void ipcRenderer.invoke(
      IPC_CHANNELS.loadDroppedImage,
      webUtils.getPathForFile(file)
    )
  }
})

contextBridge.exposeInMainWorld('netizenImage', api)
