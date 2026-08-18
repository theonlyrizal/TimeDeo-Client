import { useMemo } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
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

export default function Register() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAuth((s) => s.user)
  const registerUser = useAuth((s) => s.register)

  const schema = useMemo(
    () =>
      z.object({
        fullName: z.string().min(2, t('auth.errName')),
        email: z.string().email(t('auth.errEmail')),
        password: z.string().min(6, t('auth.errPasswordLen')),
      }),
    [t],
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { fullName: '', email: '', password: '' },
  })

  if (user) return <Navigate to="/dashboard" replace />

  async function onSubmit(values) {
    try {
      const u = await registerUser({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      })
      toast.success(t('auth.welcomeNewToast', { name: u.name.split(' ')[0] }))
      navigate('/dashboard', { replace: true })
    } catch (e) {
      toast.error(e.message || t('auth.registerFailed'))
    }
  }

  return (
    <AuthLayout
      title={t('auth.createTitle')}
      subtitle={t('auth.createSub')}
      footer={
        <>
          {t('auth.haveAccount')}{' '}
          <Link className="font-medium text-primary hover:underline" to="/login">
            {t('auth.signInLink')}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="reg-name">{t('auth.fullName')}</Label>
          <Input
            id="reg-name"
            autoComplete="name"
            placeholder={t('auth.fullNamePlaceholder')}
            aria-invalid={!!errors.fullName}
            {...register('fullName')}
          />
          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reg-email">{t('auth.email')}</Label>
          <Input
            id="reg-email"
            type="email"
            autoComplete="email"
            placeholder={t('auth.emailPlaceholder')}
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reg-password">{t('auth.password')}</Label>
          <Input
            id="reg-password"
            type="password"
            autoComplete="new-password"
            placeholder={t('auth.passwordPlaceholder')}
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t('auth.signingUp') : t('auth.signUpCta')}
        </Button>
      </form>
    </AuthLayout>
  )
}
