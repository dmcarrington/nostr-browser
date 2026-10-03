import { useState } from 'react'
import type { Event } from 'nostr-tools'
import { decodeNsec, createKind30078Event } from '../lib/nostr'

interface PostJsonTabProps {
  onPublish: (event: Event) => Promise<void>
}

export function PostJsonTab({ onPublish }: PostJsonTabProps) {
  const [nsec, setNsec] = useState('')
  const [eventType, setEventType] = useState('')
  const [environment, setEnvironment] = useState('')
  const [jsonContent, setJsonContent] = useState('')
  const [status, setStatus] = useState<{
    type: 'idle' | 'publishing' | 'success' | 'error'
    message?: string
    eventId?: string
  }>({ type: 'idle' })

  const handlePublish = async () => {
    setStatus({ type: 'idle' })

    // Validate nsec
    const secretKey = decodeNsec(nsec.trim())
    if (!secretKey) {
      setStatus({ type: 'error', message: 'Invalid nsec key' })
      return
    }

    // Validate JSON content is not empty
    if (!jsonContent.trim()) {
      setStatus({ type: 'error', message: 'JSON content cannot be empty' })
      return
    }

    try {
      setStatus({ type: 'publishing' })
      const extraTags: string[][] = []
      if (eventType.trim()) extraTags.push(['event_type', eventType.trim()])
      if (environment.trim()) extraTags.push(['environment', environment.trim()])
      const event = createKind30078Event(secretKey, jsonContent, extraTags)
      await onPublish(event)
      setStatus({
        type: 'success',
        message: 'Event published successfully!',
        eventId: event.id
      })
      setJsonContent('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to publish event'
      setStatus({ type: 'error', message })
    }
  }

  return (
    <div className="mt-4 p-4 bg-gray-800 border border-gray-700 rounded-lg">
      <h2 className="text-lg font-semibold text-white mb-4">
        Post App-Specific Data (Kind 30078)
      </h2>

      <div className="mb-4">
        <label className="block text-gray-300 text-sm mb-2">
          Secret Key (nsec)
        </label>
        <input
          type="password"
          value={nsec}
          onChange={(e) => setNsec(e.target.value)}
          placeholder="nsec1..."
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-300 text-sm mb-2">
          Event Type
        </label>
        <input
          type="text"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          placeholder="e.g. inspection"
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-300 text-sm mb-2">
          Environment
        </label>
        <input
          type="text"
          value={environment}
          onChange={(e) => setEnvironment(e.target.value)}
          placeholder="e.g. production"
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-300 text-sm mb-2">
          JSON Content
        </label>
        <textarea
          value={jsonContent}
          onChange={(e) => setJsonContent(e.target.value)}
          placeholder='{"key": "value"}'
          rows={10}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 font-mono text-sm"
        />
      </div>

      <button
        onClick={handlePublish}
        disabled={status.type === 'publishing' || !nsec.trim() || !jsonContent.trim()}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors"
      >
        {status.type === 'publishing' ? 'Publishing...' : 'Publish'}
      </button>

      {status.type === 'success' && (
        <div className="mt-4 p-3 bg-green-900/20 border border-green-700 rounded-md">
          <p className="text-green-400 text-sm">{status.message}</p>
          {status.eventId && (
            <div className="mt-2 flex items-center gap-2">
              <code className="text-green-300 text-xs font-mono break-all">{status.eventId}</code>
              <button
                onClick={() => navigator.clipboard.writeText(status.eventId!)}
                className="shrink-0 px-2 py-1 text-xs bg-green-800 hover:bg-green-700 text-green-200 rounded transition-colors"
              >
                Copy
              </button>
            </div>
          )}
        </div>
      )}

      {status.type === 'error' && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded-md">
          <p className="text-red-400 text-sm">{status.message}</p>
        </div>
      )}
    </div>
  )
}
