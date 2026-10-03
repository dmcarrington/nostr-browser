import { useEffect, useState, useCallback } from 'react'
import { useNostrRelay } from './hooks/useNostrRelay'
import { ConnectionDialog } from './components/ConnectionDialog'
import { EventList } from './components/EventList'
import { KindFilter } from './components/KindFilter'
import { NpubFilter } from './components/NpubFilter'
import { PostJsonTab } from './components/PostJsonTab'
import type { Filter } from 'nostr-tools'

function App() {
  const { connection, events, connect, disconnect, subscribe, publish } = useNostrRelay()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedKind, setSelectedKind] = useState(-1) // -1 = all kinds
  const [npubFilter, setNpubFilter] = useState('')
  const [activeTab, setActiveTab] = useState<'browse' | 'post'>('browse')

  const applyFilters = useCallback(() => {
    if (connection.status !== 'connected') return

    setIsLoading(true)

    const filter: Filter = { limit: 50000 }

    // Apply kind filter
    if (selectedKind >= 0) {
      filter.kinds = [selectedKind]
    }

    // Apply npub filter
    if (npubFilter) {
      filter.authors = [npubFilter]
    }

    subscribe(filter)

    // Give it a moment to receive initial events
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [connection.status, selectedKind, npubFilter, subscribe])

  // Apply filters when they change or when connected
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const handleKindChange = (kind: number) => {
    setSelectedKind(kind)
  }

  const handleNpubChange = (pubkey: string) => {
    setNpubFilter(pubkey)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-700 p-4">
        <h1 className="text-2xl font-bold">NOSTR Relay Browser</h1>
      </header>

      <main className="container mx-auto p-4 max-w-4xl">
        {connection.status !== 'connected' && (
          <ConnectionDialog
            connection={connection}
            onConnect={connect}
            onDisconnect={disconnect}
          />
        )}

        {connection.status === 'connected' && (
          <>
            <ConnectionDialog
              connection={connection}
              onConnect={connect}
              onDisconnect={disconnect}
            />

            <div className="flex border-b border-gray-700 mt-4">
              <button
                onClick={() => setActiveTab('browse')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'browse'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Browse
              </button>
              <button
                onClick={() => setActiveTab('post')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'post'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Post JSON
              </button>
            </div>

            {activeTab === 'browse' && (
              <>
                <div className="mt-4 p-4 bg-gray-800 border border-gray-700 rounded-lg">
                  <div className="flex flex-col md:flex-row gap-4">
                    <KindFilter
                      selectedKind={selectedKind}
                      onChange={handleKindChange}
                    />
                    <NpubFilter
                      value={npubFilter}
                      onChange={handleNpubChange}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <EventList events={events} isLoading={isLoading} />
                </div>
              </>
            )}

            {activeTab === 'post' && (
              <PostJsonTab onPublish={publish} />
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default App
