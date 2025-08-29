import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="bg-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 md:py-24">
        <span className="inline-flex items-center rounded-full bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-600">
          Hyderabad’s trusted abroad consultants
        </span>
        <h1 className="text-pretty text-3xl font-semibold leading-tight text-slate-900 md:text-5xl">
          Study, work, and build your future overseas with confidence
        </h1>
        <p className="max-w-2xl text-pretty text-base leading-relaxed text-slate-900/80 md:text-lg">
          FirstConsults guides you through admissions, visas, test prep, and scholarships—step by step. Transparent
          process, timely updates, and personalized plans.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/contact">Book a free consultation</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/services">Explore our services</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
