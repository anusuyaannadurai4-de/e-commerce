import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tag, X, ShieldCheck, Truck } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { getProduct } from '../data/products'
import { formatPrice } from '../utils'

export default function OrderSummary({ showCheckoutButton = true }) {
  const {
    cart,
    cartSubtotal,
    coupon,
    applyCoupon,
    removeCoupon,
    discount,
    delivery,
    total,
  } = useStore()
  const [code, setCode] = useState('')
  const navigate = useNavigate()

  const submitCoupon = (e) => {
    e.preventDefault()
    if (applyCoupon(code)) setCode('')
  }

  return (
    <div className="summary-card">
      <h3 className="summary-title">Order Summary</h3>

      <div className="summary-items">
        {cart.map((i) => {
          const p = getProduct(i.productId)
          if (!p) return null
          return (
            <div key={i.key} className="summary-item">
              <span className="summary-item-qty">{i.qty} ×</span>
              <span className="summary-item-name">{p.name}</span>
              <span className="summary-item-price">{formatPrice(p.price * i.qty)}</span>
            </div>
          )
        })}
      </div>

      <form className="coupon-row" onSubmit={submitCoupon}>
        <div className="coupon-field">
          <Tag size={14} />
          <input
            type="text"
            placeholder="Coupon code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            aria-label="Coupon code"
          />
        </div>
        <button type="submit" className="btn btn-dark btn-sm">
          Apply
        </button>
      </form>

      {coupon && (
        <div className="coupon-applied">
          <Tag size={13} />
          <span>
            <strong>{coupon.code}</strong> — {coupon.label}
          </span>
          <button onClick={removeCoupon} aria-label="Remove coupon">
            <X size={14} />
          </button>
        </div>
      )}

      <div className="summary-rows">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>{formatPrice(cartSubtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="summary-row discount">
            <span>Discount {coupon ? `(${coupon.code})` : ''}</span>
            <span>− {formatPrice(discount)}</span>
          </div>
        )}
        <div className="summary-row">
          <span>Delivery</span>
          <span>{delivery === 0 ? 'FREE' : formatPrice(delivery)}</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {delivery === 0 && cart.length > 0 && (
        <p className="summary-note">
          <Truck size={13} /> You qualify for FREE delivery!
        </p>
      )}

      {showCheckoutButton && (
        <button
          className="btn btn-primary btn-block"
          onClick={() => navigate('/checkout')}
          disabled={cart.length === 0}
        >
          <ShieldCheck size={16} /> Proceed to Checkout
        </button>
      )}
    </div>
  )
}
