"use client";

import { useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useRequireAuth() {
  const { data: session } = useSession();
  const router = useRouter();

  const requireAuth = useCallback(
    (action: () => void) => {
      if (!session) {
        router.push(
          `/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`
        );
        return;
      }
      action();
    },
    [session, router]
  );

  return requireAuth;
}
