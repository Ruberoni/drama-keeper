import { useEffect, useRef } from 'react'

// Google Identity Services (GIS): https://developers.google.com/identity/gsi/web
const GIS_SRC = 'https://accounts.google.com/gsi/client'

interface CredentialResponse {
  credential: string
}

interface GoogleId {
  initialize: (config: {
    client_id: string
    callback: (response: CredentialResponse) => void
  }) => void
  renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleId } }
  }
}

let gisPromise: Promise<GoogleId> | undefined

function loadGis(): Promise<GoogleId> {
  if (window.google?.accounts?.id) return Promise.resolve(window.google.accounts.id)
  gisPromise ??= new Promise<GoogleId>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = GIS_SRC
    script.async = true
    script.onload = () => {
      if (window.google?.accounts?.id) resolve(window.google.accounts.id)
      else reject(new Error('Google Identity Services failed to initialise'))
    }
    script.onerror = () => {
      gisPromise = undefined
      script.remove()
      reject(new Error('Could not load Google Identity Services'))
    }
    document.head.appendChild(script)
  })
  return gisPromise
}

type Props = {
  /** Called with the Google ID token (the GIS "credential"). */
  onCredential: (credential: string) => void
}

export default function GoogleSignIn({ onCredential }: Props) {
  const container = useRef<HTMLDivElement>(null)
  // Keep the latest callback without re-initialising GIS on every render.
  const callback = useRef(onCredential)
  useEffect(() => {
    callback.current = onCredential
  })

  useEffect(() => {
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      console.warn('VITE_GOOGLE_CLIENT_ID is not set: Google sign-in disabled')
      return
    }
    let cancelled = false
    loadGis()
      .then((id) => {
        if (cancelled || !container.current) return
        id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: (response) => callback.current(response.credential),
        })
        id.renderButton(container.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
        })
      })
      .catch((err) => console.warn(err.message))
    return () => {
      cancelled = true
    }
  }, [])

  return <div ref={container} data-testid="google-signin" />
}
