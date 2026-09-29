import { Link } from 'react-router-dom'
import { Truck, RotateCcw, ShieldCheck, Headphones, ArrowRight, Timer } from 'lucide-react'
import Hero from '../components/Hero'
import CategoryCard from '../components/CategoryCard'
import ProductGrid from '../components/ProductGrid'
import { CATEGORIES, PRODUCTS } from '../data/products'
import { useCountdown } from '../hooks/useCountdown'

const FEATURES = [
  { icon: Truck, title: 'Free Delivery', text: 'On all orders above ₹999' },
  { icon: RotateCcw, title: 'Easy Returns', text: '7-day hassle-free returns' },
  { icon: ShieldCheck, title: 'Secure Payments', text: 'UPI, cards, net banking & COD' },
  { icon: Headphones, title: '24×7 Support', text: 'We are here to help, always' },
]

export default function Home() {
  const trending = [...PRODUCTS].sort((a, b) => b.rating * b.reviews - a.rating * a.reviews).slice(0, 8)
  const flashDeals = PRODUCTS.filter((p) => p.discount >= 40).slice(0, 4)
  const { hours, minutes, seconds } = useCountdown()

  return (
    <>
      <Hero />

      <section className="section" id="categories">
        <div className="container">
          <div className="section-head">
            <span className="section-tag">Categories</span>
            <h2>Shop by Category</h2>
            <p>Explore our wide range of curated collections</p>
          </div>
          <div className="category-grid">
            {CATEGORIES.map((c) => (
              <CategoryCard
                key={c.name}
                category={c}
                count={PRODUCTS.filter((p) => p.category === c.name).length}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head row">
            <div>
              <span className="section-tag">Handpicked for you</span>
              <h2>Trending Products</h2>
              <p>Our most loved products this season</p>
            </div>
            <Link to="/shop" className="btn btn-outline">
              View All <ArrowRight size={15} />
            </Link>
          </div>
          <ProductGrid products={trending} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="offers-hero">
            <div className="offers-hero-copy">
              <span className="offers-tag">
                <Timer size={14} /> Flash Sale
              </span>
              <h2>
                Up to <span className="offers-highlight">70% OFF</span>
              </h2>
              <p>
                Limited-time deals on top brands. Grab them before the clock runs out!
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
              <Link to="/offers" className="btn btn-light">
                Shop Flash Sale <ArrowRight size={15} />
              </Link>
            </div>
            <div className="offers-hero-products">
              {flashDeals.map((p) => (
                <Link to={`/product/${p.id}`} key={p.id} className="offers-mini-card">
                  <span className="offers-mini-discount">-{p.discount}%</span>
                  <span className="offers-mini-name">{p.name}</span>
                  <span className="offers-mini-price">₹{p.price.toLocaleString('en-IN')}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <span className="feature-icon">
                  <f.icon size={24} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
