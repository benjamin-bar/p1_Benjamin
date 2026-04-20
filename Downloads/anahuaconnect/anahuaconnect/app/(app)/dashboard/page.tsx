import { createClient } from '@/supabase/server'
import { formatMXN, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { LayoutDashboard, Plus } from 'lucide-react'
import ServiceCard from '@/components/services/ServiceCard'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [
    { data: servicesData },
    { data: ordersData },
    { data: profile },
  ] = await Promise.all([
    supabase.from('services').select('*').eq('provider_id', user?.id).order('created_at', { ascending: false }),
    supabase.from('orders')
      .select(`*, service:services(title), client:profiles!orders_client_id_fkey(full_name)`)
      .eq('provider_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase.from('profiles').select('*').eq('id', user?.id).single(),
  ])

  const services = servicesData ?? []
  const orders = ordersData ?? []

  const totalEarned = (orders as any[])
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.price, 0)

  const activeOrders = (orders as any[]).filter(o =>
    ['pending', 'in_progress', 'delivered'].includes(o.status)
  )

  const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
    pending:     { label: 'Pendiente',    classes: 'bg-amber-50 text-amber-700' },
    in_progress: { label: 'En proceso',   classes: 'bg-blue-50 text-blue-700'   },
    delivered:   { label: 'Entregado',    classes: 'bg-purple-50 text-purple-700'},
    completed:   { label: 'Completado',   classes: 'bg-green-50 text-green-700' },
    cancelled:   { label: 'Cancelado',    classes: 'bg-red-50 text-red-700'     },
  }

  return (
    <div className="px-4 py-4 space-y-5">
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Ganado este mes', value: formatMXN(totalEarned), accent: true },
          { label: 'Servicios activos', value: String(services.length) },
          { label: 'Pedidos totales', value: String(orders.length) },
          { label: 'Calificación', value: (profile as any)?.rating?.toFixed(1) ?? '—', accent: true },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <p className={`text-2xl font-bold ${stat.accent ? 'text-brand' : 'text-gray-900'}`}>
              {stat.value}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Active orders */}
      {activeOrders.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Pedidos activos</h2>
          <div className="space-y-2.5">
            {activeOrders.map((order: any) => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {order.service?.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order.client?.full_name} · {formatMXN(order.price)}
                    </p>
                  </div>
                  <span className={`tag text-[10px] ml-2 flex-shrink-0 ${STATUS_CONFIG[order.status]?.classes}`}>
                    {STATUS_CONFIG[order.status]?.label}
                  </span>
                </div>
                {order.status === 'in_progress' && (
                  <>
                    <div className="h-1.5 bg-gray-100 rounded-full mt-2">
                      <div
                        className="h-full bg-brand rounded-full transition-all"
                        style={{ width: `${order.progress ?? 0}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{order.progress ?? 0}% completado</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* My services */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">Mis servicios</h2>
          <Link href="/services/new"
            className="flex items-center gap-1 text-brand text-xs font-medium">
            <Plus size={14} /> Publicar
          </Link>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
            <LayoutDashboard size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">Aún no tienes servicios publicados.</p>
            <Link href="/services/new"
              className="inline-block mt-3 px-4 py-2 bg-brand text-white text-sm
                         rounded-xl font-medium hover:bg-brand-dark transition-colors">
              Publicar mi primer servicio
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {(services as any[]).map(s => (
              <ServiceCard key={s.id} service={s} compact />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
