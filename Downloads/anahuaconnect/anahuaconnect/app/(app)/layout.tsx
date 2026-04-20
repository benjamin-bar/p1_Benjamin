import BottomNav from '@/components/layout/BottomNav'
import TopBar from '@/components/layout/TopBar'
import Sidebar from '@/components/layout/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 min-h-screen md:ml-60">
        <TopBar />
        <main className="flex-1 pb-nav md:pb-0 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
