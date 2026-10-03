import type { Event } from 'nostr-tools'

export interface RelayConnection {
  url: string
  status: 'disconnected' | 'connecting' | 'connected' | 'error'
  error?: string
}

export interface NostrEvent extends Event {}

export interface FilterState {
  kinds: number[]
  npub: string
}
