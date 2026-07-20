import { Wrench } from 'lucide-react'

export default function MaintenancePage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#173D22]">
        <Wrench className="h-10 w-10 text-[#E0961A]" />
      </div>
      <h1 className="mb-3 font-serif text-3xl font-bold text-[#173D22]">
        We&rsquo;ll Be Right Back
      </h1>
      <p className="mb-8 max-w-md text-gray-600">
        We&rsquo;re currently performing scheduled maintenance to improve your
        experience. Please check back shortly.
      </p>
      <div className="flex items-center gap-2 text-sm text-[#173D22]/60">
        <span className="inline-block h-2 w-2 rounded-full bg-[#E0961A] animate-pulse" />
        Under Maintenance
      </div>
    </div>
  )
}
