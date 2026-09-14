export function daysUntil(dateStr) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(dateStr + 'T00:00:00')
  const diff = Math.round((target - now) / (1000 * 60 * 60 * 24))
  return diff
}

export function formatExpiry(dateStr) {
  const d = daysUntil(dateStr)
  if (d < 0) return 'Expired'
  if (d === 0) return 'Expires today'
  if (d === 1) return 'Expires tomorrow'
  if (d <= 7) return `Expires in ${d} days`
  const target = new Date(dateStr + 'T00:00:00')
  return `Expires ${target.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
}

export function formatDistance(miles) {
  if (miles === 0) return 'Online / Anywhere'
  return `${miles.toFixed(1)} mi away`
}

export function formatPrice(n) {
  if (n == null) return null
  return `$${n.toFixed(2).replace(/\.00$/, '')}`
}

// Generate a deterministic-ish redemption code for the mock "Get Deal" action.
export function makeRedemptionCode(dealId) {
  const base = dealId.replace(/[^a-z0-9]/gi, '').toUpperCase()
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `WAY-${base.slice(0, 4)}-${rand}`
}

export const SORTS = [
  { id: 'discount', label: 'Best discount' },
  { id: 'distance', label: 'Nearest' },
  { id: 'rating', label: 'Highest rated' },
  { id: 'expiring', label: 'Expiring soon' },
]

export function sortDeals(deals, sortId) {
  const arr = [...deals]
  switch (sortId) {
    case 'distance':
      return arr.sort((a, b) => a.distance - b.distance)
    case 'rating':
      return arr.sort((a, b) => b.rating - a.rating)
    case 'expiring':
      return arr.sort((a, b) => daysUntil(a.expiry) - daysUntil(b.expiry))
    case 'discount':
    default:
      return arr.sort((a, b) => b.savingsPercent - a.savingsPercent)
  }
}
