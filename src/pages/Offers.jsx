import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Timer, Copy, Check, Flame, Tag, Gift, ArrowRight } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { PRODUCTS, COUPONS } from '../data/products'
import { formatPrice } from '../utils'
import ProductGrid from '../components/ProductGrid'
import { useCountdown } from '../hooks/useCountdown'

export default function Offers() {
  const { showToast } = useStore()
  const { hours, minutes, seconds } = useCountdown()
  const [copied, setCopied] = useState(null)

  const flashDeals = PRODUCTS.filter((p) => p.discount >= 40)
  const limitedOffers = PRODUCTS.filter((p) => p.discount >= 30 && p.discount < 40)

  const copyCode = (code) => {
    navigator.clipboard?.writeText(code).catch(() => {})
    setCopied(code)
    showToast(`Code ${code} copied to clipboard`)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="container section">
      <div className="offers-hero offers-page-hero">
        <div className="offers-hero-copy">
          <span className="offers-tag"><Flame size={14} /> Limited Time Offers</span>
          <h2>
            Up to <span className="offers-highlight">70% OFF</span>
          </h2>
          <p>
            Flash deals on top brands — fashion, electronics, beauty and more.
            New deals drop every day. Do not miss out!
          </p>
          <div className="countdown">
            <div className="countdown-box">
              <span className="num">{String(hours).padStart(2, '0')}</span>
              <span className="lbl">Hours</span>
            </div>
            <div className="countdown-box">
              <span className="num">{String(minutes).padStart(2, '0')}</span>
              <span className="lbl">Mins</span>
            </div>
            <div className="countdown-box">
              <span className="num">{String(seconds).padStart(2, '0')}</span>
              <span className="lbl">Secs</span>
            </div>
          </div>
          <Link to="/shop" className="btn btn-light">
            Shop All Deals <ArrowRight size={15} />
          </Link>
        </div>
        <div className="offers-hero-products">
          {flashDeals.slice(0, 3).map((p) => (
            <Link to={`/product/${p.id}`} key={p.id} className="offers-mini-card">
              <span className="offers-mini-discount">-{p.discount}%</span>
              <span className="offers-mini-name">{p.name}</span>
              <span className="offers-mini-price">{formatPrice(p.price)}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="section-head" style={{ marginTop: 64 }}>
        <span className="section-tag"><Tag size={13} /> Coupon Codes</span>
        <h2>Save More with Coupons</h2>
        <p>Apply these codes at checkout for extra savings</p>
      </div>
      <div className="coupon-grid">
        {Object.entries(COUPONS).map(([code, c]) => (
          <div key={code} className="coupon-card">
            <div className="coupon-left">
              <span className="coupon-icon"><Gift size={18} /></span>
              <div>
                <strong>{c.label}</strong>
                <span className="coupon-code">{code}</span>
              </div>
            </div>
            <button className="btn btn-dark btn-sm" onClick={() => copyCode(code)}>
              {copied === code ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
            </button>
          </div>
        ))}
      </div>

      <div className="section-head" style={{ marginTop: 64 }}>
        <span className="section-tag"><Flame size={13} /> Flash Sale</span>
        <h2>Flash Sale Deals</h2>
        <p>Up to 50% off — while stocks last</p>
      </div>
      <ProductGrid products={flashDeals} />

      <div className="section-head" style={{ marginTop: 64 }}>
        <span className="section-tag"><Timer size={13} /> Limited Time</span>
        <h2>Limited Time Offers</h2>
        <p>Handpicked deals you will not see again</p>
      </div>
      <ProductGrid products={limitedOffers} />
    </div>
  )
}
