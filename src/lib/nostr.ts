import { nip19 } from 'nostr-tools'
import { finalizeEvent, getPublicKey } from 'nostr-tools/pure'
import type { VerifiedEvent } from 'nostr-tools/pure'

export function decodeNpub(npubOrHex: string): string | null {
  if (!npubOrHex) return null

  // If it's already hex (64 chars), return as-is
  if (/^[0-9a-f]{64}$/i.test(npubOrHex)) {
    return npubOrHex.toLowerCase()
  }

  // Try to decode as npub
  try {
    const decoded = nip19.decode(npubOrHex)
    if (decoded.type === 'npub') {
      return decoded.data
    }
  } catch {
    // Invalid npub
  }

  return null
}

export function formatTimestamp(unixTimestamp: number): string {
  return new Date(unixTimestamp * 1000).toLocaleString()
}

export function decodeNsec(nsec: string): Uint8Array | null {
  try {
    const decoded = nip19.decode(nsec)
    if (decoded.type === 'nsec') {
      return decoded.data
    }
  } catch {
    // Invalid nsec
  }
  return null
}

export function createKind30078Event(
  secretKey: Uint8Array,
  content: string,
  extraTags: string[][] = []
): VerifiedEvent {
  const dTag = `post-${Date.now()}`

  const eventTemplate = {
    kind: 30078,
    created_at: Math.floor(Date.now() / 1000),
    tags: [['d', dTag], ...extraTags],
    content,
  }

  return finalizeEvent(eventTemplate, secretKey)
}

export function getPublicKeyFromSecret(secretKey: Uint8Array): string {
  return getPublicKey(secretKey)
}
