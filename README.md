# Netizen Image Viewer

A minimal dark image viewer for Linux, built with Electron and TypeScript. It accepts an image path at launch, but is designed around a small, direct interface.

<img width="607" alt="image" src="https://github.com/user-attachments/assets/985075a7-d056-45e7-8c0c-ddf147dce5b1" />

## Features

- Opens images from the Browse dialog, drag and drop, or a file-path launch argument.
- Displays one image at a time with click-and-drag panning.
- Bounded zoom from 10% to 800% in predictable 10% increments.
- Supports fullscreen viewing and a panel for available EXIF metadata.
- Copies all available EXIF metadata as ASCII text; exceptionally large metadata falls back to a concise subset.
- Packages for Linux as an AppImage only.

## Controls

| Action            | Control                                         |
| ----------------- | ----------------------------------------------- |
| Zoom in           | `I`, mouse wheel up, or the zoom-in button      |
| Zoom out          | `O`, mouse wheel down, or the zoom-out button   |
| Pan image         | Click and drag, or arrow keys (10px increments) |
| Toggle fullscreen | `F` or the fullscreen button                    |
| Exit fullscreen   | `Escape`                                        |
| Toggle metadata   | Metadata button                                 |
| Quit              | `Q`                                             |

## Requirements

- Fedora `>= 26` or Ubuntu `>= 17.10`
- Node.js `24.21.0` (minimum: `22.12.0`)

*Note: This project was tested on Ubuntu 24.04 LTS*

## Run In Development

```bash
nvm use
npm install
npm run dev
```

To open an image on launch, run `npm run dev -- /path/to/image`; Browse and drag and drop are also available in the running application.

## Validate

```bash
npm run format
npm run typecheck
npm run lint
npm test
npm run test:e2e
```

## Build AppImage

```bash
nvm use
npm install
npm run package
```

The AppImage is written to `dist/Netizen-Image-Viewer-<version>-x86_64.AppImage`.

## License

This project is licensed under the **Unlicense** license.\
For more information, click [here](https://unlicense.org/).
