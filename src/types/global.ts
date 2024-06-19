import { ReactNode } from "react";

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

export type ServerCatchAllLayoutProps<TParams extends string = never> = {
  params: Record<TParams, string[]>;
  children: ReactNode;
};

export type ServerCatchAllPageProps<
  TParams extends string = never,
  TSearchParams extends string = never,
> = {
  params: Record<TParams, string[]>;
  searchParams: Params<TSearchParams>;
};
