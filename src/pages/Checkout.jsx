import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  User,
  MapPin,
  Truck,
  CreditCard,
  Check,
  ChevronLeft,
  Smartphone,
  Landmark,
  Banknote,
  QrCode,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { getProduct } from '../data/products'
import { formatPrice, formatDate, deliveryDate } from '../utils'
import ProductImage from '../components/ProductImage'

const STEPS = [
  { n: 1, label: 'Customer Info', icon: User },
  { n: 2, label: 'Shipping Address', icon: MapPin },
  { n: 3, label: 'Delivery Method', icon: Truck },
  { n: 4, label: 'Payment', icon: CreditCard },
]

const DELIVERY_METHODS = [
  { id: 'standard', label: 'Standard Delivery', time: '4–6 business days', price: 0 },
  { id: 'express', label: 'Express Delivery', time: '2–3 business days', price: 99 },
  { id: 'priority', label: 'Priority Delivery', time: 'Next business day', price: 199 },
]

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', desc: 'GPay, PhonePe, Paytm & more', icon: QrCode },
  { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: CreditCard },
  { id: 'netbanking', label: 'Net Banking', desc: 'All major banks supported', icon: Landmark },
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: Banknote },
]

const BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank']

const initialForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
}

export default function Checkout() {
  const { cart, cartSubtotal, discount, delivery, total, coupon, placeOrder } = useStore()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [deliveryMethod, setDeliveryMethod] = useState('standard')
  const [payment, setPayment] = useState('upi')
  const [upiId, setUpiId] = useState('')
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [bank, setBank] = useState(BANKS[0])

  if (!cart.length) {
    return (
      <div className="container section">
        <div className="empty-state">
          <span className="empty-icon-wrap"><ShoppingBag size={44} /></span>
          <h2>Nothing to checkout</h2>
          <p>Your cart is empty. Add some products before proceeding to checkout.</p>
          <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const validateStep = () => {
    const errs = {}
    if (step === 1) {
      if (form.name.trim().length < 2) errs.name = 'Enter your full name'
      if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email'
      if (!/^\d{10}$/.test(form.phone)) errs.phone = 'Enter a valid 10-digit mobile number'
    }
    if (step === 2) {
      if (form.address.trim().length < 5) errs.address = 'Enter your street address'
      if (!form.city.trim()) errs.city = 'Enter your city'
      if (!form.state.trim()) errs.state = 'Enter your state'
      if (!/^\d{6}$/.test(form.pincode)) errs.pincode = 'Enter a valid 6-digit pincode'
    }
    if (step === 4) {
      if (payment === 'upi' && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upiId)) errs.upi = 'Enter a valid UPI ID (e.g. name@okhdfc)'
      if (payment === 'card') {
        if (!/^\d{16}$/.test(card.number.replace(/\s/g, ''))) errs.cardNumber = 'Enter a valid 16-digit card number'
        if (!card.name.trim()) errs.cardName = 'Enter the name on card'
        if (!/^\d{2}\/\d{2}$/.test(card.expiry)) errs.expiry = 'MM/YY'
        if (!/^\d{3}$/.test(card.cvv)) errs.cvv = '3-digit CVV'
      }
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const next = () => {
    if (validateStep()) setStep((s) => Math.min(4, s + 1))
  }

  const placeOrderHandler = () => {
    if (!validateStep()) return
    const methodLabel =
      payment === 'upi' ? `UPI (${upiId})` : payment === 'card' ? `Card •••• ${card.number.slice(-4)}` : payment === 'netbanking' ? `Net Banking (${bank})` : 'Cash on Delivery'
    const order = placeOrder({
      payment: methodLabel,
      address: `${form.address}, ${form.city}, ${form.state} — ${form.pincode}`,
    })
    navigate(`/order-success/${order.id}`)
  }

  const deliveryCharge = DELIVERY_METHODS.find((d) => d.id === deliveryMethod).price
  const grandTotal = cartSubtotal - discount + deliveryCharge

  return (
    <div className="container section">
      <div className="section-head">
        <span className="section-tag">Almost there</span>
        <h2>Checkout</h2>
        <p>Complete your order in 4 simple steps</p>
      </div>

      <div className="stepper">
        {STEPS.map((s) => (
          <div key={s.n} className={`step ${step === s.n ? 'active' : ''} ${step > s.n ? 'done' : ''}`}>
            {step > s.n ? <Check size={14} /> : <s.icon size={14} />}
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="checkout-layout">
        <div className="checkout-form">
          {step === 1 && (
            <div className="account-card">
              <h3>Customer Information</h3>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="co-name">Full Name</label>
                  <input id="co-name" className="input" placeholder="Rahul Sharma" value={form.name} onChange={set('name')} />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="form-field">
                  <label htmlFor="co-email">Email Address</label>
                  <input id="co-email" type="email" className="input" placeholder="rahul@example.com" value={form.email} onChange={set('email')} />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
                <div className="form-field">
                  <label htmlFor="co-phone">Mobile Number</label>
                  <input id="co-phone" className="input" placeholder="98765 43210" value={form.phone} onChange={set('phone')} maxLength={10} />
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="account-card">
              <h3>Shipping Address</h3>
              <div className="form-grid">
                <div className="form-field span-2">
                  <label htmlFor="co-addr">Street Address</label>
                  <input id="co-addr" className="input" placeholder="Flat, house no., building, street, area" value={form.address} onChange={set('address')} />
                  {errors.address && <span className="field-error">{errors.address}</span>}
                </div>
                <div className="form-field">
                  <label htmlFor="co-city">City</label>
                  <input id="co-city" className="input" placeholder="Bengaluru" value={form.city} onChange={set('city')} />
                  {errors.city && <span className="field-error">{errors.city}</span>}
                </div>
                <div className="form-field">
                  <label htmlFor="co-state">State</label>
                  <input id="co-state" className="input" placeholder="Karnataka" value={form.state} onChange={set('state')} />
                  {errors.state && <span className="field-error">{errors.state}</span>}
                </div>
                <div className="form-field">
                  <label htmlFor="co-pin">Pincode</label>
                  <input id="co-pin" className="input" placeholder="560001" value={form.pincode} onChange={set('pincode')} maxLength={6} />
                  {errors.pincode && <span className="field-error">{errors.pincode}</span>}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="account-card">
              <h3>Delivery Method</h3>
              <div className="radio-list">
                {DELIVERY_METHODS.map((d) => (
                  <label key={d.id} className={`radio-card ${deliveryMethod === d.id ? 'active' : ''}`}>
                    <input type="radio" name="delivery" checked={deliveryMethod === d.id} onChange={() => setDeliveryMethod(d.id)} />
                    <Truck size={18} />
                    <span className="radio-card-text">
                      <strong>{d.label}</strong>
                      <small>{d.time}</small>
                    </span>
                    <span className="radio-card-price">{d.price === 0 ? 'FREE' : formatPrice(d.price)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="account-card">
              <h3>Payment Method</h3>
              <div className="radio-list">
                {PAYMENT_METHODS.map((m) => (
                  <label key={m.id} className={`radio-card ${payment === m.id ? 'active' : ''}`}>
                    <input type="radio" name="payment" checked={payment === m.id} onChange={() => setPayment(m.id)} />
                    <m.icon size={18} />
                    <span className="radio-card-text">
                      <strong>{m.label}</strong>
                      <small>{m.desc}</small>
                    </span>
                  </label>
                ))}
              </div>

              {payment === 'upi' && (
                <div className="form-field pay-extra">
                  <label htmlFor="upi-id">UPI ID</label>
                  <input id="upi-id" className="input" placeholder="yourname@okhdfc" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                  {errors.upi && <span className="field-error">{errors.upi}</span>}
                </div>
              )}

              {payment === 'card' && (
                <div className="form-grid pay-extra">
                  <div className="form-field span-2">
                    <label htmlFor="cc-num">Card Number</label>
                    <input id="cc-num" className="input" placeholder="1234 5678 9012 3456" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value.replace(/\D/g, '').slice(0, 16) })} />
                    {errors.cardNumber && <span className="field-error">{errors.cardNumber}</span>}
                  </div>
                  <div className="form-field span-2">
                    <label htmlFor="cc-name">Name on Card</label>
                    <input id="cc-name" className="input" placeholder="RAHUL SHARMA" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
                    {errors.cardName && <span className="field-error">{errors.cardName}</span>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="cc-exp">Expiry</label>
                    <input id="cc-exp" className="input" placeholder="MM/YY" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} />
                    {errors.expiry && <span className="field-error">{errors.expiry}</span>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="cc-cvv">CVV</label>
                    <input id="cc-cvv" type="password" className="input" placeholder="•••" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })} />
                    {errors.cvv && <span className="field-error">{errors.cvv}</span>}
                  </div>
                </div>
              )}

              {payment === 'netbanking' && (
                <div className="form-field pay-extra">
                  <label htmlFor="bank">Select Bank</label>
                  <select id="bank" className="select" value={bank} onChange={(e) => setBank(e.target.value)}>
                    {BANKS.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </div>
              )}

              {payment === 'cod' && (
                <p className="pay-note">Pay in cash or via UPI when your order is delivered. Please keep exact change ready if possible.</p>
              )}
            </div>
          )}

          <div className="checkout-nav">
            {step > 1 && (
              <button className="btn btn-outline" onClick={() => setStep((s) => s - 1)}>
                <ChevronLeft size={15} /> Back
              </button>
            )}
            {step < 4 ? (
              <button className="btn btn-primary" onClick={next}>
                Continue <ChevronLeft size={15} className="flip" />
              </button>
            ) : (
              <button className="btn btn-primary" onClick={placeOrderHandler}>
                <ShieldCheck size={16} /> Place Order · {formatPrice(grandTotal)}
              </button>
            )}
          </div>
        </div>

        <div className="summary-card">
          <h3 className="summary-title">Order Summary</h3>
          <div className="summary-items">
            {cart.map((i) => {
              const p = getProduct(i.productId)
              if (!p) return null
              return (
                <div key={i.key} className="summary-item has-img">
                  <ProductImage product={p} className="summary-item-img" iconSize={18} />
                  <span className="summary-item-name">
                    {i.qty} × {p.name}
                  </span>
                  <span className="summary-item-price">{formatPrice(p.price * i.qty)}</span>
                </div>
              )
            })}
          </div>
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
              <span>Delivery ({DELIVERY_METHODS.find((d) => d.id === deliveryMethod).label})</span>
              <span>{deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
          </div>
          <p className="summary-note">
            <ShieldCheck size={13} /> 100% secure payments · Estimated delivery by {deliveryDate(5)}
          </p>
        </div>
      </div>
    </div>
  )
}
