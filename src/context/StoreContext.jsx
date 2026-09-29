import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { COUPONS, PRODUCTS } from '../data/products'

const StoreContext = createContext(null)

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load('shopease_cart', []))
  const [wishlist, setWishlist] = useState(() => load('shopease_wishlist', []))
  const [orders, setOrders] = useState(() => load('shopease_orders', []))
  const [toasts, setToasts] = useState([])
  const [coupon, setCoupon] = useState(null)

  useEffect(() => {
    localStorage.setItem('shopease_cart', JSON.stringify(cart))
  }, [cart])
  useEffect(() => {
    localStorage.setItem('shopease_wishlist', JSON.stringify(wishlist))
  }, [wishlist])
  useEffect(() => {
    localStorage.setItem('shopease_orders', JSON.stringify(orders))
  }, [orders])

  const showToast = useCallback((message, type = 'success') => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  const addToCart = useCallback(
    (product, qty = 1, options = {}) => {
      const key = `${product.id}-${options.color || ''}-${options.size || ''}`
      setCart((prev) => {
        const existing = prev.find((i) => i.key === key)
        if (existing) {
          return prev.map((i) =>
            i.key === key ? { ...i, qty: Math.min(i.qty + qty, 10) } : i
          )
        }
        return [...prev, { key, productId: product.id, qty, options }]
      })
      showToast(`${product.name} added to cart`)
    },
    [showToast]
  )

  const removeFromCart = useCallback((key) => {
    setCart((prev) => prev.filter((i) => i.key !== key))
  }, [])

  const updateQty = useCallback((key, delta) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.key === key ? { ...i, qty: Math.max(1, Math.min(10, i.qty + delta)) } : i
        )
        .filter((i) => i.qty > 0)
    )
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const toggleWishlist = useCallback(
    (product) => {
      setWishlist((prev) => {
        if (prev.includes(product.id)) {
          showToast(`${product.name} removed from wishlist`, 'info')
          return prev.filter((id) => id !== product.id)
        }
        showToast(`${product.name} saved to wishlist`)
        return [...prev, product.id]
      })
    },
    [showToast]
  )

  const moveToCart = useCallback(
    (productId) => {
      const product = PRODUCTS.find((p) => p.id === productId)
      if (!product) return
      addToCart(product)
      setWishlist((prev) => prev.filter((id) => id !== productId))
    },
    [addToCart]
  )

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  const cartSubtotal = cart.reduce((s, i) => {
    const p = PRODUCTS.find((x) => x.id === i.productId)
    return s + (p ? p.price * i.qty : 0)
  }, 0)

  const applyCoupon = useCallback(
    (code) => {
      const c = COUPONS[code.trim().toUpperCase()]
      if (c) {
        setCoupon({ code: code.trim().toUpperCase(), ...c })
        showToast(`Coupon ${code.trim().toUpperCase()} applied!`)
        return true
      }
      showToast('Invalid coupon code', 'error')
      return false
    },
    [showToast]
  )

  const removeCoupon = useCallback(() => setCoupon(null), [])

  const discount = coupon
    ? coupon.type === 'percent'
      ? Math.round((cartSubtotal * coupon.value) / 100)
      : Math.min(coupon.value, cartSubtotal)
    : 0

  const delivery = cart.length === 0 || cartSubtotal - discount >= 999 ? 0 : 49
  const total = Math.max(0, cartSubtotal - discount) + delivery

  const placeOrder = useCallback(
    (info) => {
      const order = {
        id: 'SE' + Date.now().toString(36).toUpperCase(),
        date: new Date().toISOString(),
        items: cart.map((i) => {
          const p = PRODUCTS.find((x) => x.id === i.productId)
          return {
            key: i.key,
            productId: i.productId,
            name: p.name,
            price: p.price,
            qty: i.qty,
            options: i.options,
            gradient: p.gradient,
            icon: p.icon,
          }
        }),
        subtotal: cartSubtotal,
        discount,
        delivery,
        total,
        coupon: coupon ? coupon.code : null,
        status: 'Placed',
        payment: info.payment,
        address: info.address,
        deliveryDate: new Date(Date.now() + 5 * 86400000).toISOString(),
      }
      setOrders((prev) => [order, ...prev])
      setCart([])
      setCoupon(null)
      return order
    },
    [cart, cartSubtotal, discount, delivery, total, coupon]
  )

  const value = {
    cart,
    cartCount,
    cartSubtotal,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    wishlist,
    toggleWishlist,
    moveToCart,
    orders,
    placeOrder,
    toasts,
    showToast,
    coupon,
    applyCoupon,
    removeCoupon,
    discount,
    delivery,
    total,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  return useContext(StoreContext)
}
