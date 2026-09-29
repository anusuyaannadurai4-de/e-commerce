import { CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { useStore } from '../context/StoreContext'

const ICONS = {
  success: <CheckCircle2 size={18} />,
  error: <AlertCircle size={18} />,
  info: <Info size={18} />,
}

export default function ToastNotification() {
  const { toasts } = useStore()
  return (
    <div className="toast-wrap" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          {ICONS[t.type] || ICONS.success}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}
