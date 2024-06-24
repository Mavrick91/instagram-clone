import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

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

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="mx-auto flex max-w-lg-page flex-col">
      <div className="px-5 pt-9">
        <HydrationBoundary state={dehydratedState}>
          <UserProfile initialUserProfile={userProfile} />
          <UserProfileTab
            userProfileId={userProfile.id}
            username={userProfile.username}
          />
          {children}
        </HydrationBoundary>
      </div>
    </div>
  );
};

export default ProfileLayout;
