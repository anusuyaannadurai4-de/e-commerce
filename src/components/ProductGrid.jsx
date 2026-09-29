import ProductCard from './ProductCard'

export default function ProductGrid({ products, emptyMessage = 'No products found.' }) {
  if (!products.length) {
    return <div className="empty-state"><p>{emptyMessage}</p></div>
  }
  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
