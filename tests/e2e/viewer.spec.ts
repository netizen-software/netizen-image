import {
  _electron as electron,
  expect,
  test,
  type ElectronApplication,
  type Page
} from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const onePixelPng =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL9zQAAAABJRU5ErkJggg=='
const fixturePath = join(process.cwd(), 'test-results', 'viewer-fixture.png')

let electronApp: ElectronApplication
let window: Page

test.beforeAll(async () => {
  await mkdir(join(process.cwd(), 'test-results'), { recursive: true })
  await writeFile(fixturePath, Buffer.from(onePixelPng, 'base64'))
  electronApp = await electron.launch({
    args: [join(process.cwd(), 'out', 'main', 'index.js'), fixturePath]
  })
  window = await electronApp.firstWindow()
  await window.locator('.viewer__image').waitFor()
})

test.afterAll(async () => {
  await electronApp.close()
})

test('loads an image and supports its viewer controls', async () => {
  await expect(window.locator('.viewer__image')).toBeVisible()
  await expect
    .poll(() => electronApp.evaluate(({ Menu }) => Menu.getApplicationMenu()))
    .toBeNull()

  await window.getByRole('button', { name: 'Zoom in' }).click()
  await expect(window.locator('.toolbar__zoom')).toHaveText('110%')
  const viewer = window.locator('.viewer')
  await expect(viewer).toHaveCSS('overflow', 'hidden')
  const bounds = await viewer.boundingBox()
  if (!bounds) {
    throw new Error('Viewer bounds are unavailable.')
  }

  await window.mouse.move(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2
  )
  await window.mouse.down()
  await window.mouse.move(
    bounds.x + bounds.width / 2 + 40,
    bounds.y + bounds.height / 2 + 24
  )
  await window.mouse.up()
  await expect(window.locator('.viewer__image')).toHaveCSS(
    'transform',
    'matrix(1.1, 0, 0, 1.1, 40, 24)'
  )

  await window.mouse.wheel(0, 100)
  await expect(window.locator('.toolbar__zoom')).toHaveText('100%')
  await window.mouse.wheel(0, -100)
  await expect(window.locator('.toolbar__zoom')).toHaveText('110%')

  await window.keyboard.press('O')
  await expect(window.locator('.toolbar__zoom')).toHaveText('100%')

  await window.keyboard.press('F')
  await expect
    .poll(() =>
      electronApp.evaluate(({ BrowserWindow }) =>
        BrowserWindow.getAllWindows()[0].isFullScreen()
      )
    )
    .toBe(true)
  await window.getByRole('button', { name: 'Toggle fullscreen' }).click()
  await expect
    .poll(() =>
      electronApp.evaluate(({ BrowserWindow }) =>
        BrowserWindow.getAllWindows()[0].isFullScreen()
      )
    )
    .toBe(false)

  await window.getByRole('button', { name: 'Toggle metadata' }).click()
  await expect(window.locator('.metadata-panel')).toBeVisible()
  await window.getByRole('button', { name: 'Copy metadata' }).click()
})
