import { useState, useCallback, useRef, useEffect } from 'react'
import { Relay } from 'nostr-tools/relay'
import type { Event, Filter } from 'nostr-tools'
import type { RelayConnection, NostrEvent } from '../types'

interface UseNostrRelayReturn {
  connection: RelayConnection
  events: NostrEvent[]
  connect: (url: string) => Promise<void>
  disconnect: () => void
  subscribe: (filter: Filter) => void
  clearEvents: () => void
  publish: (event: Event) => Promise<void>
}

export function useNostrRelay(): UseNostrRelayReturn {
  const [connection, setConnection] = useState<RelayConnection>({
    url: '',
    status: 'disconnected'
  })
  const [events, setEvents] = useState<NostrEvent[]>([])
  const relayRef = useRef<Relay | null>(null)
  const subRef = useRef<{ close: () => void } | null>(null)

  const clearEvents = useCallback(() => {
    setEvents([])
  }, [])

  const disconnect = useCallback(() => {
    if (subRef.current) {
      subRef.current.close()
      subRef.current = null
    }
    if (relayRef.current) {
      relayRef.current.close()
      relayRef.current = null
    }
    setConnection({ url: '', status: 'disconnected' })
    setEvents([])
  }, [])

  const connect = useCallback(async (url: string) => {
    // Disconnect existing connection
    disconnect()

    setConnection({ url, status: 'connecting' })

    try {
      const relay = await Relay.connect(url)
      relayRef.current = relay
      setConnection({ url, status: 'connected' })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setConnection({ url, status: 'error', error: errorMessage })
    }
  }, [disconnect])

  const subscribe = useCallback((filter: Filter) => {
    if (!relayRef.current || connection.status !== 'connected') {
      return
    }

    // Close existing subscription
    if (subRef.current) {
      subRef.current.close()
    }

    // Clear existing events when filter changes
    setEvents([])

    const sub = relayRef.current.subscribe([filter], {
      onevent(event: Event) {
        setEvents(prev => {
          // Prevent duplicates
          if (prev.some(e => e.id === event.id)) return prev
          // Add new event and sort by timestamp (newest first)
          return [...prev, event].sort((a, b) => b.created_at - a.created_at)
        })
      },
      oneose() {
        console.log('End of stored events, now streaming real-time')
      }
    })

    subRef.current = sub
  }, [connection.status])

  const publish = useCallback(async (event: Event) => {
    if (!connection.url) {
      throw new Error('Not connected to a relay')
    }

    // Reconnect if the underlying connection has been closed
    if (!relayRef.current || !relayRef.current.connected) {
      try {
        const relay = await Relay.connect(connection.url)
        relayRef.current = relay
        setConnection(prev => ({ ...prev, status: 'connected' }))
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Reconnection failed'
        setConnection(prev => ({ ...prev, status: 'error', error: errorMessage }))
        throw new Error(errorMessage)
      }
    }

    await relayRef.current.publish(event)
  }, [connection.url])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    connection,
    events,
    connect,
    disconnect,
    subscribe,
    clearEvents,
    publish
  }
}
