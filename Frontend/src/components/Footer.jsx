import React from 'react'

export default function Footer() {
  return (
    <footer className="w-full mt-16">
      <div className="max-w-7xl mx-auto py-12 px-6 text-slate-400">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
          <div className="col-span-2">
            <div className="text-teal-400 font-bold text-lg">FinGenie</div>
            <p className="mt-4 text-sm">Loved by 50k+ users worldwide</p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200">Product</h4>
            <ul className="mt-3 text-sm space-y-2">
              <li>Pricing</li>
              <li>Features</li>
              <li>Integrations</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200">Company</h4>
            <ul className="mt-3 text-sm space-y-2">
              <li>About</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200">Legal</h4>
            <ul className="mt-3 text-sm space-y-2">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
