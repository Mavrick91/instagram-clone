import { MantineProvider } from "@mantine/core";
import { dehydrate } from "@tanstack/react-query";
import { ReactNode } from "react";

import getQueryClient from "@/lib/queryClient";

import ReactQueryProvider from "./ReactQueryProvider";
import { ThemeProvider } from "./ThemeProvider";

type ProviderProps = {
  children: ReactNode;
};

const Provider = ({ children }: ProviderProps) => {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);

  return (
    <MantineProvider>
      <ReactQueryProvider dehydratedState={dehydratedState}>
        <ThemeProvider>{children}</ThemeProvider>
      </ReactQueryProvider>
    </MantineProvider>
  );
};

export default Provider;
