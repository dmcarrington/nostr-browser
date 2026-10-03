import type { NostrEvent } from '../types'
import { EventCard } from './EventCard'

interface EventListProps {
  events: NostrEvent[]
  isLoading: boolean
}

export function EventList({ events, isLoading }: EventListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse text-gray-400">Loading events...</div>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No events found.</p>
        <p className="text-gray-500 text-sm mt-2">
          Try adjusting your filters or wait for new events.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">
          Events ({events.length})
        </h2>
      </div>
      <div className="space-y-3">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
