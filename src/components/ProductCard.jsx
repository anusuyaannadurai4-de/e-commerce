import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Eye, Plus } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { formatPrice } from '../utils'
import ProductImage from './ProductImage'
import Stars from './Stars'
import Modal from './Modal'

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useStore()
  const [quickView, setQuickView] = useState(false)
  const saved = wishlist.includes(product.id)

  const stockLabel =
    product.stock === 0
      ? { text: 'Out of stock', cls: 'out' }
      : product.stock < 20
      ? { text: `Only ${product.stock} left`, cls: 'low' }
      : { text: 'In stock', cls: 'in' }

  return (
    <div className="product-card">
      <div className="product-media">
        <Link to={`/product/${product.id}`} aria-label={product.name}>
          <ProductImage product={product} className="product-img" iconSize={84} />
        </Link>
        {product.discount > 0 && (
          <span className="discount-badge">-{product.discount}%</span>
        )}
        {product.isNew && <span className="new-badge">New</span>}
        <button
          className={`wishlist-btn ${saved ? 'active' : ''}`}
          onClick={() => toggleWishlist(product)}
          aria-label="Toggle wishlist"
        >
          <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
        </button>
        <button className="quick-view" onClick={() => setQuickView(true)}>
          <Eye size={14} /> Quick View
        </button>
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link to={`/product/${product.id}`} className="product-name">
          {product.name}
        </Link>
        <div className="product-rating">
          <Stars rating={product.rating} />
          <span className="rating-num">{product.rating}</span>
          <span className="rating-count">({product.reviews})</span>
        </div>
        <div className="price-row">
          <span className="price">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="price-original">{formatPrice(product.originalPrice)}</span>
          )}
          {product.discount > 0 && (
            <span className="price-save">{product.discount}% off</span>
          )}
        </div>
        <span className={`stock-status ${stockLabel.cls}`}>{stockLabel.text}</span>
        <button
          className="add-cart-btn"
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
        >
          <ShoppingBag size={15} /> Add to Cart
        </button>
      </div>

      <Modal open={quickView} onClose={() => setQuickView(false)} small>
        <div className="quickview-body">
          <ProductImage product={product} className="quickview-img" iconSize={96} />
          <div className="quickview-info">
            <span className="product-category">{product.category}</span>
            <h3>{product.name}</h3>
            <div className="product-rating">
              <Stars rating={product.rating} />
              <span className="rating-num">{product.rating}</span>
              <span className="rating-count">({product.reviews} reviews)</span>
            </div>
            <div className="price-row">
              <span className="price">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <span className="price-original">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            <p className="quickview-desc">{product.description.slice(0, 140)}...</p>
            <div className="quickview-actions">
              <button
                className="btn btn-primary"
                onClick={() => {
                  addToCart(product)
                  setQuickView(false)
                }}
                disabled={product.stock === 0}
              >
                <ShoppingBag size={15} /> Add to Cart
              </button>
              <Link
                to={`/product/${product.id}`}
                className="btn btn-outline"
                onClick={() => setQuickView(false)}
              >
                <Plus size={15} /> Full Details
              </Link>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
