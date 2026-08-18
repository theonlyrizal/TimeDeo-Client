import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { AppShell } from '@/components/layout/AppShell'
import { RequireAuth } from '@/components/auth/RequireAuth'
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import Explore from '@/pages/Explore'
import Bookings from '@/pages/Bookings'
import Profile from '@/pages/Profile'
import Settings from '@/pages/Settings'
import { useAuth } from '@/store/useAuth'

export default function App() {
  const checkSession = useAuth((s) => s.checkSession)

  // Restore the session (httpOnly cookie) once on boot.
  useEffect(() => {
    checkSession()
  }, [checkSession])

  return (
    <TooltipProvider delayDuration={150} skipDelayDuration={300}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<RequireAuth />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </TooltipProvider>
  )
}
