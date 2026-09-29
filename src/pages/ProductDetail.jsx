import { useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Heart,
  ShoppingBag,
  Zap,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  ShieldCheck,
  MapPin,
  Check,
  ChevronRight,
} from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { getProduct, PRODUCTS } from '../data/products'
import { formatPrice, deliveryDate } from '../utils'
import ProductImage from '../components/ProductImage'
import Stars from '../components/Stars'
import ReviewCard from '../components/ReviewCard'
import ProductGrid from '../components/ProductGrid'

const GALLERY_ANGLES = [135, 160, 120, 150]

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = getProduct(id)
  const { addToCart, toggleWishlist, wishlist } = useStore()

  const [imgIndex, setImgIndex] = useState(0)
  const [color, setColor] = useState(product?.colorNames?.[0] || '')
  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)
  const [pincode, setPincode] = useState('')
  const [pincodeMsg, setPincodeMsg] = useState(null)

  const related = useMemo(
    () => PRODUCTS.filter((p) => p.category === product?.category && p.id !== product?.id).slice(0, 4),
    [product]
  )

  if (!product) {
    return (
      <div className="container section">
        <div className="empty-state">
          <h2>Product not found</h2>
          <p>The product you are looking for does not exist.</p>
          <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
        </div>
      </div>
    )
  }

  const saved = wishlist.includes(product.id)
  const needsSize = product.sizes.length > 1

  const checkPincode = (e) => {
    e.preventDefault()
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeMsg({ ok: false, text: 'Please enter a valid 6-digit pincode.' })
      return
    }
    setPincodeMsg({ ok: true, text: `Delivery by ${deliveryDate(4)} · COD available` })
  }

  const buyNow = () => {
    addToCart(product, qty, { color, size })
    navigate('/checkout')
  }

  return (
    <div className="container section">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <ChevronRight size={14} />
        <Link to="/shop">Shop</Link>
        <ChevronRight size={14} />
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
        <ChevronRight size={14} />
        <span>{product.name}</span>
      </nav>

      <div className="pd-layout">
        <div className="pd-gallery">
          <div className="pd-gallery-main">
            <ProductImage product={product} iconSize={150} angle={GALLERY_ANGLES[imgIndex]} />
            {product.discount > 0 && (
              <span className="discount-badge">-{product.discount}%</span>
            )}
          </div>
          <div className="pd-thumbs">
            {GALLERY_ANGLES.map((angle, i) => (
              <button
                key={i}
                className={`pd-thumb ${i === imgIndex ? 'active' : ''}`}
                onClick={() => setImgIndex(i)}
                aria-label={`View image ${i + 1}`}
              >
                <ProductImage product={product} iconSize={34} angle={angle} />
              </button>
            ))}
          </div>
        </div>

        <div className="pd-info">
          <span className="product-category">{product.category} · {product.brand}</span>
          <h1>{product.name}</h1>
          <div className="product-rating">
            <Stars rating={product.rating} size={16} />
            <span className="rating-num">{product.rating}</span>
            <span className="rating-count">· {product.reviews} reviews</span>
          </div>

          <div className="pd-price-row">
            <span className="price-lg">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="price-original-lg">{formatPrice(product.originalPrice)}</span>
                <span className="price-save-lg">Save {product.discount}%</span>
              </>
            )}
          </div>
          <p className="pd-tax">Inclusive of all taxes</p>

          <p className="pd-desc">{product.description}</p>

          {product.colors?.length > 0 && (
            <div className="pd-option">
              <span className="pd-option-label">
                Color: <strong>{color || 'Select'}</strong>
              </span>
              <div className="swatch-row">
                {product.colors.map((c, i) => (
                  <button
                    key={c}
                    className={`swatch ${color === product.colorNames[i] ? 'active' : ''}`}
                    style={{ background: c }}
                    onClick={() => setColor(product.colorNames[i])}
                    aria-label={product.colorNames[i]}
                    title={product.colorNames[i]}
                  />
                ))}
              </div>
            </div>
          )}

          {needsSize && (
            <div className="pd-option">
              <span className="pd-option-label">Size</span>
              <div className="size-row">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    className={`size-btn ${size === s ? 'active' : ''}`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pd-buy-row">
            <div className="qty-stepper qty-lg">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">
                <Minus size={15} />
              </button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Increase">
                <Plus size={15} />
              </button>
            </div>
            <button
              className="btn btn-dark btn-lg"
              onClick={() => addToCart(product, qty, { color, size })}
              disabled={product.stock === 0}
            >
              <ShoppingBag size={17} /> Add to Cart
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={buyNow}
              disabled={product.stock === 0}
            >
              <Zap size={17} /> Buy Now
            </button>
            <button
              className={`wishlist-btn-lg ${saved ? 'active' : ''}`}
              onClick={() => toggleWishlist(product)}
              aria-label="Add to wishlist"
            >
              <Heart size={20} fill={saved ? 'currentColor' : 'none'} />
            </button>
          </div>

          <span className={`stock-status ${product.stock < 20 ? 'low' : 'in'}`}>
            {product.stock === 0
              ? 'Out of stock'
              : product.stock < 20
              ? `Hurry! Only ${product.stock} left in stock`
              : 'In stock, ready to ship'}
          </span>

          <div className="pd-info-cards">
            <div className="info-card">
              <Truck size={20} />
              <div>
                <strong>Free delivery</strong>
                <span>On orders above ₹999 · Estimated by {deliveryDate(5)}</span>
              </div>
            </div>
            <div className="info-card">
              <RotateCcw size={20} />
              <div>
                <strong>7-day easy returns</strong>
                <span>No questions asked return policy</span>
              </div>
            </div>
            <div className="info-card">
              <ShieldCheck size={20} />
              <div>
                <strong>1 year warranty</strong>
                <span>100% genuine products</span>
              </div>
            </div>
          </div>

          <form className="pincode-row" onSubmit={checkPincode}>
            <MapPin size={16} />
            <input
              type="text"
              placeholder="Enter pincode for delivery check"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              aria-label="Pincode"
            />
            <button type="submit" className="btn btn-outline btn-sm">Check</button>
          </form>
          {pincodeMsg && (
            <p className={`pincode-msg ${pincodeMsg.ok ? 'ok' : 'err'}`}>
              {pincodeMsg.ok && <Check size={13} />} {pincodeMsg.text}
            </p>
          )}
        </div>
      </div>

      <div className="pd-sections">
        <div className="pd-section">
          <h2>Specifications</h2>
          <table className="spec-table">
            <tbody>
              {Object.entries(product.specs).map(([k, v]) => (
                <tr key={k}>
                  <td>{k}</td>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pd-section">
          <h2>Customer Reviews</h2>
          <div className="reviews-summary">
            <div className="reviews-score">
              <span className="reviews-big">{product.rating}</span>
              <Stars rating={product.rating} size={18} />
              <span className="rating-count">{product.reviews} reviews</span>
            </div>
            <div className="reviews-bars">
              {[5, 4, 3, 2, 1].map((s) => {
                const pct = s === 5 ? 68 : s === 4 ? 22 : s === 3 ? 7 : s === 2 ? 2 : 1
                return (
                  <div key={s} className="reviews-bar-row">
                    <span>{s} ★</span>
                    <div className="reviews-bar">
                      <div className="reviews-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span>{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="reviews-list">
            {product.reviewsList.map((r, i) => (
              <ReviewCard key={i} review={r} />
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="pd-section">
          <div className="section-head row">
            <h2>You may also like</h2>
            <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="btn btn-outline">
              More {product.category}
            </Link>
          </div>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  )
}
