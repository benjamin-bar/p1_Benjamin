import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">

      {/* Desktop left panel */}
      <div className="hidden md:flex flex-col justify-center items-start bg-navy px-16 w-[420px] flex-shrink-0">
        <Link href="/" className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center">
            <span className="text-white text-sm font-bold">AC</span>
          </div>
          <span className="text-white font-semibold text-lg">AnáhuaConnect</span>
        </Link>
        <h2 className="text-3xl font-bold text-white leading-tight mb-4">
          El marketplace<br />universitario
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          Conecta con estudiantes Anáhuac, ofrece tus habilidades y haz crecer tu reputación.
        </p>
      </div>

      {/* Mobile header */}
      <header className="md:hidden bg-navy px-4 py-4 flex items-center gap-3">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
            <span className="text-white text-xs font-bold">AC</span>
          </div>
          <span className="text-white font-medium text-sm">AnáhuaConnect</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col justify-center px-5 py-8 md:py-12 max-w-md mx-auto w-full md:mx-auto">
        {children}
      </main>
    </div>
  )
}
