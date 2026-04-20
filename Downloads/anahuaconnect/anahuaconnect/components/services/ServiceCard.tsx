import Link from 'next/link'
import { Star } from 'lucide-react'
import { type Service, CATEGORIES } from '@/types'
import { formatMXN, getInitials, cn } from '@/lib/utils'

const AVATAR_COLORS = [
  'bg-purple-500', 'bg-blue-500', 'bg-green-500',
  'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
]

function avatarColor(id: string) {
  const n = id.charCodeAt(0) % AVATAR_COLORS.length
  return AVATAR_COLORS[n]
}

interface Props {
  service: Service
  compact?: boolean
}

export default function ServiceCard({ service, compact = false }: Props) {
  const cat = CATEGORIES[service.category]
  const name = service.provider?.full_name ?? 'Proveedor'
  const rating = service.avg_rating ?? service.provider?.rating ?? 0
  const reviews = service.review_count ?? service.provider?.review_count ?? 0

  return (
    <Link href={`/services/${service.id}`}
      className={cn(
        'flex gap-3 bg-white rounded-2xl border border-gray-100 p-3.5',
        'active:scale-[0.98] transition-all hover:shadow-sm',
        compact ? 'items-center' : 'items-start'
      )}>
      {/* Category icon */}
      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl',
        cat.color)}>
        {cat.emoji}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <p className="font-medium text-gray-900 text-sm leading-snug line-clamp-2 flex-1">
            {service.title}
          </p>
          <p className="text-brand font-semibold text-sm flex-shrink-0">
            {formatMXN(service.price)}
          </p>
        </div>

        {!compact && (
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{service.description}</p>
        )}

        <div className="flex items-center gap-1.5 mt-1.5">
          {/* Provider avatar */}
          <div className={cn('avatar w-5 h-5 text-[9px]', avatarColor(service.provider_id))}>
            {getInitials(name)}
          </div>
          <span className="text-xs text-gray-500 flex-1 truncate">{name.split(' ')[0]}</span>

          {rating > 0 ? (
            <div className="flex items-center gap-0.5">
              <Star size={11} className="text-brand fill-brand" />
              <span className="text-xs text-gray-500">{rating.toFixed(1)}</span>
              {reviews > 0 && <span className="text-xs text-gray-400">({reviews})</span>}
            </div>
          ) : (
            <span className="tag bg-teal-50 text-teal-700 text-[10px]">Nuevo</span>
          )}
        </div>
      </div>
    </Link>
  )
}
