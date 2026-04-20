import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-navy flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-5xl flex flex-col md:flex-row md:items-center md:gap-16">

        {/* Left: branding */}
        <div className="flex flex-col items-center md:items-start mb-10 md:mb-0 md:flex-1">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-brand flex items-center justify-center mb-6 shadow-lg">
            <svg width="52" height="52" viewBox="0 0 56 56" fill="none">
              <circle cx="20" cy="20" r="10" fill="white" opacity="0.9" />
              <circle cx="36" cy="20" r="10" fill="white" opacity="0.55" />
              <path d="M10 42 Q20 30 28 36 Q36 42 46 30"
                stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight text-center md:text-left">
            AnáhuaConnect
          </h1>
          <p className="text-gray-400 mt-3 text-center md:text-left text-base md:text-lg leading-relaxed max-w-sm">
            El marketplace de habilidades de tu comunidad universitaria
          </p>

          {/* Features — visible on desktop beside the form */}
          <div className="hidden md:flex flex-col gap-3 mt-10">
            {[
              { icon: '🎓', text: 'Solo estudiantes Anáhuac verificados' },
              { icon: '💸', text: 'Gana dinero con lo que ya sabes' },
              { icon: '⭐', text: 'Sistema de calificaciones y reputación' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3">
                <span className="text-xl">{f.icon}</span>
                <p className="text-white text-sm">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: features (mobile) + CTAs */}
        <div className="w-full md:w-80 md:flex-shrink-0">
          {/* Features — mobile only */}
          <div className="flex flex-col gap-3 mb-8 md:hidden">
            {[
              { icon: '🎓', text: 'Solo estudiantes Anáhuac verificados' },
              { icon: '💸', text: 'Gana dinero con lo que ya sabes' },
              { icon: '⭐', text: 'Sistema de calificaciones y reputación' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3">
                <span className="text-xl">{f.icon}</span>
                <p className="text-white text-sm">{f.text}</p>
              </div>
            ))}
          </div>

          {/* CTA card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-3">
            <Link href="/auth/register" className="btn-primary block text-center">
              Crear cuenta gratis
            </Link>
            <Link href="/auth/login" className="btn-secondary block text-center">
              Ya tengo cuenta
            </Link>
            <p className="text-xs text-gray-500 text-center pt-1">
              Exclusivo para correos @anahuac.mx
            </p>
          </div>
        </div>

      </div>
    </main>
  )
}
