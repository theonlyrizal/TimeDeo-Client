import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/store/useAuth'
import { Logo } from '@/components/common/Logo'

function Splash() {
  return (
    <div className="grid min-h-dvh place-items-center bg-background">
      <div className="animate-pulse">
        <Logo />
      </div>
    </div>
  )
}

/** Gate app routes: wait for the session check, then allow or redirect to /login. */
export function RequireAuth() {
  const status = useAuth((s) => s.status)
  const location = useLocation()

  if (status === 'checking') return <Splash />
  if (status !== 'authed') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}
