import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Hero } from "@/components/hero"
import { Section } from "@/components/section"
import { ServiceCard, DestinationCard } from "@/components/cards"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main>
        <Hero />

        <Section
          title="End-to-end guidance"
          description="From profile evaluation to visa stamping, we keep you informed at every step—no jargon, no surprises."
          className="bg-white"
        >
          <div className="grid gap-6 md:grid-cols-3">
            <ServiceCard
              title="Admissions"
              description="Shortlist universities, craft SOPs/LoRs, and apply with a strong, coherent profile."
              imageAlt="Students reviewing application documents"
              imageQuery="students reviewing university application documents"
            />
            <ServiceCard
              title="Test Prep"
              description="Structured prep for IELTS, TOEFL, GRE, GMAT with mock tests and feedback."
              imageAlt="Test preparation with books and laptop"
              imageQuery="IELTS TOEFL GRE GMAT preparation with books and laptop"
            />
            <ServiceCard
              title="Visa & Finance"
              description="Visa filing, financial documentation, and scholarship guidance tailored to your case."
              imageAlt="Passport and visa documents"
              imageQuery="passport visa documents on desk"
            />
          </div>
        </Section>

        <Section
          title="Top destinations we guide for"
          description="Choose from the most in-demand countries for education and career growth."
          className="bg-card"
        >
          <div className="grid gap-6 md:grid-cols-4">
            <DestinationCard
              country="USA"
              summary="World-class programs, strong STEM ecosystem, and OPT pathways."
              imageAlt="City skyline in the USA"
              imageQuery="USA university campus skyline"
            />
            <DestinationCard
              country="Canada"
              summary="Student-friendly immigration policies and high quality of life."
              imageAlt="Canadian campus"
              imageQuery="Canada university campus"
            />
            <DestinationCard
              country="UK"
              summary="Globally recognized degrees and 1–2 year post-study work options."
              imageAlt="UK university architecture"
              imageQuery="UK university architecture"
            />
            <DestinationCard
              country="Australia"
              summary="Excellent research facilities and vibrant multicultural cities."
              imageAlt="Australian campus"
              imageQuery="Australia university campus"
            />
          </div>
        </Section>

        <Section
          title="Why students in Hyderabad choose us"
          description="Local expertise, global outcomes. We understand what Hyderabad applicants need—right down to timelines, finances, and family expectations."
          className="bg-white"
        >
          <ul className="grid gap-4 md:grid-cols-2">
            <li className="rounded border p-4">
              <h3 className="font-medium">Transparent process</h3>
              <p className="mt-1 text-sm text-foreground/80">Clear milestones, shared trackers, and quick responses.</p>
            </li>
            <li className="rounded border p-4">
              <h3 className="font-medium">Personalized plans</h3>
              <p className="mt-1 text-sm text-foreground/80">Every profile is unique—so is our guidance.</p>
            </li>
            <li className="rounded border p-4">
              <h3 className="font-medium">Timely mock reviews</h3>
              <p className="mt-1 text-sm text-foreground/80">
                Practice interviews, SOP/LoR editing, and test feedback.
              </p>
            </li>
            <li className="rounded border p-4">
              <h3 className="font-medium">End-to-end support</h3>
              <p className="mt-1 text-sm text-foreground/80">
                From shortlisting to departure checklist and arrival tips.
              </p>
            </li>
          </ul>

          <div className="mt-8">
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/contact">Talk to an expert</Link>
            </Button>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </div>
  )
}
