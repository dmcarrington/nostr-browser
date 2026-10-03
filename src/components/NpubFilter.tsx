import { useState, useEffect } from 'react'
import { decodeNpub } from '../lib/nostr'

interface NpubFilterProps {
  value: string
  onChange: (pubkey: string) => void
}

export function NpubFilter({ value, onChange }: NpubFilterProps) {
  const [input, setInput] = useState(value)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setInput(value)
  }, [value])

  const handleChange = (newValue: string) => {
    setInput(newValue)
    setError(null)

    if (!newValue.trim()) {
      onChange('')
      return
    }

    const decoded = decodeNpub(newValue.trim())
    if (decoded) {
      onChange(decoded)
    } else {
      setError('Invalid npub or hex pubkey')
    }
  }

  return (
    <div className="flex-1">
      <label className="block text-gray-300 text-sm mb-2">
        Filter by npub
      </label>
      <input
        type="text"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="npub1... or hex pubkey"
        className={`w-full px-4 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 ${
          error ? 'border-red-500' : 'border-gray-600'
        }`}
      />
      {error && (
        <p className="text-red-400 text-xs mt-1">{error}</p>
      )}
    </div>
  )
}
