"use client";

import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/actions/user";
import { useUserInfo } from "@/providers/UserInfoProvider";
import { UserProfileType } from "@/types/user"; // Adjust this import as needed
import { getIsCurrentUserFollowingProfile } from "@/utils/user";

import UserProfile from "../UserProfile";
import UserProfileTab from "../UserProfileTab";

type ProfileContentProps = {
  userProfile: UserProfileType;
};

const ProfileContent = ({ userProfile }: ProfileContentProps) => {
  const user = useUserInfo();

  if (!user) return null;

  const isFollowingProfile = getIsCurrentUserFollowingProfile(
    user,
    userProfile.id,
  );

  return (
    <>
      <UserProfile
        isFollowingCurrentProfile={isFollowingProfile}
        userProfile={userProfile}
        currentUserId={user.id}
      />
      <UserProfileTab
        currentUserId={user.id}
        userProfileId={userProfile.id}
        username={userProfile.username}
      />
    </>
  );
};

export default ProfileContent;
