import type { ReactNode } from "react"

export function Section({
  title,
  description,
  children,
  className,
}: {
  title: string
  description?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <section className={className}>
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="max-w-2xl">
          <h2 className="text-pretty text-2xl font-semibold text-slate-900 md:text-3xl">{title}</h2>
          {description ? <p className="mt-3 text-base leading-relaxed text-slate-900/80">{description}</p> : null}
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  )
}
