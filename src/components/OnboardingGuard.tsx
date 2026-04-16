"use client";

import { useUser } from "@/context/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !profile.isOnboarded && pathname !== "/onboarding") {
      router.push("/onboarding");
    }
  }, [loading, profile.isOnboarded, pathname, router]);

  return <>{children}</>;
}
