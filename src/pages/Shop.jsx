import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, SearchX } from 'lucide-react'
import ProductGrid from '../components/ProductGrid'
import FilterSidebar from '../components/FilterSidebar'
import { PRODUCTS } from '../data/products'

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
]

const DEFAULT_FILTERS = {
  q: '',
  category: 'All',
  minPrice: '',
  maxPrice: '',
  minRating: 0,
  brands: [],
  minDiscount: 0,
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState(() => ({
    ...DEFAULT_FILTERS,
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || 'All',
    sort: searchParams.get('sort') || 'featured',
  }))
  const [sort, setSort] = useState(searchParams.get('sort') || 'featured')
  const [filterOpen, setFilterOpen] = useState(false)

  // Sync from URL on navigation (e.g. navbar links)
  useEffect(() => {
    setFilters((f) => ({
      ...f,
      q: searchParams.get('q') || '',
      category: searchParams.get('category') || 'All',
    }))
    setSort(searchParams.get('sort') || 'featured')
  }, [searchParams])

  const updateFilters = (next) => {
    setFilters(next)
    const params = {}
    if (next.q) params.q = next.q
    if (next.category !== 'All') params.category = next.category
    if (sort !== 'featured') params.sort = sort
    setSearchParams(params, { replace: true })
  }

  const updateSort = (value) => {
    setSort(value)
    const params = {}
    if (filters.q) params.q = filters.q
    if (filters.category !== 'All') params.category = filters.category
    if (value !== 'featured') params.sort = value
    setSearchParams(params, { replace: true })
  }

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase()
    let list = PRODUCTS.filter((p) => {
      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !p.brand.toLowerCase().includes(q) &&
        !p.category.toLowerCase().includes(q)
      )
        return false
      if (filters.category !== 'All' && p.category !== filters.category) return false
      if (filters.minPrice && p.price < Number(filters.minPrice)) return false
      if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false
      if (filters.minRating && p.rating < filters.minRating) return false
      if (filters.brands.length && !filters.brands.includes(p.brand)) return false
      if (filters.minDiscount && p.discount < filters.minDiscount) return false
      return true
    })

    switch (sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price)
        break
      case 'rating':
        list = [...list].sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        list = [...list].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
        break
      default:
        list = [...list].sort(
          (a, b) => Number(b.isBestSeller) - Number(a.isBestSeller) || b.rating - a.rating
        )
    }
    return list
  }, [filters, sort])

  return (
    <div className="container section">
      <div className="section-head">
        <span className="section-tag">ShopEase Collection</span>
        <h2>{filters.category === 'All' ? 'All Products' : filters.category}</h2>
        <p>
          Showing {filtered.length} of {PRODUCTS.length} products
        </p>
      </div>

      <div className="shop-toolbar">
        <button className="btn btn-outline btn-sm filter-toggle" onClick={() => setFilterOpen((o) => !o)}>
          <SlidersHorizontal size={15} /> Filters
        </button>
        <div className="sort-wrap">
          <label htmlFor="sort">Sort by:</label>
          <select
            id="sort"
            className="sort-select"
            value={sort}
            onChange={(e) => updateSort(e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="shop-layout">
        <FilterSidebar
          filters={filters}
          onChange={updateFilters}
          open={filterOpen}
          onToggle={() => setFilterOpen(false)}
        />
        <div>
          {filtered.length ? (
            <ProductGrid products={filtered} />
          ) : (
            <div className="empty-state">
              <SearchX size={48} className="empty-icon" />
              <h3>No products found</h3>
              <p>Try adjusting your search or filters to find what you are looking for.</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setFilters(DEFAULT_FILTERS)
                  setSort('featured')
                  setSearchParams({}, { replace: true })
                }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
