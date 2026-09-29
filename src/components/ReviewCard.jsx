import Stars from './Stars'
import { BadgeCheck } from 'lucide-react'

export default function ReviewCard({ review }) {
  const initial = review.name.charAt(0).toUpperCase()
  return (
    <div className="review-card">
      <div className="review-head">
        <span className="review-avatar">{initial}</span>
        <div>
          <span className="review-name">
            {review.name}
            <BadgeCheck size={14} className="review-verified" />
          </span>
          <div className="review-meta">
            <Stars rating={review.rating} size={13} />
            <span className="review-date">{review.date}</span>
          </div>
        </div>
      </div>
      <p className="review-comment">{review.comment}</p>
    </div>
  )
}
