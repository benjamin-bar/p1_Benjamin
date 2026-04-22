import { createClient } from '@/supabase/server'
import { CATEGORIES, type ServiceCategory } from '@/types'
import ServiceCard from '@/components/services/ServiceCard'
import Link from 'next/link'

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const supabase = createClient()
  const activeCategory = searchParams.category as ServiceCategory | undefined

  // Fetch services with provider profile joined
  let query = supabase
    .from('services')
    .select(`
      *,
      provider:profiles(id, full_name, career, rating, review_count, avatar_url)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (activeCategory) {
    query = query.eq('category', activeCategory)
  }

  const { data } = await query.limit(30)
  const services = data ?? []

  const featured = services.slice(0, 3)
  const recent = services.slice(3)

  return (
    <div>
      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-3 bg-white border-b border-gray-100">
        <Link
          href="/catalog"
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
            !activeCategory
              ? 'bg-navy text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}>
          Todos
        </Link>
        {(Object.entries(CATEGORIES) as [ServiceCategory, typeof CATEGORIES[ServiceCategory]][]).map(
          ([key, cat]) => (
            <Link
              key={key}
              href={`/catalog?category=${key}`}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCategory === key
                  ? 'bg-navy text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              <span>{cat.emoji}</span>
              {cat.label}
            </Link>
          )
        )}
      </div>

      <div className="px-4 py-4 space-y-5">
        {services.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-500 text-sm">No hay servicios en esta categoría aún.</p>
            <Link href="/services/new"
              className="inline-block mt-4 px-5 py-2.5 bg-brand text-white text-sm
                         rounded-xl font-medium hover:bg-brand-dark transition-colors">
              Sé el primero en publicar
            </Link>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-700 mb-3">
                  {activeCategory ? CATEGORIES[activeCategory].label : '⭐ Destacados'}
                </h2>
                {/* Mobile: horizontal scroll */}
                <div className="md:hidden flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
                  {featured.map(s => (
                    <div key={s.id} className="w-[72vw] max-w-[280px] flex-shrink-0">
                      <ServiceCard service={s as any} />
                    </div>
                  ))}
                </div>
                {/* Desktop: grid */}
                <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-2.5">
                  {featured.map(s => (
                    <ServiceCard key={s.id} service={s as any} />
                  ))}
                </div>
              </section>
            )}

            {/* Recent */}
            {recent.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-700 mb-3">
                  🆕 Recién publicados
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
                  {recent.map(s => (
                    <ServiceCard key={s.id} service={s as any} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}
