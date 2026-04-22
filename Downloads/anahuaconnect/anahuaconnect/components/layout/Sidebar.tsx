'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Home, Search, PlusCircle, LayoutDashboard, User, MessageCircle, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/catalog',      label: 'Inicio',     Icon: Home            },
  { href: '/catalog?cat',  label: 'Explorar',   Icon: Search          },
  { href: '/services/new', label: 'Publicar',   Icon: PlusCircle      },
  { href: '/dashboard',    label: 'Mis ventas', Icon: LayoutDashboard },
  { href: '/profile',      label: 'Perfil',     Icon: User            },
]

export default function Sidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const hasCategory = searchParams.has('category') || searchParams.has('cat')

  function isActive(href: string) {
    if (href === '/catalog') return pathname === '/catalog' && !hasCategory
    if (href === '/catalog?cat') return pathname === '/catalog' && hasCategory
    return pathname === href
  }

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-60 bg-white border-r border-gray-100 z-20">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">AC</span>
          </div>
          <span className="font-semibold text-gray-900 text-sm">AnáhuaConnect</span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {TABS.map(({ href, label, Icon }) => {
          const active = isActive(href)
          return (
            <Link key={href} href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                active
                  ? 'bg-brand/10 text-brand'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}>
              <Icon size={19} strokeWidth={active ? 2.5 : 1.8} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-gray-100 flex gap-2">
        <Link href="/chat"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl
                     text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors
                     text-xs font-medium">
          <MessageCircle size={16} />
          Mensajes
        </Link>
        <button
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl
                     text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors
                     text-xs font-medium">
          <Bell size={16} />
          Alertas
        </button>
      </div>
    </aside>
  )
}
