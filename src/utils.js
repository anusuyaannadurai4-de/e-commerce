export function formatPrice(n) {
  return '₹' + Number(n || 0).toLocaleString('en-IN')
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function deliveryDate(days = 5) {
  return new Date(Date.now() + days * 86400000).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function discountPercent(price, originalPrice) {
  return Math.round((1 - price / originalPrice) * 100)
}
