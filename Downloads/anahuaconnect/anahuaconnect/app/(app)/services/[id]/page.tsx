import { createClient } from '@/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CATEGORIES } from '@/types'
import { formatMXN, getInitials, renderStars, formatDate } from '@/lib/utils'
import { Clock, CheckCircle, Star, MessageCircle } from 'lucide-react'
import ContactButton from '@/components/services/ContactButton'

export default async function ServiceDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: service } = await supabase
    .from('services')
    .select(`*, provider:profiles(*)`)
    .eq('id', params.id)
    .single()

  if (!service) notFound()

  const { data: reviewsData } = await supabase
    .from('reviews')
    .select(`*, reviewer:profiles(full_name)`)
    .eq('service_id', params.id)
    .order('created_at', { ascending: false })
    .limit(5)
  const reviews = reviewsData ?? []

  const cat = CATEGORIES[service.category as keyof typeof CATEGORIES]
  const provider = service.provider as any

  return (
    <div className="pb-32">
      {/* Hero banner */}
      <div className="h-36 bg-navy flex items-center justify-center text-6xl">
        {cat.emoji}
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Title + Price */}
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-bold text-gray-900 flex-1">{service.title}</h1>
          <p className="text-2xl font-bold text-brand flex-shrink-0">
            {formatMXN(service.price)}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span className={`tag ${cat.color}`}>{cat.label}</span>
          <span className="tag bg-gray-100 text-gray-600 flex items-center gap-1">
            <Clock size={11} /> {service.delivery_days} días
          </span>
          {service.tags?.map((t: string) => (
            <span key={t} className="tag bg-gray-100 text-gray-600">{t}</span>
          ))}
        </div>

        {/* Provider card */}
        <Link href={`/profile/${provider?.id}`}
          className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-3.5
                     hover:shadow-sm transition-shadow active:scale-[0.99]">
          <div className="avatar w-12 h-12 text-base bg-purple-500 flex-shrink-0">
            {getInitials(provider?.full_name ?? '')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm">{provider?.full_name}</p>
            <p className="text-xs text-gray-400">{provider?.career} · {provider?.semester}° sem</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-brand text-sm font-medium">
              {renderStars(provider?.rating ?? 0)}
            </p>
            <p className="text-xs text-gray-400">{provider?.review_count ?? 0} reseñas</p>
          </div>
        </Link>

        {/* Description */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h2 className="font-semibold text-gray-900 text-sm mb-2">Descripción</h2>
          <p className="text-sm text-gray-500 leading-relaxed">{service.description}</p>
        </div>

        {/* What's included */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h2 className="font-semibold text-gray-900 text-sm mb-3">Incluye</h2>
          <ul className="space-y-2">
            {[
              `Entrega en ${service.delivery_days} días hábiles`,
              'Código fuente / archivos editables',
              'Una ronda de ajustes sin costo',
              'Soporte post-entrega 48 hrs',
            ].map(item => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div>
            <h2 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-1.5">
              <Star size={15} className="text-brand fill-brand" />
              Reseñas ({reviews.length})
            </h2>
            <div className="space-y-2.5">
              {reviews.map((r: any) => (
                <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-3.5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="avatar w-7 h-7 text-xs bg-brand">
                      {getInitials(r.reviewer?.full_name ?? 'U')}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-800">{r.reviewer?.full_name}</p>
                      <p className="text-brand text-xs">{renderStars(r.rating)}</p>
                    </div>
                    <span className="ml-auto text-xs text-gray-400">{formatDate(r.created_at)}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-md
                      bg-white border-t border-gray-100 px-4 py-3 z-10">
        <ContactButton providerId={provider?.id} serviceId={service.id} />
      </div>
    </div>
  )
}
