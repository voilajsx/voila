import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Section } from "@/components/section"

export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-white text-slate-900">
      <SiteHeader />
      <main>
        <Section
          title="About FirstConsults"
          description="We’re a Hyderabad-based consulting team helping students and professionals achieve their international education and career goals."
          className="bg-slate-100"
        />
        <Section title="Our mission" className="bg-white">
          <div className="prose max-w-none">
            <p className="text-base leading-relaxed text-slate-900/80">
              Our mission is to deliver honest, timely, and structured guidance that reduces stress and increases
              clarity for applicants and families. We prioritize transparency—clear timelines, realistic options, and
              measurable progress.
            </p>
          </div>
        </Section>
        <Section title="Our approach" className="bg-white">
          <ul className="grid gap-4 md:grid-cols-3">
            <li className="rounded border p-4">
              <h3 className="font-medium">Profile-first</h3>
              <p className="mt-1 text-sm text-slate-900/80">
                We start with your strengths and constraints, then match opportunities.
              </p>
            </li>
            <li className="rounded border p-4">
              <h3 className="font-medium">Clarity at every step</h3>
              <p className="mt-1 text-sm text-slate-900/80">
                Milestones, owner, and due dates are visible and tracked.
              </p>
            </li>
            <li className="rounded border p-4">
              <h3 className="font-medium">Documentation excellence</h3>
              <p className="mt-1 text-sm text-slate-900/80">SOP/LoR reviews with specific, constructive feedback.</p>
            </li>
          </ul>
        </Section>
      </main>
      <SiteFooter />
    </div>
  )
}
