import { app, BrowserWindow } from 'electron'
import { existsSync } from 'node:fs'
import { loadImage } from './file-loader'
import { registerImageIpc, sendImageResult } from './ipc/dialog'
import { registerWindowIpc } from './ipc/window'
import { createMainWindow } from './window'

let mainWindow: BrowserWindow | undefined

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
    registerWindowIpc()
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
    (argument) => !argument.startsWith('-') && existsSync(argument)
  )

  if (filePath && mainWindow) {
    sendImageResult(mainWindow.webContents, await loadImage(filePath))
  }
}
