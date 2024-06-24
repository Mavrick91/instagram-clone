"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

import { getUserProfile } from "@/actions/user";
import ButtonFollow from "@/components/ButtonFollow";
import { Pluralize } from "@/components/Pluralize";
import { useModal } from "@/providers/ModalProvider";
import { useUserInfo } from "@/providers/UserInfoProvider";
import { UserProfileType } from "@/types/user";
import { getIsCurrentUserFollowingProfile } from "@/utils/user";

import OwnProfile from "../OwnProfile";

type UserProfileProps = {
  initialUserProfile: UserProfileType;
};

const UserProfile = ({ initialUserProfile }: UserProfileProps) => {
  const { showModal } = useModal();
  const currentUser = useUserInfo();

  const { data: userProfile } = useQuery<UserProfileType>({
    queryKey: ["user", initialUserProfile.username],
    queryFn: () => {
      return getUserProfile(initialUserProfile.username);
    },
    initialData: initialUserProfile,
  });

  const isCurrentUserFollowingProfile = getIsCurrentUserFollowingProfile(
    currentUser,
    userProfile.id,
  );

  return (
    <>
      <div className="mb-11">
        <div className="flex">
          <div className="mx-auto flex w-64 shrink-0 justify-center">
            <Image
              src={userProfile.avatar || "/placeholder-avatar.png"}
              alt={
                userProfile.username
                  ? `${userProfile.username} profile picture`
                  : "User posts picture"
              }
              width={150}
              height={150}
              className="rounded-full"
            />
          </div>
          <section className="ml-12 grow">
            <div className="flex h-10 items-center">
              <h1 className="text-xl text-primary-text">
                <span>{userProfile.username}</span>
              </h1>
              <div className="ml-5 flex items-center space-x-2">
                {currentUser.id === userProfile.id ? (
                  <OwnProfile />
                ) : (
                  <ButtonFollow
                    isFollowing={isCurrentUserFollowingProfile}
                    userProfileUsername={userProfile.username}
                    userProfileId={userProfile.id}
                    buttonProps={{
                      variant: isCurrentUserFollowingProfile ? "gray" : "blue",
                      size: "xs",
                    }}
                  />
                )}
              </div>
            </div>
            <div className="my-3 flex space-x-8 text-primary-text">
              <span>
                <Pluralize
                  count={userProfile._count.pictures}
                  singular="post"
                  bold
                />
              </span>
              <button
                type="button"
                onClick={() => {
                  return showModal("Followers", {
                    isFollowers: true,
                    followers: userProfile.receivedFollows,
                  });
                }}
              >
                <Pluralize
                  count={userProfile._count.receivedFollows}
                  singular="follower"
                  bold
                />
              </button>
              <button
                type="button"
                onClick={() => {
                  return showModal("Followers", {
                    followers: userProfile.initiatedFollows,
                  });
                }}
              >
                <Pluralize
                  count={userProfile._count.initiatedFollows}
                  singular="following"
                  bold
                />
              </button>
            </div>
            <div className="text-sm text-primary-text">
              <span className="font-bold">
                {userProfile.firstName} {userProfile.lastName}
              </span>
              {userProfile.bio && (
                <p className="text-primary-text">{userProfile.bio}</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
