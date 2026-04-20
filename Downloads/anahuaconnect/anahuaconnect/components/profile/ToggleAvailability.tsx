'use client'

import { useState } from 'react'
import { createClient } from '@/supabase/client'

export default function ToggleAvailability({
  initialValue,
  userId,
}: {
  initialValue: boolean
  userId: string
}) {
  const [available, setAvailable] = useState(initialValue)

  async function toggle() {
    const next = !available
    setAvailable(next)
    const supabase = createClient()
    await supabase.from('profiles').update({ is_available: next }).eq('id', userId)
  }

  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm text-gray-700">Disponible para nuevos pedidos</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {available ? 'Visible en el catálogo' : 'Oculto del catálogo'}
        </p>
      </div>
      <button
        onClick={toggle}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          available ? 'bg-green-500' : 'bg-gray-300'
        }`}>
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow
                          transition-transform ${available ? 'translate-x-6' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}
