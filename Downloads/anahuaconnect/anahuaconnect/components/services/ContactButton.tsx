'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/supabase/client'
import { MessageCircle } from 'lucide-react'

export default function ContactButton({
  providerId,
  serviceId,
}: {
  providerId: string
  serviceId: string
}) {
  const router = useRouter()

  async function startConversation() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    // Check if conversation already exists
    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .eq('client_id', user.id)
      .eq('provider_id', providerId)
      .eq('service_id', serviceId)
      .single()

    if (existing) {
      router.push(`/chat/${existing.id}`)
      return
    }

    // Create new conversation
    const { data: conv } = await supabase
      .from('conversations')
      .insert({
        client_id: user.id,
        provider_id: providerId,
        service_id: serviceId,
      })
      .select('id')
      .single()

    if (conv) router.push(`/chat/${conv.id}`)
  }

  return (
    <button
      onClick={startConversation}
      className="btn-primary flex items-center justify-center gap-2">
      <MessageCircle size={18} />
      Contactar al proveedor
    </button>
  )
}
