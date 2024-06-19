import { getCurrentUser, getUserProfile } from "@/actions/user";
import { ServerLayoutProps } from "@/types/global";

import ErrorProfile from "./_components/ErrorProfile";
import UserProfile from "./_components/UserProfile";
import UserProfileTab from "./_components/UserProfileTab";

const ProfileLayout = async ({
  params,
  children,
}: ServerLayoutProps<"username">) => {
  const userUsername = params.username;

  const userProfile = await getUserProfile(userUsername);

  if (!userProfile) return <ErrorProfile />;

  const currentUser = await getCurrentUser();
  const isFollowingProfile = currentUser.initiatedFollows.some(
    (initiateFollow) => initiateFollow.targetUserId === userProfile.id,
  );

  return (
    <div className="mx-auto flex max-w-lg-page flex-col">
      <div className="px-5 pt-9">
        {userProfile && (
          <>
            <UserProfile
              isFollowingCurrentProfile={isFollowingProfile}
              userProfile={userProfile}
              currentUserId={currentUser.id}
            />

            <UserProfileTab
              currentUserId={currentUser.id}
              userProfileId={userProfile.id}
              username={userProfile.username}
            />
          </>
        )}
        {children}
      </div>
    </div>
  );
};

export default ProfileLayout;
