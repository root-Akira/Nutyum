"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col items-center justify-center bg-[#FAF7EE] px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-[#173D22]/10 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-[#173D22]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl text-[#173D22] mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>
          Critical error
        </h1>
        <p className="text-[#173D22]/60 max-w-md mb-8">
          A critical error occurred. Please refresh the page or try again.
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-[#173D22] text-white rounded-full font-medium hover:bg-[#173D22]/90 transition-colors"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
