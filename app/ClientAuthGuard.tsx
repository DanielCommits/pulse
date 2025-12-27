"use client";

import { useAuth } from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PUBLIC_ROUTES = ["/login", "/signup"];

export default function ClientAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false); // ✅ add ready flag

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (loading) return; // wait until Firebase resolves

    // delay redirect one tick to avoid Safari restoring page
    setTimeout(() => {
      if (!user && !isPublicRoute) {
        router.replace("/login");
      }
      if (user && isPublicRoute) {
        router.replace("/home");
      }
      setReady(true);
    }, 0);
  }, [user, loading, isPublicRoute, router]);

  // render nothing until ready
  if (!ready) return null;

  return <>{children}</>;
}
