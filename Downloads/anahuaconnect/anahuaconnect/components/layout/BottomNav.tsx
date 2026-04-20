'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, PlusCircle, LayoutDashboard, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/catalog',      label: 'Inicio',    Icon: Home           },
  { href: '/catalog?cat',  label: 'Explorar',  Icon: Search         },
  { href: '/services/new', label: 'Publicar',  Icon: PlusCircle     },
  { href: '/dashboard',    label: 'Mis ventas',Icon: LayoutDashboard},
  { href: '/profile',      label: 'Perfil',    Icon: User           },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full
                    bg-white border-t border-gray-100 flex z-20
                    pb-[env(safe-area-inset-bottom)]">
      {TABS.map(({ href, label, Icon }) => {
        const base = href.split('?')[0]
        const active = pathname === base ||
          (base === '/catalog' && pathname === '/catalog')
        return (
          <Link key={href} href={href}
            className={cn(
              'flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors',
              active ? 'text-brand' : 'text-gray-400 hover:text-gray-600'
            )}>
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
