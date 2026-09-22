import { app, BrowserWindow, ipcMain } from 'electron'
import { existsSync } from 'node:fs'
import { IPC_CHANNELS } from '../shared/types'
import { isSupportedImagePath, loadImage } from './file-loader'
import { registerImageIpc, sendImageResult } from './ipc/dialog'
import { registerMetadataIpc } from './ipc/metadata'
import { registerWindowIpc } from './ipc/window'
import { createMainWindow } from './window'

let mainWindow: BrowserWindow | undefined
let pendingLaunchImage: string | undefined
let rendererIsReady = false

const hasSingleInstanceLock = app.requestSingleInstanceLock()

if (!hasSingleInstanceLock) {
  app.quit()
} else {
  app.on('second-instance', (_event, commandLine) => {
    mainWindow?.focus()
    void loadLaunchImage(commandLine)
  })

  app.whenReady().then(() => {
    registerImageIpc()
    registerMetadataIpc()
    registerWindowIpc()
    ipcMain.on(IPC_CHANNELS.rendererReady, (event) => {
      if (event.sender === mainWindow?.webContents) {
        rendererIsReady = true
        void sendPendingLaunchImage()
      }
    })
    mainWindow = createMainWindow()
    mainWindow.webContents.once('did-finish-load', () => {
      void loadLaunchImage(process.argv)
    })

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        mainWindow = createMainWindow()
      }
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}

async function loadLaunchImage(commandLine: string[]): Promise<void> {
  const filePath = commandLine.find(
    (argument) =>
      !argument.startsWith('-') &&
      isSupportedImagePath(argument) &&
      existsSync(argument)
  )

  if (filePath) {
    pendingLaunchImage = filePath
    await sendPendingLaunchImage()
  }
}

async function sendPendingLaunchImage(): Promise<void> {
  if (!pendingLaunchImage || !mainWindow || !rendererIsReady) {
    return
  }

  const filePath = pendingLaunchImage
  pendingLaunchImage = undefined
  sendImageResult(mainWindow.webContents, await loadImage(filePath))
}
