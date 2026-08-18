import { useMemo } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/store/useAuth'

export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuth((s) => s.user)
  const login = useAuth((s) => s.login)
  const from = location.state?.from || '/dashboard'

  const schema = useMemo(
    () =>
      z.object({
        email: z.string().email(t('auth.errEmail')),
        password: z.string().min(1, t('auth.errPasswordRequired')),
      }),
    [t],
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } })

  if (user) return <Navigate to={from} replace />

  async function onSubmit(values) {
    try {
      const u = await login(values.email, values.password)
      toast.success(t('auth.welcomeToast', { name: u.name.split(' ')[0] }))
      navigate(from, { replace: true })
    } catch (e) {
      toast.error(e.message || t('auth.loginFailed'))
    }
  }

  return (
    <AuthLayout
      title={t('auth.welcomeBackTitle')}
      subtitle={t('auth.welcomeBackSub')}
      footer={
        <>
          {t('auth.noAccount')}{' '}
          <Link className="font-medium text-primary hover:underline" to="/register">
            {t('auth.createOne')}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="login-email">{t('auth.email')}</Label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder={t('auth.emailPlaceholder')}
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="login-password">{t('auth.password')}</Label>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder={t('auth.passwordPlaceholder')}
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t('auth.signingIn') : t('auth.signInCta')}
        </Button>
      </form>

      <p className="mt-4 rounded-lg border border-border bg-muted/40 px-3 py-2 text-center text-xs text-muted-foreground">
        {t('auth.demoHint')}
      </p>
    </AuthLayout>
  )
}
