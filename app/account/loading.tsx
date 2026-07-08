import { Loader } from "lucide-react"

export default function AccountLoading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader size={28} className="animate-spin text-[#173D22]" />
    </div>
  )
}
