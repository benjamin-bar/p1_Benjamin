# AnáhuaConnect 🎓

Marketplace estudiantil de habilidades y servicios universitarios.
Construido con **Next.js 14 · Supabase · Tailwind CSS · TypeScript**.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14 (App Router) |
| Estilos | Tailwind CSS |
| Backend / DB | Supabase (PostgreSQL + Auth + Realtime) |
| Lenguaje | TypeScript |
| Deploy | Vercel |

---

## Estructura del proyecto

```
anahuaconnect/
├── app/
│   ├── page.tsx                  # Landing / onboarding
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Tailwind + estilos globales
│   ├── auth/
│   │   ├── layout.tsx            # Auth layout compartido
│   │   ├── login/page.tsx        # Inicio de sesión
│   │   └── register/page.tsx     # Registro
│   └── (app)/                    # Rutas protegidas (con BottomNav)
│       ├── layout.tsx
│       ├── catalog/page.tsx      # Home + catálogo de servicios
│       ├── services/
│       │   ├── new/page.tsx      # Publicar servicio
│       │   └── [id]/page.tsx     # Detalle del servicio
│       ├── chat/
│       │   ├── page.tsx          # Lista de conversaciones
│       │   └── [id]/page.tsx     # Chat en tiempo real
│       ├── dashboard/page.tsx    # Panel del proveedor
│       └── profile/page.tsx      # Mi perfil
├── components/
│   ├── layout/
│   │   ├── TopBar.tsx            # Barra superior dinámica
│   │   └── BottomNav.tsx         # Navegación inferior
│   ├── services/
│   │   ├── ServiceCard.tsx       # Tarjeta reutilizable
│   │   └── ContactButton.tsx     # Botón iniciar conversación
│   └── profile/
│       ├── LogoutButton.tsx
│       └── ToggleAvailability.tsx
├── supabase/
│   ├── client.ts                 # Cliente browser
│   ├── server.ts                 # Cliente server (SSR)
│   ├── middleware.ts             # Refresco de sesión
│   └── schema.sql                # ← Ejecutar en Supabase primero
├── lib/utils.ts                  # Helpers (formatMXN, getInitials…)
├── types/index.ts                # Tipos TypeScript completos
├── middleware.ts                 # Protección de rutas
└── .env.local.example            # Variables de entorno requeridas
```

---

## Setup en 5 pasos

### 1. Clonar e instalar

```bash
git clone <tu-repo>
cd anahuaconnect
npm install
```

### 2. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) → **New project**
2. Ponle nombre: `anahuaconnect`
3. Guarda la contraseña de la DB

### 3. Ejecutar el schema

1. En tu proyecto Supabase → **SQL Editor** → **New query**
2. Copia y pega el contenido de `supabase/schema.sql`
3. Click en **Run**

### 4. Configurar variables de entorno

```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN=anahuac.mx
```

Encuéntralas en: **Supabase Dashboard → Project Settings → API**

### 5. Correr localmente

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## Deploy en Vercel

```bash
npm i -g vercel
vercel
```

Agrega las mismas variables de entorno en:
**Vercel Dashboard → Project → Settings → Environment Variables**

Cambia `NEXT_PUBLIC_APP_URL` a tu dominio de Vercel.

---

## Funcionalidades del MVP

| Feature | Estado |
|---------|--------|
| Registro con correo @anahuac.mx | ✅ |
| Login / logout | ✅ |
| Protección de rutas | ✅ |
| Catálogo de servicios por categoría | ✅ |
| Detalle del servicio + reseñas | ✅ |
| Publicar servicio (form completo) | ✅ |
| Chat en tiempo real (Supabase Realtime) | ✅ |
| Dashboard del proveedor | ✅ |
| Perfil con calificación y disponibilidad | ✅ |
| Row Level Security en toda la DB | ✅ |
| Rating automático al recibir reseña | ✅ |
| Phone-friendly (mobile-first) | ✅ |

---

## Roadmap post-MVP

- [ ] Pagos con Conekta / Stripe (MXN)
- [ ] Subida de foto de perfil a Supabase Storage
- [ ] Notificaciones push (web push API)
- [ ] Sistema de pedidos con flujo completo
- [ ] Búsqueda con filtros avanzados
- [ ] Panel de admin para moderar servicios
- [ ] PWA instalable en teléfono

---

## Comandos útiles

```bash
npm run dev      # Desarrollo local
npm run build    # Build de producción
npm run lint     # Lint TypeScript
```
