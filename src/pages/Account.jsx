import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Mail,
  Phone,
  Bell,
  Lock,
  Check,
} from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { PRODUCTS } from '../data/products'
import { formatDate } from '../utils'
import ProductCard from '../components/ProductCard'

const TABS = [
  { id: 'profile', label: 'Personal Information', icon: User },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
  { id: 'payments', label: 'Payment Methods', icon: CreditCard },
  { id: 'settings', label: 'Account Settings', icon: Settings },
]

const INITIAL_PROFILE = {
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  phone: '9876543210',
}

const INITIAL_ADDRESSES = [
  {
    id: 1,
    label: 'Home',
    line: '42, Palm Greens, 4th Cross, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    phone: '9876543210',
  },
  {
    id: 2,
    label: 'Office',
    line: 'Tower B, Manyata Tech Park, Nagavara',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560045',
    phone: '9876543210',
  },
]

const INITIAL_PAYMENTS = [
  { id: 1, type: 'card', label: 'HDFC Credit Card', detail: 'Visa •••• 4521', expiry: '09/28' },
  { id: 2, type: 'upi', label: 'UPI', detail: 'rahul@okhdfc' },
]

export default function Account() {
  const { showToast, wishlist, orders } = useStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState('profile')

  const [profile, setProfile] = useState(INITIAL_PROFILE)
  const [profileDraft, setProfileDraft] = useState(INITIAL_PROFILE)
  const [saved, setSaved] = useState(false)

  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES)
  const [showAddrForm, setShowAddrForm] = useState(false)
  const [addrForm, setAddrForm] = useState({ label: '', line: '', city: '', state: '', pincode: '', phone: '' })

  const [payments, setPayments] = useState(INITIAL_PAYMENTS)
  const [showPayForm, setShowPayForm] = useState(false)
  const [payForm, setPayForm] = useState({ label: '', detail: '', expiry: '' })

  const [prefs, setPrefs] = useState({ orders: true, offers: true, newsletter: false })

  const wishlistProducts = PRODUCTS.filter((p) => wishlist.includes(p.id))

  const saveProfile = (e) => {
    e.preventDefault()
    setProfile(profileDraft)
    setSaved(true)
    showToast('Profile updated successfully')
    setTimeout(() => setSaved(false), 2000)
  }

  const addAddress = (e) => {
    e.preventDefault()
    if (!addrForm.label || !addrForm.line || !addrForm.city || !addrForm.state || !/^\d{6}$/.test(addrForm.pincode)) {
      showToast('Please fill all address fields correctly', 'error')
      return
    }
    setAddresses((a) => [...a, { ...addrForm, id: Date.now() }])
    setAddrForm({ label: '', line: '', city: '', state: '', pincode: '', phone: '' })
    setShowAddrForm(false)
    showToast('Address saved')
  }

  const addPayment = (e) => {
    e.preventDefault()
    if (!payForm.label || !payForm.detail) {
      showToast('Please fill payment details', 'error')
      return
    }
    setPayments((p) => [...p, { ...payForm, id: Date.now() }])
    setPayForm({ label: '', detail: '', expiry: '' })
    setShowPayForm(false)
    showToast('Payment method saved')
  }

  const logout = () => {
    showToast('Logged out successfully. See you soon!', 'info')
    navigate('/')
  }

  return (
    <div className="container section">
      <div className="section-head">
        <span className="section-tag">My Account</span>
        <h2>Hello, {profile.name.split(' ')[0]}</h2>
        <p>Manage your profile, orders and preferences</p>
      </div>

      <div className="account-layout">
        <div className="account-menu">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={tab === t.id ? 'active' : ''}
              onClick={() => setTab(t.id)}
            >
              <t.icon size={17} />
              {t.label}
              {t.id === 'orders' && orders.length > 0 && (
                <span className="menu-badge">{orders.length}</span>
              )}
              {t.id === 'wishlist' && wishlist.length > 0 && (
                <span className="menu-badge">{wishlist.length}</span>
              )}
            </button>
          ))}
          <div className="menu-divider" />
          <button onClick={logout}>
            <LogOut size={17} /> Logout
          </button>
        </div>

        <div className="account-content">
          {tab === 'profile' && (
            <div className="account-card">
              <h3>Personal Information</h3>
              <form onSubmit={saveProfile}>
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="pf-name">Full Name</label>
                    <input id="pf-name" className="input" value={profileDraft.name} onChange={(e) => setProfileDraft({ ...profileDraft, name: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="pf-email">Email</label>
                    <input id="pf-email" type="email" className="input" value={profileDraft.email} onChange={(e) => setProfileDraft({ ...profileDraft, email: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="pf-phone">Phone</label>
                    <input id="pf-phone" className="input" value={profileDraft.phone} onChange={(e) => setProfileDraft({ ...profileDraft, phone: e.target.value })} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">
                  {saved ? <><Check size={15} /> Saved!</> : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {tab === 'orders' && (
            <div className="account-card">
              <h3>My Orders</h3>
              {orders.length ? (
                <div className="orders-list">
                  {orders.map((o) => (
                    <div key={o.id} className="order-row">
                      <div className="order-row-main">
                        <span className="order-id">{o.id}</span>
                        <span className="order-date">{formatDate(o.date)}</span>
                      </div>
                      <div className="order-row-items">
                        {o.items.slice(0, 3).map((i) => (
                          <span key={i.key} className="order-chip">{i.qty} × {i.name}</span>
                        ))}
                        {o.items.length > 3 && <span className="order-chip more">+{o.items.length - 3} more</span>}
                      </div>
                      <div className="order-row-foot">
                        <span className="order-total">₹{o.total.toLocaleString('en-IN')}</span>
                        <span className="status-badge placed">{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state small">
                  <Package size={36} className="empty-icon" />
                  <h4>No orders yet</h4>
                  <p>Your order history will appear here.</p>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate('/shop')}>Start Shopping</button>
                </div>
              )}
            </div>
          )}

          {tab === 'wishlist' && (
            <div className="account-card">
              <h3>My Wishlist</h3>
              {wishlistProducts.length ? (
                <div className="product-grid">
                  {wishlistProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <div className="empty-state small">
                  <Heart size={36} className="empty-icon" />
                  <h4>Wishlist is empty</h4>
                  <p>Save items you love for later.</p>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate('/shop')}>Browse Products</button>
                </div>
              )}
            </div>
          )}

          {tab === 'addresses' && (
            <div className="account-card">
              <div className="card-head">
                <h3>Saved Addresses</h3>
                <button className="btn btn-outline btn-sm" onClick={() => setShowAddrForm((s) => !s)}>
                  <Plus size={14} /> Add New
                </button>
              </div>

              {showAddrForm && (
                <form className="account-form" onSubmit={addAddress}>
                  <div className="form-grid">
                    <div className="form-field">
                      <label>Label</label>
                      <input className="input" placeholder="Home / Office" value={addrForm.label} onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value })} />
                    </div>
                    <div className="form-field">
                      <label>Phone</label>
                      <input className="input" placeholder="98765 43210" value={addrForm.phone} onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })} />
                    </div>
                    <div className="form-field span-2">
                      <label>Street Address</label>
                      <input className="input" placeholder="Flat, building, street, area" value={addrForm.line} onChange={(e) => setAddrForm({ ...addrForm, line: e.target.value })} />
                    </div>
                    <div className="form-field">
                      <label>City</label>
                      <input className="input" value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} />
                    </div>
                    <div className="form-field">
                      <label>State</label>
                      <input className="input" value={addrForm.state} onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })} />
                    </div>
                    <div className="form-field">
                      <label>Pincode</label>
                      <input className="input" maxLength={6} value={addrForm.pincode} onChange={(e) => setAddrForm({ ...addrForm, pincode: e.target.value.replace(/\D/g, '') })} />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-sm">Save Address</button>
                </form>
              )}

              <div className="address-list">
                {addresses.map((a) => (
                  <div key={a.id} className="address-card">
                    <div className="address-head">
                      <span className="address-label">{a.label}</span>
                      <button className="cart-icon-btn danger" onClick={() => { setAddresses((x) => x.filter((y) => y.id !== a.id)); showToast('Address removed', 'info') }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p>{a.line}</p>
                    <p>{a.city}, {a.state} — {a.pincode}</p>
                    <p className="address-phone"><Phone size={12} /> {a.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'payments' && (
            <div className="account-card">
              <div className="card-head">
                <h3>Payment Methods</h3>
                <button className="btn btn-outline btn-sm" onClick={() => setShowPayForm((s) => !s)}>
                  <Plus size={14} /> Add New
                </button>
              </div>

              {showPayForm && (
                <form className="account-form" onSubmit={addPayment}>
                  <div className="form-grid">
                    <div className="form-field">
                      <label>Label</label>
                      <input className="input" placeholder="My HDFC Card" value={payForm.label} onChange={(e) => setPayForm({ ...payForm, label: e.target.value })} />
                    </div>
                    <div className="form-field">
                      <label>Details</label>
                      <input className="input" placeholder="Card number or UPI ID" value={payForm.detail} onChange={(e) => setPayForm({ ...payForm, detail: e.target.value })} />
                    </div>
                    <div className="form-field">
                      <label>Expiry (optional)</label>
                      <input className="input" placeholder="MM/YY" value={payForm.expiry} onChange={(e) => setPayForm({ ...payForm, expiry: e.target.value })} />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-sm">Save Method</button>
                </form>
              )}

              <div className="address-list">
                {payments.map((p) => (
                  <div key={p.id} className="address-card payment-method">
                    <div className="address-head">
                      <span className="address-label">
                        {p.type === 'card' ? <CreditCard size={15} /> : <Mail size={15} />}
                        {p.label}
                      </span>
                      <button className="cart-icon-btn danger" onClick={() => { setPayments((x) => x.filter((y) => y.id !== p.id)); showToast('Payment method removed', 'info') }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p>{p.detail}{p.expiry ? ` · Expires ${p.expiry}` : ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'settings' && (
            <div className="account-card">
              <h3>Account Settings</h3>
              <div className="settings-list">
                <label className="setting-row">
                  <span>
                    <Bell size={16} />
                    <div>
                      <strong>Order updates</strong>
                      <small>Email & SMS notifications for your orders</small>
                    </div>
                  </span>
                  <input type="checkbox" checked={prefs.orders} onChange={(e) => setPrefs({ ...prefs, orders: e.target.checked })} />
                </label>
                <label className="setting-row">
                  <span>
                    <Mail size={16} />
                    <div>
                      <strong>Offers & promotions</strong>
                      <small>Receive deals, discounts and new arrival alerts</small>
                    </div>
                  </span>
                  <input type="checkbox" checked={prefs.offers} onChange={(e) => setPrefs({ ...prefs, offers: e.target.checked })} />
                </label>
                <label className="setting-row">
                  <span>
                    <Lock size={16} />
                    <div>
                      <strong>Newsletter</strong>
                      <small>Weekly style inspiration and curated picks</small>
                    </div>
                  </span>
                  <input type="checkbox" checked={prefs.newsletter} onChange={(e) => setPrefs({ ...prefs, newsletter: e.target.checked })} />
                </label>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => showToast('Settings saved')}>
                <Check size={14} /> Save Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
