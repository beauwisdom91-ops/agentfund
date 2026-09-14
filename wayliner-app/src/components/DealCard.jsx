import { CATEGORY_MAP } from '../data/categories.js'
import { formatDistance, formatExpiry, formatPrice, daysUntil } from '../utils.js'

export default function DealCard({ deal, isSaved, onToggleSave, onOpen, isTopDeal }) {
  const cat = CATEGORY_MAP[deal.category]
  const expiringSoon = daysUntil(deal.expiry) <= 7 && daysUntil(deal.expiry) >= 0
  const price = formatPrice(deal.price)
  const original = formatPrice(deal.originalPrice)

  return (
    <article
      className="deal-card"
      onClick={() => onOpen(deal)}
      tabIndex={0}
      role="button"
      aria-label={`${deal.merchant}: ${deal.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(deal)
        }
      }}
    >
      <div className="deal-card__badge" style={{ background: cat.color }}>
        <span className="deal-card__emoji" aria-hidden="true">{deal.emoji}</span>
      </div>

      <button
        className={`save-btn ${isSaved ? 'save-btn--active' : ''}`}
        title={isSaved ? 'Remove from saved' : 'Save deal'}
        aria-label={isSaved ? 'Remove from saved' : 'Save deal'}
        onClick={(e) => {
          e.stopPropagation()
          onToggleSave(deal.id)
        }}
      >
        {isSaved ? '\u2665' : '\u2661'}
      </button>

      <div className="deal-card__body">
        <div className="deal-card__top">
          <span className="deal-card__cat" style={{ color: cat.color }}>{cat.label}</span>
          {isTopDeal && <span className="tag tag--best">Best Deal</span>}
        </div>
        <h3 className="deal-card__merchant">{deal.merchant}</h3>
        <p className="deal-card__title">{deal.title}</p>

        <div className="deal-card__discount">{deal.discount}</div>

        {price != null && (
          <div className="deal-card__price">
            <span className="deal-card__price-now">{price}</span>
            {original && <span className="deal-card__price-was">{original}</span>}
          </div>
        )}

        <div className="deal-card__meta">
          <span title="Rating">{'\u2605'} {deal.rating.toFixed(1)}</span>
          <span title="Distance">{'\u{1F4CD}'} {formatDistance(deal.distance)}</span>
        </div>
        <div className={`deal-card__expiry ${expiringSoon ? 'is-soon' : ''}`}>
          {'\u23F1\uFE0F'} {formatExpiry(deal.expiry)}
        </div>
      </div>
    </article>
  )
}
