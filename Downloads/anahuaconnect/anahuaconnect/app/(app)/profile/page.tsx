import { createClient } from '@/supabase/server'
import { redirect } from 'next/navigation'
import { getInitials, renderStars } from '@/lib/utils'
import LogoutButton from '@/components/profile/LogoutButton'
import ToggleAvailability from '@/components/profile/ToggleAvailability'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const p = profile as any

  return (
    <div className="px-4 py-5">
      <div className="flex flex-col md:flex-row md:gap-8 md:items-start">

        {/* Left column: avatar, stats */}
        <div className="flex flex-col items-center md:items-start md:w-64 md:flex-shrink-0 mb-4 md:mb-0">
          <div className="flex flex-col items-center text-center md:text-left md:items-start pt-2 pb-4">
            <div className="avatar w-20 h-20 text-2xl bg-brand mb-3">
              {getInitials(p?.full_name ?? 'U')}
            </div>
            <h1 className="text-xl font-bold text-gray-900">{p?.full_name}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{p?.career} · {p?.semester}° semestre</p>
            {p?.rating > 0 && (
              <p className="text-brand mt-1 text-sm">
                {renderStars(p.rating)} <span className="text-gray-400 text-xs">{p.rating.toFixed(1)} ({p.review_count} reseñas)</span>
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 md:grid-cols-1 gap-3 w-full">
            {[
              { label: 'Calificación', value: p?.rating?.toFixed(1) ?? '—' },
              { label: 'Reseñas',      value: String(p?.review_count ?? 0) },
              { label: 'Entregas',     value: String(p?.delivery_count ?? 0) },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-3 text-center md:flex md:items-center md:justify-between md:text-left md:px-4">
                <p className="text-[11px] text-gray-400 mt-0.5 md:mt-0">{s.label}</p>
                <p className="text-xl font-bold text-brand">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: details */}
        <div className="flex-1 space-y-4">
          {/* Skills */}
          {p?.skills?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Habilidades</p>
              <div className="flex flex-wrap gap-2">
                {p.skills.map((skill: string) => (
                  <span key={skill} className="tag bg-orange-50 text-orange-700">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Bio */}
          {p?.bio && (
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Sobre mí</p>
              <p className="text-sm text-gray-500 leading-relaxed">{p.bio}</p>
            </div>
          )}

          {/* Settings */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-1">
            <p className="text-sm font-semibold text-gray-700 mb-3">Preferencias</p>
            <ToggleAvailability initialValue={p?.is_available ?? true} userId={user.id} />
          </div>

          {/* Account */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-xs text-gray-400 mb-1">Correo universitario</p>
            <p className="text-sm text-gray-700">{p?.email}</p>
          </div>

          <LogoutButton />
        </div>

      </div>
    </div>
  )
}
