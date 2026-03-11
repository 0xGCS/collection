import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

const WALLET_ADDRESS = '0x0024E8728351E5FE888DBe61AFbc0010B9B0300d'

export default function LandingPage() {
  const [copied, setCopied] = useState(false)

  const copyWallet = async () => {
    await navigator.clipboard.writeText(WALLET_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6">
      <div className="max-w-2xl space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary-text">
          Welcome to my overly-engineered side project.
        </h1>
        <p className="text-lg text-muted-text leading-relaxed">
          I'm into Crypto, AI, Vibe Coding, OSINT, and Investing. This is my own personal
          compendium of people, sites, and apps I find to be interesting or useful in these areas.
        </p>

        <Link to="/toooooooooools">
          <Button size="lg" className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
            Explore Toooooooooools
          </Button>
        </Link>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card-bg p-6 text-left">
            <h3 className="mb-2 text-sm font-semibold text-primary-text">Have suggestions?</h3>
            <a
              href="https://t.me/OxGCS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
              Message me on Telegram
            </a>
          </div>

          <div className="rounded-lg border border-border bg-card-bg p-6 text-left">
            <h3 className="mb-2 text-sm font-semibold text-primary-text">Support this project:</h3>
            <div className="flex items-center gap-2">
              <code className="block flex-1 truncate rounded bg-table-header-bg px-3 py-2 font-mono text-xs text-muted-text">
                {WALLET_ADDRESS}
              </code>
              <Button variant="ghost" size="icon" onClick={copyWallet} className="shrink-0 text-muted-text hover:text-primary-text">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
