import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, Heart } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { getProduct } from '../data/products'
import { formatPrice } from '../utils'
import ProductImage from './ProductImage'

export default function CartItem({ item }) {
  const { updateQty, removeFromCart, toggleWishlist, wishlist } = useStore()
  const product = getProduct(item.productId)
  if (!product) return null

  const saved = wishlist.includes(product.id)

  return (
    <div className="cart-item">
      <Link to={`/product/${product.id}`}>
        <ProductImage product={product} className="cart-item-img" iconSize={40} />
      </Link>
      <div className="cart-item-info">
        <Link to={`/product/${product.id}`} className="cart-item-name">
          {product.name}
        </Link>
        <span className="cart-item-meta">
          {product.brand}
          {item.options?.color ? ` · Color: ${item.options.color}` : ''}
          {item.options?.size ? ` · Size: ${item.options.size}` : ''}
        </span>
        <span className="cart-item-price">{formatPrice(product.price)}</span>
        <div className="cart-item-controls">
          <div className="qty-stepper">
            <button onClick={() => updateQty(item.key, -1)} aria-label="Decrease quantity">
              <Minus size={14} />
            </button>
            <span>{item.qty}</span>
            <button onClick={() => updateQty(item.key, 1)} aria-label="Increase quantity">
              <Plus size={14} />
            </button>
          </div>
          <button
            className="cart-icon-btn"
            onClick={() => toggleWishlist(product)}
            aria-label="Move to wishlist"
            title="Move to wishlist"
          >
            <Heart size={15} fill={saved ? 'currentColor' : 'none'} />
          </button>
          <button
            className="cart-icon-btn danger"
            onClick={() => removeFromCart(item.key)}
            aria-label="Remove from cart"
            title="Remove from cart"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      <div className="cart-item-total">{formatPrice(product.price * item.qty)}</div>
    </div>
  )
}
