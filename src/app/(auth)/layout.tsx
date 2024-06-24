import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { ReactNode } from "react";

import { getCurrentUser } from "@/actions/user";
import MainLayout from "@/layout/MainLayout";
import getQueryClient from "@/lib/queryClient";
import { ModalProvider } from "@/providers/ModalProvider";
import { UserInfoProvider } from "@/providers/UserInfoProvider";

const SideNavProvider = dynamic(
  () => {
    return import("@/providers/SideNavProvider");
  },
  {
    ssr: false,
  },
);

type HomeLayoutProps = {
  children: ReactNode;
};

const HomeLayout = async ({ children }: HomeLayoutProps) => {
  const queryClient = getQueryClient();
  const currentUser = await queryClient.ensureQueryData({
    queryKey: ["user", "currentUser"],
    queryFn: getCurrentUser,
  });

  if (!currentUser) {
    return null;
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <SideNavProvider>
      <HydrationBoundary state={dehydratedState}>
        <UserInfoProvider initialCurrentUser={currentUser}>
          <ModalProvider>
            <MainLayout>{children}</MainLayout>
            <div id="modal-root" />
          </ModalProvider>
        </UserInfoProvider>
      </HydrationBoundary>
    </SideNavProvider>
  );
};

export default HomeLayout;
