import type { ComponentProps, ReactNode } from 'react'

/**
 * Form field.
 *
 * Labels are always visible and sit above the control, never inside it as a
 * placeholder. Helper text is present in the markup rather than added later.
 * Errors render below the field and are announced.
 *
 * Contrast: label ink 15:1, helper steel 4.6:1, placeholder steel 4.6:1,
 * all against the white control on the paper canvas.
 */
const control =
  'w-full rounded-[var(--radius-base)] border border-hairline-strong bg-card px-3.5 ' +
  'text-[1rem] text-ink placeholder:text-steel transition-colors duration-150 ' +
  'hover:border-ink-soft focus:border-ink-soft aria-[invalid=true]:border-[oklch(0.52_0.17_27)]'

export function Field({
  label,
  htmlFor,
  helper,
  error,
  required,
  className = '',
  children,
}: {
  label: string
  htmlFor: string
  helper?: string
  error?: string
  required?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={htmlFor} className="text-[0.82rem] font-semibold text-ink">
        {label}
        {required ? (
          <span className="ml-1 text-signal-deep" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-1.5 font-normal text-steel">optional</span>
        )}
      </label>
      {children}
      {helper && !error ? (
        <p id={`${htmlFor}-help`} className="text-[0.78rem] leading-snug text-steel">
          {helper}
        </p>
      ) : null}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="text-[0.78rem] font-medium leading-snug text-[oklch(0.48_0.17_27)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function Input({ className = '', ...rest }: ComponentProps<'input'>) {
  return <input className={`${control} h-12 ${className}`} {...rest} />
}

export function Textarea({ className = '', ...rest }: ComponentProps<'textarea'>) {
  return <textarea className={`${control} min-h-32 py-3 leading-relaxed ${className}`} {...rest} />
}

export function Select({ className = '', children, ...rest }: ComponentProps<'select'>) {
  return (
    <select className={`${control} h-12 pr-9 ${className}`} {...rest}>
      {children}
    </select>
  )
}
