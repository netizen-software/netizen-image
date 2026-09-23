export const MIN_ZOOM = 0.1
export const MAX_ZOOM = 8
export const ZOOM_STEP = 0.1

export type ZoomDirection = 'in' | 'out'

export function clampZoom(
  currentZoom: number,
  direction: ZoomDirection
): number {
  const nextZoom =
    direction === 'in' ? currentZoom + ZOOM_STEP : currentZoom - ZOOM_STEP
  const clampedZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom))

  return Number(clampedZoom.toFixed(1))
}
