import { useEffect, useState } from 'react'
import { RotateCcw, Save, Server } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  API_BASE,
  clearApiOverride,
  getApiOverride,
  getCategories,
  setApiOverride,
} from '@/lib/api'

/**
 * Hidden "Data source" dialog. Lets the DEPLOYED app be repointed at a new
 * backend/tunnel URL at runtime — stored in this browser, applied on reload,
 * so no rebuild/redeploy is needed when a tunnel rotates. The status line is a
 * live probe of the active endpoint, not a static label.
 */
export function ApiConfigDialog({ open, onOpenChange }) {
  const override = getApiOverride()
  const [input, setInput] = useState(override)
  const [status, setStatus] = useState('checking') // 'checking' | 'ok' | 'error'
  const [detail, setDetail] = useState('')

  useEffect(() => {
    if (open) setInput(getApiOverride())
  }, [open])

  // Probe the *active* endpoint whenever the dialog opens.
  useEffect(() => {
    if (!open) return
    let cancelled = false
    setStatus('checking')
    setDetail('')
    getCategories()
      .then(() => {
        if (!cancelled) setStatus('ok')
      })
      .catch((e) => {
        if (!cancelled) {
          setStatus('error')
          setDetail(e.message || 'Unreachable')
        }
      })
    return () => {
      cancelled = true
    }
  }, [open])

  function recheck() {
    setStatus('checking')
    setDetail('')
    getCategories()
      .then(() => setStatus('ok'))
      .catch((e) => {
        setStatus('error')
        setDetail(e.message || 'Unreachable')
      })
  }

  const trimmed = input.trim().replace(/\/+$/, '')
  const unchanged = trimmed === override

  function save() {
    if (!trimmed) return
    setApiOverride(trimmed)
    window.location.reload()
  }

  function useDefault() {
    clearApiOverride()
    window.location.reload()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Server className="size-4 text-muted-foreground" />
            Data source
          </DialogTitle>
          <DialogDescription>
            Point the deployed app at a backend API — no rebuild required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Live connection status */}
          <div className="flex flex-wrap items-center gap-2.5">
            {status === 'checking' && (
              <>
                <Badge variant="muted">
                  <span className="size-1.5 animate-pulse rounded-full bg-current" />
                  Checking…
                </Badge>
                <span className="text-sm text-muted-foreground">Contacting the API…</span>
              </>
            )}
            {status === 'ok' && (
              <>
                <Badge variant="success">
                  <span className="size-1.5 rounded-full bg-current" />
                  Live backend
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Connected to the PHP/MySQL REST API.
                </span>
              </>
            )}
            {status === 'error' && (
              <>
                <Badge variant="destructive">
                  <span className="size-1.5 rounded-full bg-current" />
                  Not connected
                </Badge>
                <span className="text-sm text-muted-foreground">Couldn’t reach the API.</span>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={recheck}
              disabled={status === 'checking'}
              className="ml-auto h-7 px-2 text-xs text-muted-foreground"
            >
              Recheck
            </Button>
          </div>
          {status === 'error' && detail && (
            <p className="-mt-2 break-words text-xs text-destructive/80">{detail}</p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="api-base">API endpoint</Label>
            <Input
              id="api-base"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="https://your-tunnel.trycloudflare.com/timedeo"
              className="font-mono text-xs"
              spellCheck={false}
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              Stored in this browser and applied on reload — use it to repoint the deployed app at a
              new tunnel URL without redeploying. A direct URL is cross-origin, so the backend must
              send credentialed CORS + a SameSite=None cookie. Local dev always uses the /api proxy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={save} disabled={!trimmed || unchanged} className="gap-1.5">
              <Save className="size-3.5" />
              Save &amp; reload
            </Button>
            {override && (
              <Button size="sm" variant="secondary" onClick={useDefault} className="gap-1.5">
                <RotateCcw className="size-3.5" />
                Use default
              </Button>
            )}
            <span className="ml-auto text-[11px] text-muted-foreground">
              Active: <span className="font-mono text-foreground/80">{API_BASE || '/api'}</span>
              {override ? ' · override' : ''}
            </span>
          </div>

          <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm">
            <div className="flex justify-between gap-4 py-1">
              <span className="text-muted-foreground">Database</span>
              <span className="font-mono text-xs text-foreground">MySQL · timedeo</span>
            </div>
            <div className="flex justify-between gap-4 py-1">
              <span className="text-muted-foreground">First-time setup</span>
              <span className="text-right text-xs text-muted-foreground">
                Start Apache &amp; MySQL in XAMPP, then import{' '}
                <code className="font-mono text-primary">server/init.sql</code> once to create &amp;
                seed the tables.
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
