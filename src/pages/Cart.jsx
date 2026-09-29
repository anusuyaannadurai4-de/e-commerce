import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { getProduct } from '../data/products'
import CartItem from '../components/CartItem'
import OrderSummary from '../components/OrderSummary'

export default function Cart() {
  const { cart } = useStore()

  if (!cart.length) {
    return (
      <div className="container section">
        <div className="empty-state">
          <span className="empty-icon-wrap">
            <ShoppingBag size={44} />
          </span>
          <h2>Your cart is empty</h2>
          <p>Looks like you have not added anything to your cart yet.</p>
          <Link to="/shop" className="btn btn-primary">
            Start Shopping <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container section">
      <div className="section-head">
        <span className="section-tag">Your Cart</span>
        <h2>Shopping Cart</h2>
        <p>{cart.length} item{cart.length > 1 ? 's' : ''} in your cart</p>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => {
            const p = getProduct(item.productId)
            return <CartItem key={item.key} item={{ ...item, name: p?.name, price: p?.price }} />
          })}
          <Link to="/shop" className="btn btn-outline continue-shopping">
            <ArrowLeft size={15} /> Continue Shopping
          </Link>
        </div>
        <OrderSummary />
      </div>
    </div>
  )
}
