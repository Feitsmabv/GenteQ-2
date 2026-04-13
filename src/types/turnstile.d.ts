interface TurnstileRenderOptions {
  sitekey: string
  callback?: (token: string) => void
  'expired-callback'?: () => void
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'compact' | 'invisible'
}

interface Window {
  turnstile?: {
    render: (container: HTMLElement, options: TurnstileRenderOptions) => string
    reset: (widgetId?: string) => void
    remove: (widgetId?: string) => void
  }
}
