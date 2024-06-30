"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

import SideNav from "@/components/SideNav";
import { cn } from "@/lib/utils";
import { useModal } from "@/providers/ModalProvider";
import { useSideNav } from "@/providers/SideNavProvider";

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const { sideNavOpen, isConversationPage } = useSideNav();
  const pathname = usePathname();
  const { closeAllModals } = useModal();

  useEffect(() => {
    closeAllModals();
  }, [closeAllModals, pathname]);

  return (
    <>
      <div className="flex h-full bg-ig-primary-background">
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
