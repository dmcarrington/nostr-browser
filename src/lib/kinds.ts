export interface KindInfo {
  kind: number
  name: string
  description: string
}

export const COMMON_KINDS: KindInfo[] = [
  { kind: 0, name: 'Metadata', description: 'User profile metadata' },
  { kind: 1, name: 'Text Note', description: 'Short text notes' },
  { kind: 3, name: 'Contacts', description: 'Contact list / follows' },
  { kind: 4, name: 'Encrypted DM', description: 'Encrypted direct messages' },
  { kind: 5, name: 'Deletion', description: 'Event deletion requests' },
  { kind: 6, name: 'Repost', description: 'Reposts of other events' },
  { kind: 7, name: 'Reaction', description: 'Reactions (likes, etc.)' },
  { kind: 40, name: 'Channel Creation', description: 'Public chat channel creation' },
  { kind: 41, name: 'Channel Metadata', description: 'Channel metadata updates' },
  { kind: 42, name: 'Channel Message', description: 'Messages in public channels' },
  { kind: 1984, name: 'Report', description: 'Reports / flags' },
  { kind: 9735, name: 'Zap', description: 'Lightning zap receipts' },
  { kind: 10002, name: 'Relay List', description: 'User relay list metadata' },
  { kind: 30078, name: 'App-Specific Data', description: 'Application-specific data storage' },
]

export const ALL_KINDS_OPTION: KindInfo = { kind: -1, name: 'All Kinds', description: 'Show all event kinds' }
