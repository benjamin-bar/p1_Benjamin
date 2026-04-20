// ─── Database types (mirror your Supabase schema) ────────────

export type UserRole = 'provider' | 'client' | 'both'
export type ServiceCategory =
  | 'code'
  | 'design'
  | 'tutoring'
  | 'languages'
  | 'excel'
  | 'video'
  | 'writing'
  | 'other'
export type OrderStatus = 'pending' | 'in_progress' | 'delivered' | 'completed' | 'cancelled'

export interface Profile {
  id: string
  email: string
  full_name: string
  career: string
  semester: number
  avatar_url: string | null
  bio: string | null
  skills: string[]
  rating: number
  review_count: number
  delivery_count: number
  is_available: boolean
  created_at: string
}

export interface Service {
  id: string
  provider_id: string
  title: string
  description: string
  category: ServiceCategory
  price: number
  delivery_days: number
  tags: string[]
  is_active: boolean
  created_at: string
  // joined
  provider?: Profile
  review_count?: number
  avg_rating?: number
}

export interface Order {
  id: string
  service_id: string
  client_id: string
  provider_id: string
  status: OrderStatus
  price: number
  note: string | null
  progress: number
  created_at: string
  updated_at: string
  // joined
  service?: Service
  client?: Profile
  provider?: Profile
}

export interface Review {
  id: string
  order_id: string
  service_id: string
  reviewer_id: string
  provider_id: string
  rating: number
  comment: string
  created_at: string
  reviewer?: Profile
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
  sender?: Profile
}

export interface Conversation {
  id: string
  service_id: string
  client_id: string
  provider_id: string
  last_message: string | null
  last_message_at: string | null
  created_at: string
  // joined
  service?: Service
  client?: Profile
  provider?: Profile
}

// ─── Category metadata ────────────────────────────────────────
export const CATEGORIES: Record<ServiceCategory, { label: string; emoji: string; color: string }> = {
  code:      { label: 'Código',    emoji: '💻', color: 'bg-orange-50 text-orange-700' },
  design:    { label: 'Diseño',    emoji: '🎨', color: 'bg-purple-50 text-purple-700' },
  tutoring:  { label: 'Tutorías', emoji: '📚', color: 'bg-teal-50 text-teal-700'    },
  languages: { label: 'Idiomas',  emoji: '🌐', color: 'bg-green-50 text-green-700'  },
  excel:     { label: 'Excel',     emoji: '📊', color: 'bg-pink-50 text-pink-700'    },
  video:     { label: 'Video',     emoji: '📹', color: 'bg-indigo-50 text-indigo-700'},
  writing:   { label: 'Redacción',emoji: '✍️', color: 'bg-amber-50 text-amber-700'  },
  other:     { label: 'Otro',      emoji: '⚡', color: 'bg-gray-50 text-gray-600'    },
}

export const CAREERS = [
  'Ingeniería en TIND',
  'Administración de Empresas',
  'Diseño Gráfico',
  'Derecho',
  'Psicología',
  'Arquitectura',
  'Ingeniería Civil',
  'Medicina',
  'Comunicación',
  'Contaduría',
]
