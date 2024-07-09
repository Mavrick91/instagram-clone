import { getUserProfile } from "@/actions/user";
import UserProfile from "@/app/(auth)/[username]/(profile)/_components/UserProfile";
import UserProfileTab from "@/app/(auth)/[username]/(profile)/_components/UserProfileTab";
import getQueryClient from "@/lib/queryClient";
import { ServerLayoutProps } from "@/types/global";

import ErrorProfile from "./_components/ErrorProfile";

const ProfileLayout = async ({
  params,
  children,
}: ServerLayoutProps<"username">) => {
  const userUsername = params.username;
  const queryClient = getQueryClient();

  const userProfile = await queryClient.ensureQueryData({
    queryKey: ["user", userUsername],
    queryFn: () => {
      return getUserProfile(userUsername);
    },
  });

  if (!userProfile) return <ErrorProfile />;

  return (
    <div className="mx-auto flex max-w-polaris-site-width-wide flex-col">
      <div className="px-5 pt-9">
        <UserProfile initialUserProfile={userProfile} />
        <UserProfileTab
          username={userProfile.username}
          userProfileId={userProfile.id}
        />
        {children}
      </div>
    </div>
  );
};

export default ProfileLayout;
