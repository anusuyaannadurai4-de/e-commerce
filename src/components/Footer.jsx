import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Send,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react'
import { useStore } from '../context/StoreContext'

const COLUMNS = [
  {
    title: 'Company',
    links: ['About Us', 'Careers', 'Blog', 'Press'],
  },
  {
    title: 'Support',
    links: ['Contact Us', 'Customer Support', 'FAQ', 'Shipping Information'],
  },
  {
    title: 'Policies',
    links: ['Privacy Policy', 'Terms & Conditions', 'Return Policy', 'Refund Policy'],
  },
]

export default function Footer() {
  const { showToast } = useStore()
  const [email, setEmail] = useState('')

  const subscribe = (e) => {
    e.preventDefault()
    if (!email.includes('@')) {
      showToast('Please enter a valid email address', 'error')
      return
    }
    setEmail('')
    showToast('Subscribed! Welcome to the ShopEase family')
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="logo logo-light">
              <span className="logo-icon">
                <ShoppingBag size={20} />
              </span>
              <span className="logo-text">
                Shop<em>Ease</em>
              </span>
            </Link>
            <p>
              Your one-stop destination for fashion, electronics, beauty and lifestyle.
              Premium products, unbeatable prices, delivered to your doorstep.
            </p>
            <div className="social-row">
              <a href="#" aria-label="Facebook" className="social-btn"><Facebook size={16} /></a>
              <a href="#" aria-label="Instagram" className="social-btn"><Instagram size={16} /></a>
              <a href="#" aria-label="Twitter" className="social-btn"><Twitter size={16} /></a>
              <a href="#" aria-label="YouTube" className="social-btn"><Youtube size={16} /></a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4>{col.title}</h4>
              {col.links.map((l) => (
                <a key={l} href="#">{l}</a>
              ))}
            </div>
          ))}

          <div>
            <h4>Stay in the loop</h4>
            <p className="footer-news-text">
              Subscribe for exclusive offers, new arrivals and style inspiration.
            </p>
            <form className="newsletter" onSubmit={subscribe}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email for newsletter"
              />
              <button type="submit" aria-label="Subscribe">
                <Send size={16} />
              </button>
            </form>
            <ul className="footer-contact">
              <li><MapPin size={14} /> 123 Commerce Street, Bengaluru 560001</li>
              <li><Phone size={14} /> +91 98765 43210</li>
              <li><Mail size={14} /> support@shopease.in</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ShopEase. All rights reserved.</span>
          <span>Made with care in India</span>
        </div>
      </div>
    </footer>
  )
}
