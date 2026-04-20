'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/supabase/client'
import { CATEGORIES, type ServiceCategory } from '@/types'

const DELIVERY_OPTIONS = [1, 2, 3, 5, 7, 14]

export default function NewServicePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'code' as ServiceCategory,
    price: '',
    delivery_days: 3,
    tags: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(field: string, value: string | number) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (Number(form.price) < 1) { setError('El precio debe ser mayor a $0'); return }
    if (form.title.length < 10) { setError('El título debe tener al menos 10 caracteres'); return }

    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const tags = form.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    const { error: insertError } = await supabase.from('services').insert({
      provider_id: user.id,
      title: form.title,
      description: form.description,
      category: form.category,
      price: Number(form.price),
      delivery_days: form.delivery_days,
      tags,
      is_active: true,
    })

    if (insertError) {
      setError('Error al publicar. Intenta de nuevo.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4 max-w-2xl">
      {/* Category selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
        <div className="grid grid-cols-4 gap-2">
          {(Object.entries(CATEGORIES) as [ServiceCategory, typeof CATEGORIES[ServiceCategory]][]).map(
            ([key, cat]) => (
              <button
                key={key}
                type="button"
                onClick={() => set('category', key)}
                className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border text-xs
                           font-medium transition-all ${
                  form.category === key
                    ? 'border-brand bg-brand/5 text-brand'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }`}>
                <span className="text-lg">{cat.emoji}</span>
                <span className="text-[10px] leading-tight text-center">{cat.label}</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Título del servicio
        </label>
        <input
          className="input"
          placeholder="Ej: Diseño de logo profesional en Illustrator"
          value={form.title}
          onChange={e => set('title', e.target.value)}
          required
        />
        <p className="text-xs text-gray-400 mt-1">{form.title.length}/80 caracteres</p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
        <textarea
          className="input min-h-[90px] resize-none"
          placeholder="Describe qué ofreces, qué incluye, cómo trabajas y qué necesitas del cliente..."
          value={form.description}
          onChange={e => set('description', e.target.value)}
          required
        />
      </div>

      {/* Price + Delivery */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Precio (MXN)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              type="number"
              className="input pl-7"
              placeholder="200"
              value={form.price}
              onChange={e => set('price', e.target.value)}
              min={1}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Entrega en
          </label>
          <select
            className="input"
            value={form.delivery_days}
            onChange={e => set('delivery_days', Number(e.target.value))}>
            {DELIVERY_OPTIONS.map(d => (
              <option key={d} value={d}>
                {d} {d === 1 ? 'día' : 'días'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Habilidades / etiquetas
        </label>
        <input
          className="input"
          placeholder="Figma, Illustrator, branding (separadas por coma)"
          value={form.tags}
          onChange={e => set('tags', e.target.value)}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Publicando...' : '🚀 Publicar servicio'}
      </button>
    </form>
  )
}
