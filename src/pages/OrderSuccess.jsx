import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Package, CalendarDays, CreditCard, ArrowRight, Home } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { formatPrice, formatDate, deliveryDate } from '../utils'

export default function OrderSuccess() {
  const { orderId } = useParams()
  const { orders } = useStore()
  const order = orders.find((o) => o.id === orderId)

  if (!order) {
    return (
      <div className="container section">
        <div className="empty-state">
          <h2>Order not found</h2>
          <p>We could not find an order with this ID.</p>
          <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container section">
      <div className="success-card">
        <span className="success-icon">
          <CheckCircle2 size={44} />
        </span>
        <h1>Order Placed Successfully!</h1>
        <p className="success-sub">
          Thank you for shopping with ShopEase. Your order has been confirmed and will be
          shipped soon.
        </p>

        <div className="success-details">
          <div className="success-row">
            <span><Package size={15} /> Order ID</span>
            <strong>{order.id}</strong>
          </div>
          <div className="success-row">
            <span><CalendarDays size={15} /> Estimated Delivery</span>
            <strong>{deliveryDate(5)}</strong>
          </div>
          <div className="success-row">
            <span><CreditCard size={15} /> Payment</span>
            <strong>{order.payment}</strong>
          </div>
          <div className="success-row">
            <span>Total Amount</span>
            <strong className="success-total">{formatPrice(order.total)}</strong>
          </div>
        </div>

        <div className="success-items">
          {order.items.map((i) => (
            <div key={i.key} className="success-item">
              <span className="success-item-qty">{i.qty} ×</span>
              <span className="success-item-name">{i.name}</span>
              <span className="success-item-price">{formatPrice(i.price * i.qty)}</span>
            </div>
          ))}
        </div>

        <div className="success-actions">
          <Link to="/orders" className="btn btn-dark">
            <Package size={15} /> View Order
          </Link>
          <Link to="/shop" className="btn btn-primary">
            Continue Shopping <ArrowRight size={15} />
          </Link>
          <Link to="/" className="btn btn-ghost">
            <Home size={15} /> Home
          </Link>
        </div>
      </div>
    </div>
  )
}
