'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bell, MessageCircle, ArrowLeft, Search } from 'lucide-react'

const TITLES: Record<string, string> = {
  '/catalog':      'Explorar',
  '/dashboard':    'Mis ventas',
  '/profile':      'Mi perfil',
  '/services/new': 'Publicar servicio',
  '/chat':         'Mensajes',
}

export default function TopBar() {
  const pathname = usePathname()
  const router = useRouter()

  const isHome = pathname === '/catalog'
  const title = TITLES[pathname] ?? ''
  const isDetail = pathname.startsWith('/services/') && pathname !== '/services/new'
  const isChat = pathname.startsWith('/chat')
  const showBack = isDetail || isChat || pathname !== '/catalog'

  if (isHome) {
    return (
      <>
        {/* Mobile: navy greeting header */}
        <header className="md:hidden bg-navy px-4 pt-4 pb-5 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-400 text-xs">Buenos días 👋</p>
              <p className="text-white font-semibold text-lg leading-tight">Explora servicios</p>
            </div>
            <div className="flex gap-2">
              <Link href="/chat"
                className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center relative">
                <MessageCircle size={18} className="text-white" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full" />
              </Link>
              <button className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <Bell size={18} className="text-white" />
              </button>
            </div>
          </div>
          <Link href="/catalog?search=true"
            className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,0.5)" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="text-white/40 text-sm">Buscar servicio o habilidad...</span>
          </Link>
        </header>

        {/* Desktop: clean white search bar */}
        <header className="hidden md:flex bg-white border-b border-gray-100 px-6 py-3.5
                           items-center gap-4 flex-shrink-0 sticky top-0 z-10">
          <Link href="/catalog?search=true"
            className="flex-1 flex items-center gap-2.5 bg-gray-100 rounded-xl px-4 py-2.5 max-w-md hover:bg-gray-200 transition-colors">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <span className="text-gray-400 text-sm">Buscar servicio o habilidad...</span>
          </Link>
          <div className="flex gap-2">
            <Link href="/chat"
              className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center relative hover:bg-gray-200 transition-colors">
              <MessageCircle size={17} className="text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full" />
            </Link>
            <button className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
              <Bell size={17} className="text-gray-600" />
            </button>
          </div>
        </header>
      </>
    )
  }

  return (
    <header className="bg-white border-b border-gray-100 px-4 py-3.5
                       flex items-center gap-3 flex-shrink-0 sticky top-0 z-10">
      {showBack && (
        <button onClick={() => router.back()}
          className="w-8 h-8 rounded-lg flex items-center justify-center
                     hover:bg-gray-100 transition-colors text-brand md:hidden">
          <ArrowLeft size={18} />
        </button>
      )}
      <h1 className="font-semibold text-gray-900 flex-1">{title}</h1>
    </header>
  )
}
