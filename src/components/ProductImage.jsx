import { useState } from 'react'
import {
  Shirt,
  Headphones,
  Sparkles,
  Footprints,
  Watch,
  Lamp,
  Activity,
  Droplets,
  Wallet,
  Flame,
  Speaker,
  Zap,
  Package,
} from 'lucide-react'

const ICONS = {
  shirt: Shirt,
  headphones: Headphones,
  sparkles: Sparkles,
  footprints: Footprints,
  watch: Watch,
  lamp: Lamp,
  activity: Activity,
  droplets: Droplets,
  wallet: Wallet,
  flame: Flame,
  speaker: Speaker,
  zap: Zap,
}

export default function ProductImage({ product, className = '', iconSize = 72, angle }) {
  const [imgError, setImgError] = useState(false)
  const Icon = ICONS[product.icon] || Package
  const gradient =
    angle != null
      ? `linear-gradient(${angle}deg, ${product.gradient[0]}, ${product.gradient[1]})`
      : `linear-gradient(135deg, ${product.gradient[0]}, ${product.gradient[1]})`

  if (!product.image || imgError) {
    return (
      <div className={`product-image ${className}`} style={{ background: gradient }}>
        <div className="product-image-shine" />
        <Icon size={iconSize} color="rgba(255,255,255,0.92)" strokeWidth={1.1} />
      </div>
    )
  }

  return (
    <img
      src={product.image}
      alt={product.name}
      loading="lazy"
      onError={() => setImgError(true)}
      className={`product-image product-image-img ${className}`}
    />
  )
}
