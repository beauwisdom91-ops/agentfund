import { useEffect, useState } from 'react'
import { CATEGORY_MAP } from '../data/categories.js'
import { formatDistance, formatExpiry, formatPrice, makeRedemptionCode } from '../utils.js'

export default function DealModal({ deal, isSaved, onToggleSave, onClose }) {
  const [code, setCode] = useState(null)

  useEffect(() => {
    setCode(null)
  }, [deal])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!deal) return null
  const cat = CATEGORY_MAP[deal.category]
  const price = formatPrice(deal.price)
  const original = formatPrice(deal.originalPrice)

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Close">{'\u2715'}</button>

        <div className="modal__hero" style={{ background: `linear-gradient(135deg, ${cat.color}, #0f172a)` }}>
          <span className="modal__emoji" aria-hidden="true">{deal.emoji}</span>
          <span className="modal__cat">{cat.label}</span>
        </div>

        <div className="modal__content">
          <h2 className="modal__merchant">{deal.merchant}</h2>
          <p className="modal__title">{deal.title}</p>
          <p className="modal__desc">{deal.description}</p>

          <div className="modal__discount-row">
            <span className="modal__discount">{deal.discount}</span>
            {price != null && (
              <span className="modal__price">
                <strong>{price}</strong>
                {original && <span className="modal__was">{original}</span>}
              </span>
            )}
          </div>

          <ul className="modal__facts">
            <li><span>Rating</span><strong>{'\u2605'} {deal.rating.toFixed(1)}</strong></li>
            <li><span>Distance</span><strong>{formatDistance(deal.distance)}</strong></li>
            <li><span>Location</span><strong>{deal.city}</strong></li>
            <li><span>Validity</span><strong>{formatExpiry(deal.expiry)}</strong></li>
          </ul>

          {code ? (
            <div className="redeem-success">
              <p className="redeem-success__label">{'\u2705'} Deal redeemed! Show this code at {deal.merchant}:</p>
              <div className="redeem-code">{code}</div>
              <p className="redeem-note">Valid for a single use. Screenshot or save it before you go.</p>
            </div>
          ) : (
            <div className="modal__actions">
              <button className="btn btn--primary" onClick={() => setCode(makeRedemptionCode(deal.id))}>
                Get Deal
              </button>
              <button
                className={`btn btn--ghost ${isSaved ? 'is-saved' : ''}`}
                onClick={() => onToggleSave(deal.id)}
              >
                {isSaved ? '\u2665 Saved' : '\u2661 Save'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
