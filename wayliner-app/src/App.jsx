import { useEffect, useMemo, useState } from 'react'
import { DEALS } from './data/deals.js'
import { CATEGORIES } from './data/categories.js'
import { SORTS, sortDeals } from './utils.js'
import DealCard from './components/DealCard.jsx'
import DealModal from './components/DealModal.jsx'

const STORAGE_KEY = 'wayliner:saved'

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function App() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortId, setSortId] = useState('discount')
  const [savedIds, setSavedIds] = useState(loadSaved)
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [openDeal, setOpenDeal] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds))
    } catch {
      /* ignore quota errors */
    }
  }, [savedIds])

  const toggleSave = (id) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const savedSet = useMemo(() => new Set(savedIds), [savedIds])

  // Top deals by savings, used for the "Best Deals" highlight + badges.
  const topDealIds = useMemo(() => {
    return new Set(
      [...DEALS].sort((a, b) => b.savingsPercent - a.savingsPercent).slice(0, 3).map((d) => d.id),
    )
  }, [])

  const maxSavings = useMemo(() => Math.max(...DEALS.map((d) => d.savingsPercent)), [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = DEALS.filter((deal) => {
      if (showSavedOnly && !savedSet.has(deal.id)) return false
      if (activeCategory !== 'all' && deal.category !== activeCategory) return false
      if (q) {
        const hay = `${deal.merchant} ${deal.title} ${deal.description} ${deal.city}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
    return sortDeals(list, sortId)
  }, [query, activeCategory, sortId, showSavedOnly, savedSet])

  const topDeals = useMemo(
    () => [...DEALS].sort((a, b) => b.savingsPercent - a.savingsPercent).slice(0, 3),
    [],
  )

  const categoryCounts = useMemo(() => {
    const counts = {}
    for (const d of DEALS) counts[d.category] = (counts[d.category] || 0) + 1
    return counts
  }, [])

  return (
    <div className="app">
      <header className="header">
        <div className="header__inner">
          <div className="brand" onClick={() => { setShowSavedOnly(false); setActiveCategory('all') }}>
            <div className="brand__mark" aria-hidden="true">
              <svg viewBox="0 0 64 64" width="34" height="34">
                <path d="M12 46 L32 14 L52 46" fill="none" stroke="#fbbf24" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="32" cy="50" r="4.5" fill="#fbbf24" />
              </svg>
            </div>
            <div className="brand__text">
              <span className="brand__name">Wayliner</span>
              <span className="brand__tag">Best Deals for Drivers</span>
            </div>
          </div>

          <div className="header__search">
            <span className="header__search-icon" aria-hidden="true">{'\u{1F50D}'}</span>
            <input
              type="search"
              placeholder="Search deals, brands, or cities…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search deals"
            />
          </div>

          <button
            className={`saved-toggle ${showSavedOnly ? 'is-active' : ''}`}
            onClick={() => setShowSavedOnly((v) => !v)}
            aria-pressed={showSavedOnly}
          >
            {'\u2665'} Saved <span className="saved-toggle__count">{savedIds.length}</span>
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero__inner">
          <h1 className="hero__title">
            Fuel up, park, charge & save on the road
          </h1>
          <p className="hero__summary">
            <strong>{DEALS.length} deals</strong> near you across {CATEGORIES.length} categories
            {'  \u2022  '}
            best saves up to <strong>{maxSavings}%</strong>
          </p>
        </div>
      </section>

      <div className="layout">
        <aside className="sidebar">
          <h2 className="sidebar__title">Categories</h2>
          <div className="chips">
            <button
              className={`chip ${activeCategory === 'all' ? 'chip--active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              <span className="chip__emoji">{'\u2728'}</span> All deals
              <span className="chip__count">{DEALS.length}</span>
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={`chip ${activeCategory === c.id ? 'chip--active' : ''}`}
                style={activeCategory === c.id ? { borderColor: c.color, boxShadow: `inset 0 0 0 1px ${c.color}` } : undefined}
                onClick={() => setActiveCategory(c.id)}
              >
                <span className="chip__emoji">{c.emoji}</span> {c.label}
                <span className="chip__count">{categoryCounts[c.id] || 0}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="content">
          {!showSavedOnly && activeCategory === 'all' && !query && (
            <section className="best-deals">
              <div className="section-head">
                <h2>{'\u{1F525}'} Best Deals right now</h2>
                <span className="section-head__sub">Top savings picked for drivers</span>
              </div>
              <div className="best-deals__grid">
                {topDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    isSaved={savedSet.has(deal.id)}
                    onToggleSave={toggleSave}
                    onOpen={setOpenDeal}
                    isTopDeal
                  />
                ))}
              </div>
            </section>
          )}

          <div className="toolbar">
            <div className="toolbar__count">
              {filtered.length} {filtered.length === 1 ? 'deal' : 'deals'}
              {showSavedOnly && ' saved'}
              {activeCategory !== 'all' && !showSavedOnly &&
                ` in ${CATEGORIES.find((c) => c.id === activeCategory)?.label}`}
            </div>
            <label className="toolbar__sort">
              Sort by
              <select value={sortId} onChange={(e) => setSortId(e.target.value)} aria-label="Sort deals">
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </label>
          </div>

          {filtered.length === 0 ? (
            <div className="empty">
              <div className="empty__emoji" aria-hidden="true">
                {showSavedOnly ? '\u{1F494}' : '\u{1F50D}'}
              </div>
              <h3>{showSavedOnly ? 'No saved deals yet' : 'No deals match your search'}</h3>
              <p>
                {showSavedOnly
                  ? 'Tap the heart on any deal to save it here for later.'
                  : 'Try a different category, clear your search, or reset the filters.'}
              </p>
              <button
                className="btn btn--primary"
                onClick={() => { setQuery(''); setActiveCategory('all'); setShowSavedOnly(false) }}
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="deals-grid">
              {filtered.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  isSaved={savedSet.has(deal.id)}
                  onToggleSave={toggleSave}
                  onOpen={setOpenDeal}
                  isTopDeal={topDealIds.has(deal.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <footer className="footer">
        <p>
          Wayliner {'\u00B7'} Best Deals for Drivers {'\u00B7'} Deals shown are seeded demo data for
          illustration only.
        </p>
      </footer>

      {openDeal && (
        <DealModal
          deal={openDeal}
          isSaved={savedSet.has(openDeal.id)}
          onToggleSave={toggleSave}
          onClose={() => setOpenDeal(null)}
        />
      )}
    </div>
  )
}
