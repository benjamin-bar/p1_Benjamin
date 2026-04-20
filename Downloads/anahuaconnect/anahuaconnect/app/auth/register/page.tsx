'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/supabase/client'
import { CAREERS } from '@/types'
import { isValidUniversityEmail } from '@/lib/utils'

const SEMESTERS = Array.from({ length: 8 }, (_, i) => i + 1)

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    career: CAREERS[0],
    semester: 1,
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(field: string, value: string | number) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!isValidUniversityEmail(form.email)) {
      setError('Solo se permiten correos @anahuac.mx')
      return
    }
    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          career: form.career,
          semester: form.semester,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Create profile row
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: form.email,
        full_name: form.fullName,
        career: form.career,
        semester: form.semester,
        skills: [],
        rating: 0,
        review_count: 0,
        delivery_count: 0,
        is_available: true,
      })
    }

    router.push('/catalog')
    router.refresh()
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Crear cuenta</h2>
      <p className="text-sm text-gray-500 mb-6">Únete a la comunidad AnáhuaConnect</p>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre completo</label>
          <input className="input" placeholder="Tu nombre" value={form.fullName}
            onChange={e => set('fullName', e.target.value)} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo universitario</label>
          <input type="email" className="input" placeholder="tu@anahuac.mx" value={form.email}
            onChange={e => set('email', e.target.value)} required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Carrera</label>
            <select className="input" value={form.career}
              onChange={e => set('career', e.target.value)}>
              {CAREERS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Semestre</label>
            <select className="input" value={form.semester}
              onChange={e => set('semester', Number(e.target.value))}>
              {SEMESTERS.map(s => (
                <option key={s} value={s}>{s}°</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
          <input type="password" className="input" placeholder="Mínimo 8 caracteres"
            value={form.password} onChange={e => set('password', e.target.value)} required />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button type="submit" className="btn-primary mt-2" disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Registrarme'}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Al registrarte aceptas nuestros Términos de uso
        </p>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        ¿Ya tienes cuenta?{' '}
        <Link href="/auth/login" className="text-brand font-medium">Inicia sesión</Link>
      </p>
    </>
  )
}
