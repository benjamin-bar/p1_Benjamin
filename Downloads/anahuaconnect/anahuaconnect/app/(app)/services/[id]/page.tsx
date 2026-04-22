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
    <div>
      {/* Hero banner */}
      <div className="h-36 md:h-52 bg-navy flex items-center justify-center text-6xl md:text-8xl">
        {cat.emoji}
      </div>

      {/* Desktop: 2-col | Mobile: single col */}
      <div className="md:grid md:grid-cols-3 md:gap-6 md:px-6 md:py-6 md:items-start">

        {/* ── Main content ── */}
        <div className="md:col-span-2 space-y-4 px-4 py-4 md:px-0 md:py-0 pb-36 md:pb-4">

          {/* Title + Price (mobile only shows price inline) */}
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl font-bold text-gray-900 flex-1">{service.title}</h1>
            <p className="text-2xl font-bold text-brand flex-shrink-0 md:hidden">
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

        {/* ── Desktop sticky purchase panel ── */}
        <div className="hidden md:block sticky top-20 self-start">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <div>
              <p className="text-3xl font-bold text-brand">{formatMXN(service.price)}</p>
              <p className="text-xs text-gray-400 mt-0.5">Precio por servicio</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-xl px-3 py-2.5">
              <Clock size={14} className="text-gray-400 flex-shrink-0" />
              Entrega en {service.delivery_days} días hábiles
            </div>
            <ul className="space-y-1.5 text-xs text-gray-500">
              {['Archivos editables incluidos', 'Una ronda de ajustes gratis', 'Soporte 48 hrs post-entrega'].map(i => (
                <li key={i} className="flex items-center gap-1.5">
                  <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                  {i}
                </li>
              ))}
            </ul>
            <ContactButton providerId={provider?.id} serviceId={service.id} />
            <p className="text-[10px] text-gray-400 text-center">
              Sin cobros hasta acordar con el proveedor
            </p>
          </div>
        </div>
      </div>

      {/* ── Mobile sticky CTA (above bottom nav) ── */}
      <div className="md:hidden fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom))] left-0 right-0
                      bg-white/95 backdrop-blur border-t border-gray-100 px-4 py-3 z-10">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-lg font-bold text-brand leading-none">{formatMXN(service.price)}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{service.delivery_days} días de entrega</p>
          </div>
          <div className="flex-1">
            <ContactButton providerId={provider?.id} serviceId={service.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
