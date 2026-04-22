'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, PlusCircle, LayoutDashboard, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/catalog',      label: 'Inicio',    Icon: Home           },
  { href: '/catalog?cat',  label: 'Explorar',  Icon: Search         },
  { href: '/services/new', label: 'Publicar',  Icon: PlusCircle     },
  { href: '/dashboard',    label: 'Ventas',    Icon: LayoutDashboard},
  { href: '/profile',      label: 'Perfil',    Icon: User           },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full
                    bg-white/95 backdrop-blur border-t border-gray-100 flex z-20
                    pb-[env(safe-area-inset-bottom)]">
      {TABS.map(({ href, label, Icon }) => {
        const base = href.split('?')[0]
        const active = pathname === base ||
          (base === '/catalog' && pathname === '/catalog')
        return (
          <Link key={href} href={href}
            className={cn(
              'flex-1 flex flex-col items-center gap-0.5 pt-2 pb-1.5 transition-colors relative',
              active ? 'text-brand' : 'text-gray-400 active:text-gray-600'
            )}>
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-brand rounded-full" />
            )}
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
