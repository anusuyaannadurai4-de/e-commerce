import { Star, RotateCcw } from 'lucide-react'
import { CATEGORIES, BRANDS } from '../data/products'
import SearchBar from './SearchBar'

const RATING_OPTIONS = [4.5, 4, 3.5, 3]
const DISCOUNT_OPTIONS = [10, 20, 30, 40]

export default function FilterSidebar({ filters, onChange, open, onToggle }) {
  const set = (patch) => onChange({ ...filters, ...patch })

  const toggleBrand = (brand) => {
    const brands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand]
    set({ brands })
  }

  const clearAll = () =>
    onChange({
      q: '',
      category: 'All',
      maxPrice: '',
      minRating: 0,
      brands: [],
      minDiscount: 0,
    })

  return (
    <aside className={`filter-sidebar ${open ? 'open' : ''}`}>
      <div className="filter-head">
        <h3>Filters</h3>
        <button className="filter-clear" onClick={clearAll}>
          <RotateCcw size={13} /> Clear all
        </button>
      </div>

      <div className="filter-group">
        <h4>Search</h4>
        <SearchBar value={filters.q} onChange={(q) => set({ q })} />
      </div>

      <div className="filter-group">
        <h4>Category</h4>
        <div className="filter-options">
          {['All', ...CATEGORIES.map((c) => c.name)].map((c) => (
            <label key={c} className="check-row">
              <input
                type="radio"
                name="category"
                checked={filters.category === c}
                onChange={() => set({ category: c })}
              />
              <span>{c}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h4>Max Price</h4>
        <div className="price-inputs">
          <input
            type="number"
            placeholder="₹ Min"
            value={filters.minPrice}
            onChange={(e) => set({ minPrice: e.target.value })}
            min="0"
          />
          <input
            type="number"
            placeholder="₹ Max"
            value={filters.maxPrice}
            onChange={(e) => set({ maxPrice: e.target.value })}
            min="0"
          />
        </div>
        <input
          type="range"
          className="price-slider"
          min="0"
          max="10000"
          step="100"
          value={filters.maxPrice || 10000}
          onChange={(e) => set({ maxPrice: e.target.value })}
          aria-label="Maximum price"
        />
        <span className="price-slider-label">
          Up to ₹{(filters.maxPrice || 10000).toLocaleString('en-IN')}
        </span>
      </div>

      <div className="filter-group">
        <h4>Rating</h4>
        <div className="filter-options">
          {RATING_OPTIONS.map((r) => (
            <label key={r} className="check-row">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === r}
                onChange={() => set({ minRating: r })}
              />
              <span className="rating-filter">
                <Star size={13} fill="currentColor" /> {r}+
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h4>Brand</h4>
        <div className="filter-options">
          {BRANDS.map((b) => (
            <label key={b} className="check-row">
              <input
                type="checkbox"
                checked={filters.brands.includes(b)}
                onChange={() => toggleBrand(b)}
              />
              <span>{b}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h4>Discount</h4>
        <div className="filter-options">
          {DISCOUNT_OPTIONS.map((d) => (
            <label key={d} className="check-row">
              <input
                type="radio"
                name="discount"
                checked={filters.minDiscount === d}
                onChange={() => set({ minDiscount: d })}
              />
              <span>{d}% off or more</span>
            </label>
          ))}
        </div>
      </div>

      <button className="btn btn-primary btn-block" onClick={onToggle}>
        Show Results
      </button>
    </aside>
  )
}
