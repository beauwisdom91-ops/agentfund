export const CATEGORIES = [
  { id: 'fuel', label: 'Fuel / Gas', emoji: '\u26FD', color: '#f97316' },
  { id: 'ev', label: 'EV Charging', emoji: '\u{1F50C}', color: '#22c55e' },
  { id: 'parking', label: 'Parking', emoji: '\u{1F17F}\uFE0F', color: '#3b82f6' },
  { id: 'food', label: 'Food & Rest Stops', emoji: '\u{1F354}', color: '#ef4444' },
  { id: 'maintenance', label: 'Maintenance & Tires', emoji: '\u{1F527}', color: '#8b5cf6' },
  { id: 'carwash', label: 'Car Wash', emoji: '\u{1F9FC}', color: '#06b6d4' },
  { id: 'tolls', label: 'Tolls & Insurance', emoji: '\u{1F6E3}\uFE0F', color: '#eab308' },
]

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]))
