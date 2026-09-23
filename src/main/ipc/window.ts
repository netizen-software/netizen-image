import { BrowserWindow, ipcMain } from 'electron'
import { IPC_CHANNELS } from '../../shared/types'

export function registerWindowIpc(): void {
  ipcMain.handle(IPC_CHANNELS.toggleFullscreen, (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)

    if (!window) {
      return false
    }

    window.setFullScreen(!window.isFullScreen())
    return window.isFullScreen()
  })
}
