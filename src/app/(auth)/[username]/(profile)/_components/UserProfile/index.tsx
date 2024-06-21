"use client";

import Image from "next/image";

import ButtonFollow from "@/components/ButtonFollow";
import { Pluralize } from "@/components/Pluralize";
import { revalidateUserProfilePage } from "@/constants/revalidate";
import { useModalFunctions } from "@/providers/ModalProvider";
import { UserProfileType } from "@/types/user";

import OwnProfile from "../OwnProfile";

type UserProfileProps = {
  userProfile: UserProfileType;
  currentUserId: number;
  isFollowingCurrentProfile: boolean;
};

const UserProfile = ({
  userProfile,
  currentUserId,
  isFollowingCurrentProfile,
}: UserProfileProps) => {
  const { showModal } = useModalFunctions();

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
                {currentUserId === userProfile.id ? (
                  <OwnProfile />
                ) : (
                  <ButtonFollow
                    isFollowing={isFollowingCurrentProfile}
                    targetUserId={userProfile.id}
                    buttonProps={{
                      variant: isFollowingCurrentProfile ? "gray" : "blue",
                      size: "xs",
                    }}
                    revalidateOptions={revalidateUserProfilePage}
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
                onClick={() =>
                  showModal("Followers", {
                    isFollowers: true,
                    followers: userProfile.receivedFollows,
                  })
                }
              >
                <Pluralize
                  count={userProfile._count.receivedFollows}
                  singular="follower"
                  bold
                />
              </button>
              <button
                type="button"
                onClick={() =>
                  showModal("Followers", {
                    followers: userProfile.initiatedFollows,
                  })
                }
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
