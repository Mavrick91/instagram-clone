import {
  QueryClient,
  QueryClientProvider as Provider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";

type QueryClientProviderProps = {
  children: ReactNode;
};

const QueryClientProvider = ({ children }: QueryClientProviderProps) => {
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5000, // 5 seconds
        },
      },
    });
  });

  return (
    <Provider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </Provider>
  );
};

export default QueryClientProvider;
