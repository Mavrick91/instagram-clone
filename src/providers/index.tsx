"use client";

import QueryClientProvider from "./ReactQueryProvider";
import { ThemeProvider } from "./ThemeProvider";

type ProviderProps = {
  children: React.ReactNode;
};

const Provider = ({ children }: ProviderProps) => {
  return (
    <QueryClientProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  );
};

export default Provider;
