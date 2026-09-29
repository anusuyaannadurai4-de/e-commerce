import { useEffect, useState } from 'react'

// Counts down to midnight (end of the current day)
export function useCountdown() {
  const [target] = useState(() => {
    const d = new Date()
    d.setHours(23, 59, 59, 999)
    return d.getTime()
  })

  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const diff = Math.max(0, target - now)
  return {
    hours: Math.floor(diff / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}
