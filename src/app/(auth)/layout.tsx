import { getCurrentUser } from "@/actions/user";
import MainLayout from "@/layout/MainLayout";
import { SideNavProvider } from "@/providers/SideNavProvider";
import { UserInfoProvider } from "@/providers/UserInfoProvider";

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
        <MainLayout>{children}</MainLayout>
        <div id="modal-root" />
      </UserInfoProvider>
    </SideNavProvider>
  );
};

export default HomeLayout;
