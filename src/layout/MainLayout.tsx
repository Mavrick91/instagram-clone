"use client";

import { ReactNode } from "react";

import SideNav from "@/components/SideNav";
import { cn } from "@/lib/utils";
import { useSideNav } from "@/providers/SideNavProvider";

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const { sideNavOpen, isConversationPage } = useSideNav();

  return (
    <>
      <div className="flex h-full bg-primary-background">
        <SideNav />
        <div
          className={cn("overflow-y-auto h-full w-full", {
            "ml-nav-narrow-width": !sideNavOpen || isConversationPage,
            "ml-nav-medium-width": sideNavOpen || !isConversationPage,
          })}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default MainLayout;
