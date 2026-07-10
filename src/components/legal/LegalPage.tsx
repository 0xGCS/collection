import { useEffect, type ReactNode } from 'react'

interface LegalPageProps {
  title: string
  children: ReactNode
}

export default function LegalPage({ title, children }: LegalPageProps) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = `${title} | Greg's Compendium`
    return () => {
      document.title = previousTitle
    }
  }, [title])

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-6 sm:py-10">
      <header className="mb-8 sm:mb-11">
        <h1 className="text-3xl font-bold tracking-tight text-primary-text sm:text-4xl">{title}</h1>
      </header>
      <div className="space-y-8">{children}</div>
    </div>
  )
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card-bg px-5 py-5 sm:px-6 sm:py-6">
      <h2 className="mb-3 text-lg font-semibold text-primary-text">{title}</h2>
      <div className="space-y-3 text-[0.9375rem] leading-relaxed text-muted-text">{children}</div>
    </section>
  )
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}
