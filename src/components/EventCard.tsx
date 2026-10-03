import type { NostrEvent } from '../types'
import { formatTimestamp } from '../lib/nostr'
import { COMMON_KINDS } from '../lib/kinds'

interface EventCardProps {
  event: NostrEvent
}

export function EventCard({ event }: EventCardProps) {
  const kindInfo = COMMON_KINDS.find(k => k.kind === event.kind)
  const kindName = kindInfo?.name || `Kind ${event.kind}`
  const eventType = event.tags.find(tag => tag[0] === 'event_type')?.[1]

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="px-2 py-1 bg-blue-600 text-xs rounded font-medium">
            {kindName}
          </span>
          <span className="text-gray-400 text-xs">
            Kind {event.kind}
          </span>
          {eventType && (
            <span className="px-2 py-1 bg-purple-600 text-xs rounded font-medium">
              {eventType}
            </span>
          )}
        </div>
        <span className="text-gray-500 text-xs">
          {formatTimestamp(event.created_at)}
        </span>
      </div>

      <div className="mb-2">
        <span className="text-gray-400 text-xs">Author: </span>
        <span className="text-gray-300 text-xs font-mono break-all">
          {event.pubkey}
        </span>
      </div>

      <details className="mt-3">
        <summary className="cursor-pointer text-gray-400 text-sm hover:text-gray-300">
          View Full JSON
        </summary>
        <pre className="mt-2 p-3 bg-gray-900 rounded text-xs text-gray-300 overflow-x-auto">
          {JSON.stringify(event, null, 2)}
        </pre>
      </details>
    </div>
  )
}
