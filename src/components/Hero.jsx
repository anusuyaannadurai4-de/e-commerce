import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Star, ShoppingBag, Truck, ShieldCheck } from 'lucide-react'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-glow hero-glow-1" />
      <div className="hero-glow hero-glow-2" />
      <div className="container hero-inner">
        <div className="hero-copy">
          <span className="hero-badge">
            <Sparkles size={14} />
            Up to 50% OFF — Flash Sale is live
          </span>
          <h1>
            Discover
            <br />
            Your <span className="hero-highlight">Style</span>
          </h1>
          <p>
            Shop the latest products at amazing prices. From fashion to electronics,
            find everything you love in one place — delivered fast, returns made easy.
          </p>
          <div className="hero-cta">
            <Link to="/shop" className="btn btn-light">
              <ShoppingBag size={16} />
              Shop Now
            </Link>
            <Link to="/shop?filter=best" className="btn btn-ghost-light">
              Explore Collection
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="hero-stats">
            <div>
              <strong>10K+</strong>
              <span>Products</span>
            </div>
            <div>
              <strong>50K+</strong>
              <span>Happy Customers</span>
            </div>
            <div>
              <strong>4.8</strong>
              <span>
                <Star size={13} fill="currentColor" /> Average Rating
              </span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card-main">
            <ShoppingBag size={120} color="rgba(255,255,255,0.95)" strokeWidth={0.9} />
          </div>
          <div className="hero-float hero-float-1">
            <span className="hero-float-icon"><Sparkles size={16} /></span>
            <div>
              <strong>Flash Sale</strong>
              <span>Up to 50% off</span>
            </div>
          </div>
          <div className="hero-float hero-float-2">
            <span className="hero-float-icon"><Star size={16} fill="currentColor" /></span>
            <div>
              <strong>4.8 / 5.0</strong>
              <span>12,400+ reviews</span>
            </div>
          </div>
          <div className="hero-float hero-float-3">
            <span className="hero-float-icon"><Truck size={16} /></span>
            <div>
              <strong>Free Delivery</strong>
              <span>Orders above ₹999</span>
            </div>
          </div>
          <div className="hero-float hero-float-4">
            <span className="hero-float-icon"><ShieldCheck size={16} /></span>
            <div>
              <strong>100% Genuine</strong>
              <span>Secure payments</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
