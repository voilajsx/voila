import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white font-semibold">
              F
            </span>
            <span className="font-semibold">FirstConsults</span>
          </div>
          <p className="mt-3 text-sm text-slate-900/70">
            Trusted abroad consulting from Hyderabad. Guidance for admissions, visas, test prep, and career pathways.
          </p>
          <p className="mt-3 text-sm text-slate-900/70">Office: 3rd Floor, Jubilee Hills, Hyderabad, Telangana</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">Company</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <Link className="text-sm text-slate-900/80 hover:text-slate-900" href="/about">
                About
              </Link>
            </li>
            <li>
              <Link className="text-sm text-slate-900/80 hover:text-slate-900" href="/services">
                Services
              </Link>
            </li>
            <li>
              <Link className="text-sm text-slate-900/80 hover:text-slate-900" href="/destinations">
                Destinations
              </Link>
            </li>
            <li>
              <Link className="text-sm text-slate-900/80 hover:text-slate-900" href="/contact">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">Reach us</h3>
          <ul className="mt-3 space-y-2">
            <li className="text-sm text-slate-900/80">+91 98765 43210</li>
            <li className="text-sm text-slate-900/80">hello@firstconsults.com</li>
            <li className="text-sm text-slate-900/80">Mon–Sat, 10am–6pm</li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <p className="text-xs text-slate-900/70">© {new Date().getFullYear()} FirstConsults. All rights reserved.</p>
          <p className="text-xs text-slate-900/70">Made in Hyderabad</p>
        </div>
      </div>
    </footer>
  )
}
