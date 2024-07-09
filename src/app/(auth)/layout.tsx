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

  return (
    <SideNavProvider>
      <UserInfoProvider initialCurrentUser={currentUser}>
        <ModalProvider>
          <MainLayout>{children}</MainLayout>
          <div id="modal-root" />
        </ModalProvider>
      </UserInfoProvider>
    </SideNavProvider>
  );
};

export default HomeLayout;
