'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/supabase/client'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  const router = useRouter()

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={logout}
      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                 border border-red-200 text-red-500 text-sm font-medium
                 hover:bg-red-50 active:scale-[0.98] transition-all">
      <LogOut size={16} />
      Cerrar sesión
    </button>
  )
}
