import "@testing-library/jest-dom/extend-expect";

import { PrismaClient } from "@prisma/client";
import { ReactNode } from "react";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export type RevalidatePath = {
  originalPath: string;
  type?: "layout" | "page";
};

type Params<K extends string> = Record<K, string>;

export type ServerPageProps<
  TParams extends string = never,
  TSearchParams extends string = never,
> = {
  params: Params<TParams>;
  searchParams: Params<TSearchParams>;
};

export type ServerLayoutProps<TParams extends string = never> = {
  params: Params<TParams>;
  children: ReactNode;
};

export type ServerCatchAllPageProps<
  TParams extends string = never,
  TSearchParams extends string = never,
> = {
  params: Record<TParams, string[]>;
  searchParams: Params<TSearchParams>;
};
