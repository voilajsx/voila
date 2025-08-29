import Image from "next/image"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function ServiceCard({
  title,
  description,
  imageAlt,
  imageQuery,
}: {
  title: string
  description: string
  imageAlt: string
  imageQuery: string
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-slate-900">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded">
          <Image
            src={`/abstract-geometric-shapes.png?height=360&width=640&query=${encodeURIComponent(imageQuery)}`}
            alt={imageAlt}
            fill
            className="object-cover"
          />
        </div>
        <p className="text-sm leading-relaxed text-slate-900/80">{description}</p>
      </CardContent>
    </Card>
  )
}

export function DestinationCard({
  country,
  summary,
  imageAlt,
  imageQuery,
}: {
  country: string
  summary: string
  imageAlt: string
  imageQuery: string
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-slate-900">{country}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded">
          <Image
            src={`/abstract-geometric-shapes.png?height=360&width=640&query=${encodeURIComponent(imageQuery)}`}
            alt={imageAlt}
            fill
            className="object-cover"
          />
        </div>
        <p className="text-sm leading-relaxed text-slate-900/80">{summary}</p>
      </CardContent>
    </Card>
  )
}
