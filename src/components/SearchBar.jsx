import { Search, X } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = 'Search products, brands...' }) {
  return (
    <div className="searchbar">
      <Search size={17} className="searchbar-icon" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search products"
      />
      {value && (
        <button className="searchbar-clear" onClick={() => onChange('')} aria-label="Clear search">
          <X size={15} />
        </button>
      )}
    </div>
  )
}
