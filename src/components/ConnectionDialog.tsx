import { useState } from 'react'
import type { RelayConnection } from '../types'

interface ConnectionDialogProps {
  connection: RelayConnection
  onConnect: (url: string) => Promise<void>
  onDisconnect: () => void
}

export function ConnectionDialog({ connection, onConnect, onDisconnect }: ConnectionDialogProps) {
  const [url, setUrl] = useState('wss://relay.primal.net')
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    if (!url.trim()) return
    setIsConnecting(true)
    await onConnect(url.trim())
    setIsConnecting(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConnect()
    }
  }

  if (connection.status === 'connected') {
    return (
      <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-green-400 font-medium">Connected to:</span>
            <span className="ml-2 text-gray-300">{connection.url}</span>
          </div>
          <button
            onClick={onDisconnect}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Disconnect
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4">Connect to NOSTR Relay</h2>

        <div className="mb-4">
          <label className="block text-gray-300 text-sm mb-2">
            Relay WSS Address
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="wss://relay.example.com"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            disabled={isConnecting}
          />
        </div>

        {connection.status === 'error' && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-md">
            <p className="text-red-400 text-sm">{connection.error}</p>
          </div>
        )}

        <button
          onClick={handleConnect}
          disabled={isConnecting || !url.trim()}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors"
        >
          {isConnecting ? 'Connecting...' : 'Connect'}
        </button>

        <p className="mt-4 text-gray-400 text-xs">
          Popular relays: wss://relay.damus.io, wss://relay.nostr.band, wss://nos.lol
        </p>
      </div>
    </div>
  )
}
