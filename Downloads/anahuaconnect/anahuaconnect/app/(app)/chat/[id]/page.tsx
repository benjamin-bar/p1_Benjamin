'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/supabase/client'
import { getInitials, formatRelativeTime } from '@/lib/utils'
import { Send } from 'lucide-react'
import { type Message } from '@/types'

export default function ChatPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [conv, setConv] = useState<any>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id ?? null)

      // Load conversation info
      const { data: convData } = await supabase
        .from('conversations')
        .select(`
          *,
          service:services(title),
          client:profiles!conversations_client_id_fkey(id, full_name),
          provider:profiles!conversations_provider_id_fkey(id, full_name)
        `)
        .eq('id', params.id)
        .single()
      setConv(convData)

      // Load messages
      const { data: msgs } = await supabase
        .from('messages')
        .select(`*, sender:profiles(full_name)`)
        .eq('conversation_id', params.id)
        .order('created_at', { ascending: true })
      setMessages((msgs as Message[]) ?? [])
    }
    load()

    // Real-time subscription
    const channel = supabase
      .channel(`chat-${params.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${params.id}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [params.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    const trimmed = text.trim()
    if (!trimmed || !userId) return
    setText('')

    await supabase.from('messages').insert({
      conversation_id: params.id,
      sender_id: userId,
      content: trimmed,
    })

    // Update last message in conversation
    await supabase
      .from('conversations')
      .update({ last_message: trimmed, last_message_at: new Date().toISOString() })
      .eq('id', params.id)
  }

  const other = conv
    ? conv.client_id === userId ? conv.provider : conv.client
    : null

  return (
    <div className="flex flex-col h-[calc(100dvh-8rem)] md:h-[calc(100dvh-4rem)]">
      {/* Other user info */}
      {other && (
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <div className="avatar w-9 h-9 text-sm bg-navy">
            {getInitials(other.full_name)}
          </div>
          <div>
            <p className="font-medium text-sm text-gray-900">{other.full_name}</p>
            {conv?.service && (
              <p className="text-xs text-gray-400 truncate max-w-[220px]">
                {conv.service.title}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-xs text-gray-400 mt-8">
            Inicia la conversación 👋
          </p>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender_id === userId
          return (
            <div key={msg.id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
              {!isMe && (
                <div className="avatar w-6 h-6 text-[10px] bg-navy flex-shrink-0 mb-0.5">
                  {getInitials((msg as any).sender?.full_name ?? 'U')}
                </div>
              )}
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                isMe
                  ? 'bg-brand text-white rounded-br-sm'
                  : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'
              }`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p className={`text-[10px] mt-0.5 ${isMe ? 'text-orange-200' : 'text-gray-400'}`}>
                  {formatRelativeTime(msg.created_at)}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-3 py-2.5 flex gap-2 items-end">
        <input
          className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 text-sm
                     focus:outline-none focus:border-brand transition-colors"
          placeholder="Escribe un mensaje..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
        />
        <button
          onClick={sendMessage}
          disabled={!text.trim()}
          className="w-10 h-10 rounded-full bg-brand flex items-center justify-center
                     hover:bg-brand-dark transition-colors disabled:opacity-40 flex-shrink-0">
          <Send size={16} className="text-white" />
        </button>
      </div>
    </div>
  )
}
