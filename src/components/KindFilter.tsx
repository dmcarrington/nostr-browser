import { COMMON_KINDS, ALL_KINDS_OPTION, type KindInfo } from '../lib/kinds'

interface KindFilterProps {
  selectedKind: number
  onChange: (kind: number) => void
}

export function KindFilter({ selectedKind, onChange }: KindFilterProps) {
  const options: KindInfo[] = [ALL_KINDS_OPTION, ...COMMON_KINDS]

  return (
    <div className="flex-1">
      <label className="block text-gray-300 text-sm mb-2">
        Filter by Kind
      </label>
      <select
        value={selectedKind}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
      >
        {options.map(opt => (
          <option key={opt.kind} value={opt.kind}>
            {opt.name} {opt.kind >= 0 ? `(${opt.kind})` : ''}
          </option>
        ))}
      </select>
    </div>
  )
}
