import type { NetizenImageApi } from '../shared/types'

declare global {
  interface Window {
    netizenImage: NetizenImageApi
  }
}

export {}
