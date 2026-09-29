import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Package,
  Truck,
  CheckCircle2,
  ClipboardList,
  MapPin,
  CreditCard,
  ChevronRight,
} from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { formatPrice, formatDate, deliveryDate } from '../utils'
import Modal from '../components/Modal'
import ProductImage from '../components/ProductImage'

const TRACK_STEPS = [
  { label: 'Order Placed', desc: 'We have received your order', done: true },
  { label: 'Packed', desc: 'Your order is being packed', done: true },
  { label: 'Shipped', desc: 'Handed to the courier partner', done: true },
  { label: 'Out for Delivery', desc: 'Arriving at your doorstep', done: false },
  { label: 'Delivered', desc: 'Enjoy your purchase!', done: false },
]

export default function Orders() {
  const { orders } = useStore()
  const [trackOrder, setTrackOrder] = useState(null)
  const [detailOrder, setDetailOrder] = useState(null)

  if (!orders.length) {
    return (
      <div className="container section">
        <div className="section-head">
          <span className="section-tag">Order History</span>
          <h2>My Orders</h2>
        </div>
        <div className="empty-state">
          <span className="empty-icon-wrap"><Package size={44} /></span>
          <h2>No orders yet</h2>
          <p>When you place an order, it will show up here with live tracking.</p>
          <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container section">
      <div className="section-head">
        <span className="section-tag">Order History</span>
        <h2>My Orders</h2>
        <p>{orders.length} order{orders.length > 1 ? 's' : ''} placed</p>
      </div>

      <div className="orders-page-list">
        {orders.map((o) => (
          <div key={o.id} className="order-card">
            <div className="order-card-head">
              <div>
                <span className="order-id">{o.id}</span>
                <span className="order-date">Placed on {formatDate(o.date)}</span>
              </div>
              <span className="status-badge placed">{o.status}</span>
            </div>

            <div className="order-card-items">
              {o.items.map((i) => (
                <div key={i.key} className="order-item">
                  <ProductImage product={{ gradient: i.gradient, icon: i.icon }} className="order-item-img" iconSize={22} />
                  <div>
                    <span className="order-item-name">{i.name}</span>
                    <span className="order-item-meta">
                      Qty {i.qty}
                      {i.options?.color ? ` · ${i.options.color}` : ''}
                      {i.options?.size ? ` · Size ${i.options.size}` : ''}
                    </span>
                  </div>
                  <span className="order-item-price">{formatPrice(i.price * i.qty)}</span>
                </div>
              ))}
            </div>

            <div className="order-card-foot">
              <div className="order-card-info">
                <span><CreditCard size={13} /> {o.payment}</span>
                <span><Truck size={13} /> Est. delivery {deliveryDate(5)}</span>
              </div>
              <div className="order-card-actions">
                <strong className="order-total">{formatPrice(o.total)}</strong>
                <button className="btn btn-outline btn-sm" onClick={() => setTrackOrder(o)}>
                  <Truck size={14} /> Track Order
                </button>
                <button className="btn btn-dark btn-sm" onClick={() => setDetailOrder(o)}>
                  <ClipboardList size={14} /> View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!trackOrder} onClose={() => setTrackOrder(null)} small>
        {trackOrder && (
          <div className="track-body">
            <h3>Track Order</h3>
            <p className="track-order-id">{trackOrder.id}</p>
            <div className="track-timeline">
              {TRACK_STEPS.map((s, i) => (
                <div key={s.label} className={`track-step ${s.done ? 'done' : ''}`}>
                  <span className="track-dot">
                    {s.done ? <CheckCircle2 size={16} /> : <span className="track-dot-empty" />}
                  </span>
                  <div>
                    <strong>{s.label}</strong>
                    <small>{s.desc}</small>
                  </div>
                </div>
              ))}
            </div>
            <div className="track-eta">
              <MapPin size={15} />
              <span>Estimated delivery: <strong>{deliveryDate(5)}</strong></span>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!detailOrder} onClose={() => setDetailOrder(null)} small>
        {detailOrder && (
          <div className="track-body">
            <h3>Order Details</h3>
            <p className="track-order-id">{detailOrder.id} · {formatDate(detailOrder.date)}</p>
            <div className="detail-rows">
              {detailOrder.items.map((i) => (
                <div key={i.key} className="detail-row">
                  <span>{i.qty} × {i.name}</span>
                  <span>{formatPrice(i.price * i.qty)}</span>
                </div>
              ))}
              <div className="detail-row"><span>Subtotal</span><span>{formatPrice(detailOrder.subtotal)}</span></div>
              {detailOrder.discount > 0 && (
                <div className="detail-row discount"><span>Discount {detailOrder.coupon ? `(${detailOrder.coupon})` : ''}</span><span>− {formatPrice(detailOrder.discount)}</span></div>
              )}
              <div className="detail-row"><span>Delivery</span><span>{detailOrder.delivery === 0 ? 'FREE' : formatPrice(detailOrder.delivery)}</span></div>
              <div className="detail-row total"><span>Total</span><span>{formatPrice(detailOrder.total)}</span></div>
            </div>
            <div className="detail-address">
              <MapPin size={14} />
              <span>{detailOrder.address}</span>
            </div>
            <div className="detail-address">
              <CreditCard size={14} />
              <span>Paid via {detailOrder.payment}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
