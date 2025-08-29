"use client"

import type React from "react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Section } from "@/components/section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")
    try {
      // Simulate submission; replace with API/Server Action if needed
      await new Promise((res) => setTimeout(res, 800))
      setStatus("sent")
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="min-h-dvh bg-white text-slate-900">
      <SiteHeader />
      <main>
        <Section
          title="Contact us"
          description="Tell us about your goals—study, work, or research abroad. We’ll get back within 24 hours."
          className="bg-slate-100"
        />
        <Section title="Let's connect" className="bg-white">
          <div className="grid gap-10 md:grid-cols-2">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-900" htmlFor="name">
                  Full name
                </label>
                <Input id="name" name="name" required placeholder="Your name" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-900" htmlFor="email">
                  Email
                </label>
                <Input id="email" name="email" type="email" required placeholder="you@example.com" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-900" htmlFor="phone">
                  Phone
                </label>
                <Input id="phone" name="phone" required placeholder="+91 ..." />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-900" htmlFor="message">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  placeholder="Tell us your plan—course, country, target intake..."
                  rows={5}
                />
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={status === "sending"}>
                {status === "sending" ? "Sending..." : status === "sent" ? "Submitted ✓" : "Send message"}
              </Button>
              {status === "error" ? (
                <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
              ) : null}
            </form>

            <div className="space-y-4">
              <div className="rounded border p-4">
                <h3 className="font-medium">Hyderabad Office</h3>
                <p className="mt-1 text-sm text-slate-900/80">
                  3rd Floor, Jubilee Hills
                  <br />
                  Hyderabad, Telangana
                </p>
              </div>
              <div className="rounded border p-4">
                <h3 className="font-medium">Contact</h3>
                <p className="mt-1 text-sm text-slate-900/80">+91 98765 43210</p>
                <p className="text-sm text-slate-900/80">hello@firstconsults.com</p>
                <p className="text-sm text-slate-900/80">Mon–Sat, 10am–6pm</p>
              </div>
            </div>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </div>
  )
}
