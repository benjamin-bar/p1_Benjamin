import { createClient } from '@/supabase/server'
import Link from 'next/link'
import { getInitials, formatRelativeTime } from '@/lib/utils'
import { MessageCircle } from 'lucide-react'

export default async function ChatListPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: conversationsData } = await supabase
    .from('conversations')
    .select(`
      *,
      service:services(title, category),
      client:profiles!conversations_client_id_fkey(id, full_name),
      provider:profiles!conversations_provider_id_fkey(id, full_name)
    `)
    .or(`client_id.eq.${user?.id},provider_id.eq.${user?.id}`)
    .order('last_message_at', { ascending: false })
  const conversations = conversationsData ?? []

  return (
    <div className="px-4 py-4">
      <h1 className="text-lg font-bold text-gray-900 mb-4">Mensajes</h1>

      {conversations.length === 0 ? (
        <div className="text-center py-16">
          <MessageCircle size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Aún no tienes conversaciones.</p>
          <p className="text-gray-400 text-xs mt-1">
            Contacta a un proveedor desde el catálogo.
          </p>
          <Link href="/catalog"
            className="inline-block mt-4 px-5 py-2.5 bg-brand text-white text-sm
                       rounded-xl font-medium hover:bg-brand-dark transition-colors">
            Explorar servicios
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv: any) => {
            const isClient = conv.client_id === user?.id
            const other = isClient ? conv.provider : conv.client
            const initials = getInitials(other?.full_name ?? 'U')

            return (
              <Link key={conv.id} href={`/chat/${conv.id}`}
                className="flex items-center gap-3 bg-white rounded-2xl border
                           border-gray-100 p-3.5 hover:shadow-sm transition-shadow
                           active:scale-[0.99]">
                <div className="avatar w-11 h-11 text-sm bg-navy flex-shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {other?.full_name}
                    </p>
                    {conv.last_message_at && (
                      <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                        {formatRelativeTime(conv.last_message_at)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {conv.service?.title ?? 'Servicio'}
                  </p>
                  {conv.last_message && (
                    <p className="text-xs text-gray-500 truncate mt-0.5">{conv.last_message}</p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
