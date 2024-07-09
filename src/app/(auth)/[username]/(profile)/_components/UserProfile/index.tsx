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
  const { openModal } = useModal();
  const currentUser = useUserInfo();

  const { data: userProfile } = useQuery<UserProfileType>({
    queryKey: ["user", initialUserProfile.username],
    queryFn: () => getUserProfile(initialUserProfile.username),
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
              alt={
                userProfile.username
                  ? `${userProfile.username} profile picture`
                  : "User posts picture"
              }
              className="rounded-full"
              height={150}
              src={userProfile.avatar || "/placeholder-avatar.png"}
              width={150}
            />
          </div>
          <section className="ml-12 grow">
            <div className="flex h-10 items-center">
              <h1 className="text-xl text-ig-primary-text">
                <span>{userProfile.username}</span>
              </h1>
              <div className="ml-5 flex items-center space-x-2">
                {currentUser.id === userProfile.id ? (
                  <OwnProfile />
                ) : (
                  <ButtonFollow
                    buttonProps={{
                      variant: isCurrentUserFollowingProfile
                        ? "gray"
                        : "primary",
                    }}
                    isFollowing={isCurrentUserFollowingProfile}
                    userProfileId={userProfile.id}
                    userProfileUsername={userProfile.username}
                  />
                )}
              </div>
            </div>
            <div className="my-3 flex space-x-8 text-ig-primary-text">
              <span>
                <Pluralize
                  bold
                  count={userProfile._count.pictures}
                  singular="post"
                />
              </span>
              <button
                type="button"
                onClick={() => {
                  return openModal("followersDialog", {
                    isFollowers: true,
                    followers: userProfile.received_follows,
                  });
                }}
              >
                <Pluralize
                  bold
                  count={userProfile._count.received_follows}
                  singular="follower"
                />
              </button>
              <button
                type="button"
                onClick={() => {
                  return openModal("followersDialog", {
                    followers: userProfile.initiated_follows,
                  });
                }}
              >
                <Pluralize
                  bold
                  count={userProfile._count.initiated_follows}
                  singular="following"
                />
              </button>
            </div>
            <div className="text-sm text-ig-primary-text">
              <span className="font-bold">
                {userProfile.first_name} {userProfile.last_name}
              </span>
              {userProfile.bio && (
                <p className="text-ig-primary-text">{userProfile.bio}</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
