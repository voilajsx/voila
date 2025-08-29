import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Section } from "@/components/section"
import { DestinationCard } from "@/components/cards"

export default function DestinationsPage() {
  return (
    <div className="min-h-dvh bg-white text-slate-900">
      <SiteHeader />
      <main>
        <Section
          title="Destinations"
          description="Choose a country to explore typical timelines, intakes, eligibility, and costs."
          className="bg-slate-100"
        />
        <Section title="Popular Countries" className="bg-white">
          <div className="grid gap-6 md:grid-cols-3">
            <DestinationCard
              country="USA"
              summary="Fall/Spring intakes, strong STEM, OPT, and research opportunities."
              imageAlt="USA university campus"
              imageQuery="USA university campus"
            />
            <DestinationCard
              country="Canada"
              summary="Fall/Winter intakes, co-op programs, and PR-friendly pathways."
              imageAlt="Canadian campus"
              imageQuery="Canadian university campus"
            />
            <DestinationCard
              country="UK"
              summary="Multiple intakes, one-year Masters, and global recognition."
              imageAlt="UK university"
              imageQuery="UK university campus"
            />
            <DestinationCard
              country="Australia"
              summary="Two major intakes, research strength, and high employability."
              imageAlt="Australian university"
              imageQuery="Australian university campus"
            />
            <DestinationCard
              country="Germany"
              summary="Public universities, low tuition, and strong engineering programs."
              imageAlt="German university"
              imageQuery="German university campus"
            />
            <DestinationCard
              country="Ireland"
              summary="Strong tech scene, one-year Masters, and post-study options."
              imageAlt="Irish university"
              imageQuery="Irish university campus"
            />
          </div>
        </Section>
      </main>
      <SiteFooter />
    </div>
  )
}
