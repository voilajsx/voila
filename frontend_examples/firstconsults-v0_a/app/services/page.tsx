import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Section } from "@/components/section"
import { ServiceCard } from "@/components/cards"

export default function ServicesPage() {
  return (
    <div className="min-h-dvh bg-white text-slate-900">
      <SiteHeader />
      <main>
        <Section
          title="Our Services"
          description="Comprehensive guidance designed to reduce uncertainty and accelerate your journey."
          className="bg-slate-100"
        />
        <Section title="What we offer" className="bg-white">
          <div className="grid gap-6 md:grid-cols-3">
            <ServiceCard
              title="Profile Evaluation"
              description="Assess academics, test scores, experience, and budget to craft a realistic plan."
              imageAlt="Profile evaluation discussion"
              imageQuery="profile evaluation consulting discussion"
            />
            <ServiceCard
              title="University Shortlisting"
              description="Balanced shortlist by dream, target, and safe categories with deadlines aligned."
              imageAlt="University shortlist planning"
              imageQuery="university shortlist planning board"
            />
            <ServiceCard
              title="Application Support"
              description="SOP/LoR guidance, resume polishing, and application portal reviews."
              imageAlt="Application document review"
              imageQuery="application document review"
            />
            <ServiceCard
              title="Test Preparation"
              description="IELTS/TOEFL/GRE/GMAT support, schedules, and mocks tailored to your level."
              imageAlt="Test prep session"
              imageQuery="IELTS TOEFL GRE GMAT mock test session"
            />
            <ServiceCard
              title="Visa Guidance"
              description="Document checklists, financial planning, and interview preparation."
              imageAlt="Visa interview preparation"
              imageQuery="visa interview preparation documents"
            />
            <ServiceCard
              title="Scholarships & Finance"
              description="Identify scholarships and optimize your financing strategy."
              imageAlt="Scholarship planning"
              imageQuery="scholarship planning finance documents"
            />
          </div>
        </Section>
      </main>
      <SiteFooter />
    </div>
  )
}
