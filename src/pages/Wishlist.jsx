import { Link } from 'react-router-dom'
import { Heart, ArrowRight } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { PRODUCTS } from '../data/products'
import ProductCard from '../components/ProductCard'

export default function Wishlist() {
  const { wishlist } = useStore()
  const products = PRODUCTS.filter((p) => wishlist.includes(p.id))

  return (
    <div className="container section">
      <div className="section-head">
        <span className="section-tag">Saved for later</span>
        <h2>My Wishlist</h2>
        <p>{products.length} item{products.length !== 1 ? 's' : ''} saved</p>
      </div>

      {products.length ? (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon-wrap">
            <Heart size={44} />
          </span>
          <h2>Your wishlist is empty</h2>
          <p>Tap the heart icon on any product to save it here for later.</p>
          <Link to="/shop" className="btn btn-primary">
            Discover Products <ArrowRight size={15} />
          </Link>
        </div>
      )}
    </div>
  )
}
