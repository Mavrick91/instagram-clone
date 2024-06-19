import {
  QueryClient,
  QueryClientProvider as Provider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

type QueryClientProviderProps = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

const QueryClientProvider = ({ children }: QueryClientProviderProps) => {
  return (
    <Provider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </Provider>
  );
};

export default QueryClientProvider;
