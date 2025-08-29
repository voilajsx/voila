"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/destinations", label: "Destinations" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        <Link href="/" className="flex items-center gap-2" aria-label="FirstConsults Home">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-red-600 text-white font-semibold">
            F
          </span>
          <span className="font-semibold tracking-tight">FirstConsults</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground/80 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <Link href="/contact">Get Guidance</Link>
          </Button>
        </nav>

        <button
          className="inline-flex items-center justify-center rounded md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="i-lucide-menu h-6 w-6" />
        </button>
      </div>

      <div id="mobile-nav" className={cn("md:hidden border-t bg-white", open ? "block" : "hidden")}>
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded px-2 py-2 text-sm font-medium text-foreground/80 hover:bg-card hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild className="mt-2 bg-red-600 hover:bg-red-700">
            <Link href="/contact" onClick={() => setOpen(false)}>
              Get Guidance
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
