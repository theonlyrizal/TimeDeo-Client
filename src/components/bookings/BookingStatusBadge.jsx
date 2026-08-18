import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'

const STATUS = {
  pending: { key: 'status.pending', variant: 'warning' },
  in_progress: { key: 'status.in_progress', variant: 'brand' },
  completed: { key: 'status.completed', variant: 'success' },
  cancelled: { key: 'status.cancelled', variant: 'muted' },
  disputed: { key: 'status.disputed', variant: 'destructive' },
}

export function BookingStatusBadge({ status }) {
  const { t } = useTranslation()
  const s = STATUS[status] || STATUS.pending
  return <Badge variant={s.variant}>{t(s.key)}</Badge>
}
