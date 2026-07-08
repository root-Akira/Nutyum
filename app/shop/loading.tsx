import { Loader } from "lucide-react"

export default function ShopLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 bg-[#FAF7EE]">
      <Loader size={32} className="animate-spin text-[#173D22]" />
      <p className="mt-4 text-sm text-[#4C5A48]">Loading products...</p>
    </div>
  )
}
