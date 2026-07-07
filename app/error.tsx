"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-brand-green/10 flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-brand-green" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
      </div>
      <h1 className="font-heading text-3xl md:text-4xl text-brand-green mb-3">Something went wrong</h1>
      <p className="text-foreground/60 max-w-md mb-8">
        We encountered an unexpected error. Please try again or head back to the homepage.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => unstable_retry()}
          className="px-6 py-3 bg-brand-green text-white rounded-full font-medium hover:bg-brand-green/90 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-3 border border-brand-green/20 text-brand-green rounded-full font-medium hover:bg-brand-green/5 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
