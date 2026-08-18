import { useEffect, useState } from 'react'
import { Toaster as Sonner } from 'sonner'

/** Track the `.dark` class on <html> so toasts follow the active theme. */
function useHtmlTheme() {
  const [theme, setTheme] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light',
  )

  useEffect(() => {
    const el = document.documentElement
    const observer = new MutationObserver(() => {
      setTheme(el.classList.contains('dark') ? 'dark' : 'light')
    })
    observer.observe(el, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return theme
}

function Toaster(props) {
  const theme = useHtmlTheme()

  return (
    <Sonner
      theme={theme}
      position="bottom-right"
      gap={10}
      toastOptions={{
        classNames: {
          toast:
            'group toast !rounded-lg !border-border !bg-popover !text-popover-foreground !shadow-lg !font-sans',
          title: '!text-sm !font-medium',
          description: '!text-muted-foreground !text-[13px]',
          actionButton: '!bg-primary !text-primary-foreground !rounded-md !text-xs',
          cancelButton: '!bg-muted !text-muted-foreground !rounded-md !text-xs',
        },
      }}
      style={{
        '--normal-bg': 'var(--popover)',
        '--normal-text': 'var(--popover-foreground)',
        '--normal-border': 'var(--border)',
      }}
      {...props}
    />
  )
}

export { Toaster }
