export default function RootLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#FAF7EE]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#173D22] border-t-transparent" />
        <p className="text-sm text-[#4C5A48]">Loading...</p>
      </div>
    </div>
  )
}
