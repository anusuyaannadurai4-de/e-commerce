import { useNavigate } from 'react-router-dom'
import { Shirt, Zap, Sparkles, Footprints, Gem, Lamp, ArrowUpRight } from 'lucide-react'

const ICONS = {
  shirt: Shirt,
  zap: Zap,
  sparkles: Sparkles,
  footprints: Footprints,
  gem: Gem,
  lamp: Lamp,
}

export default function CategoryCard({ category, count }) {
  const navigate = useNavigate()
  const Icon = ICONS[category.icon] || Sparkles

  return (
    <button
      className="category-card"
      onClick={() => navigate(`/shop?category=${encodeURIComponent(category.name)}`)}
    >
      <span
        className="category-icon"
        style={{
          background: `linear-gradient(135deg, ${category.gradient[0]}, ${category.gradient[1]})`,
        }}
      >
        <Icon size={28} color="#fff" strokeWidth={1.5} />
      </span>
      <span className="category-name">{category.name}</span>
      <span className="category-meta">
        {count} products <ArrowUpRight size={13} />
      </span>
    </button>
  )
}
