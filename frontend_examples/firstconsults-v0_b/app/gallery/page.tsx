import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Section } from "@/components/section"

async function getRandomDogImages(count = 6) {
  const urls = Array.from({ length: count }, () => "https://dog.ceo/api/breeds/image/random")
  const results = await Promise.all(
    urls.map(async (u) => {
      const res = await fetch(u, { cache: "no-store" })
      if (!res.ok) return null
      const data = (await res.json()) as { message?: string }
      return data?.message ?? null
    }),
  )
  return results.filter(Boolean) as string[]
}

export default async function GalleryPage() {
  const images = await getRandomDogImages(6)

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main>
        <Section
          title="Gallery"
          description="A neat, responsive grid that loads 6 random images each time you visit."
          className="bg-card"
        />
        <Section title="Latest picks" className="bg-background">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {images.map((src, idx) => (
              <figure
                key={idx}
                className="group overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md"
                aria-label={`Gallery image ${idx + 1}`}
              >
                <img
                  src={src || "/placeholder.svg?height=176&width=320&query=random%20dog%20image%20grid"}
                  alt={`Random dog ${idx + 1}`}
                  className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </figure>
            ))}
          </div>
        </Section>
      </main>
      <SiteFooter />
    </div>
  )
}
