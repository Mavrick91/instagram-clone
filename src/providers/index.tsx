import { MantineProvider } from "@mantine/core";
import { ReactNode } from "react";

import ReactQueryProvider from "@/providers/ReactQueryProvider";

import { ThemeProvider } from "./ThemeProvider";

type ProviderProps = {
  children: ReactNode;
};

const Provider = ({ children }: ProviderProps) => {
  return (
    <MantineProvider>
      <ReactQueryProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </ReactQueryProvider>
    </MantineProvider>
  );
};

export default Provider;
