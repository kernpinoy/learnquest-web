"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { QueryClientConfig } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const config: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000,
      refetchInterval: 1000,
    },
  },
};

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient(config));

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
}
