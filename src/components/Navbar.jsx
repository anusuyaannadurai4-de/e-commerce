import { useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, Search, Heart, User, Menu, X, Sparkles, Tag, Flame } from 'lucide-react'
import { useStore } from '../context/StoreContext'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/shop?sort=newest', label: 'New Arrivals', icon: Sparkles },
  { to: '/shop?filter=best', label: 'Best Sellers', icon: Flame },
  { to: '/offers', label: 'Offers', icon: Tag },
]

export default function Navbar() {
  const { cartCount, wishlist } = useStore()
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const submitSearch = (e) => {
    e.preventDefault()
    navigate(query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : '/shop')
    setMenuOpen(false)
  }

  const goCategories = (e) => {
    e.preventDefault()
    setMenuOpen(false)
    if (location.pathname === '/') {
      document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(
        () => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' }),
        150
      )
    }
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
          <span className="logo-icon">
            <ShoppingBag size={20} />
          </span>
          <span className="logo-text">
            Shop<em>Ease</em>
          </span>
        </Link>

        <nav className="nav-links">
          {LINKS.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
          <a href="/#categories" className="nav-link" onClick={goCategories}>
            Categories
          </a>
        </nav>

        <form className="nav-search" onSubmit={submitSearch} role="search">
          <Search size={16} className="nav-search-icon" />
          <input
            type="text"
            placeholder="Search products, brands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
        </form>

        <div className="nav-actions">
          <Link to="/wishlist" className="nav-icon-btn" aria-label="Wishlist">
            <Heart size={19} />
            {wishlist.length > 0 && <span className="nav-badge">{wishlist.length}</span>}
          </Link>
          <Link to="/account" className="nav-icon-btn" aria-label="Account">
            <User size={19} />
          </Link>
          <Link to="/cart" className="nav-icon-btn" aria-label="Cart">
            <ShoppingBag size={19} />
            {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
          </Link>
          <button
            className="nav-icon-btn hamburger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <form className="mobile-search" onSubmit={submitSearch} role="search">
          <Search size={16} className="nav-search-icon" />
          <input
            type="text"
            placeholder="Search products, brands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
        </form>
        <nav className="mobile-links">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
          <a href="/#categories" onClick={goCategories}>Categories</a>
          <Link to="/shop?sort=newest" onClick={() => setMenuOpen(false)}>New Arrivals</Link>
          <Link to="/shop?filter=best" onClick={() => setMenuOpen(false)}>Best Sellers</Link>
          <Link to="/offers" onClick={() => setMenuOpen(false)}>Offers</Link>
          <Link to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart</Link>
          <Link to="/account" onClick={() => setMenuOpen(false)}>My Account</Link>
        </nav>
      </div>
    </header>
  )
}
