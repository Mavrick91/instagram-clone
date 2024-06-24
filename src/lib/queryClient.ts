import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

const getQueryClient = cache(() => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5000, // 5 seconds
      },
    },
  });
});

export default getQueryClient;
