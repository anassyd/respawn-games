"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 5 * 60_000, refetchOnWindowFocus: false, retry: 1 } } }));
  return (
    <QueryClientProvider client={client}>
      <MotionConfig reducedMotion="user">
        {children}
        <Toaster
          position="bottom-center"
          theme="dark"
          toastOptions={{ className: "!bg-deep/95 !border-white/10 !text-star !font-sans backdrop-blur-xl" }}
        />
      </MotionConfig>
    </QueryClientProvider>
  );
}
