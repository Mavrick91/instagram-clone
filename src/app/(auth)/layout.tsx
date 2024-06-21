import dynamic from "next/dynamic";

import { getCurrentUser } from "@/actions/user";
import MainLayout from "@/layout/MainLayout";
import { ModalProvider } from "@/providers/ModalProvider";
import { UserInfoProvider } from "@/providers/UserInfoProvider";

const SideNavProvider = dynamic(() => import("@/providers/SideNavProvider"), {
  ssr: false,
});

type HomeLayoutProps = {
  children: React.ReactNode;
};

const HomeLayout = async ({ children }: HomeLayoutProps) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  return (
    <SideNavProvider>
      <UserInfoProvider currentUser={currentUser}>
        <ModalProvider>
          <MainLayout>{children}</MainLayout>
          <div id="modal-root" />
        </ModalProvider>
      </UserInfoProvider>
    </SideNavProvider>
  );
};

export default HomeLayout;
