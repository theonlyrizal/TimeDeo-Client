import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { toast } from 'sonner'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { useAppStore } from '@/store/useAppStore'

export function AppShell() {
  const loadAll = useAppStore((s) => s.loadAll)
  const ready = useAppStore((s) => s.ready)
  const error = useAppStore((s) => s.error)

  // Pull live data from the PHP/MySQL API when the app shell mounts.
  useEffect(() => {
    loadAll()
  }, [loadAll])

  useEffect(() => {
    if (ready && error) {
      toast.error('Couldn’t reach the server', { description: error })
    }
  }, [ready, error])

  return (
    <div className="flex min-h-dvh bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
