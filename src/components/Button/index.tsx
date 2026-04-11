import Link from 'next/link'

interface ButtonProps {
  href?: string
  variant?: 'primary' | 'outline' | 'outline-light'
  children: React.ReactNode
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
  onClick?: () => void
}

const baseClasses = 'inline-flex items-center justify-center rounded-full px-7 py-3.5 text-[15px] font-normal'

const variantClasses = {
  primary: 'btn-primary bg-brand-gold text-white',
  outline: 'btn-outline border-[1.5px] border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white',
  'outline-light': 'btn-outline border-[1.5px] border-white/40 text-white hover:border-white/70',
}

export function Button({ href, variant = 'primary', children, type, disabled, className = '', onClick }: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-60 pointer-events-none' : ''} ${className}`

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type || 'button'} disabled={disabled} onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
