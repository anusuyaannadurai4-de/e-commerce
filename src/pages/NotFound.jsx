import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container section">
      <div className="empty-state">
        <h1 className="nf-code">404</h1>
        <h2>Page not found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
        <div className="nf-actions">
          <Link to="/" className="btn btn-primary"><Home size={15} /> Go Home</Link>
          <Link to="/shop" className="btn btn-outline"><ArrowLeft size={15} /> Back to Shop</Link>
        </div>
      </div>
    </div>
  )
}
