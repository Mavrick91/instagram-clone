import Link from "next/link";

import ButtonFollow from "@/components/ButtonFollow";
import PostDetailsAction from "@/components/PostDetailsDialog/PostDetailsAction";
import UserAvatar from "@/components/UserAvatar";
import { useUserInfo } from "@/providers/UserInfoProvider";
import { UserPictureDetails } from "@/types/picture";
import { getIsCurrentUserFollowingProfile } from "@/utils/user";

type PostDetailsHeaderProps = {
  picture: UserPictureDetails;
};

const PostDetailsHeader = ({ picture }: PostDetailsHeaderProps) => {
  const currentUser = useUserInfo();
  const isFollowingProfile = getIsCurrentUserFollowingProfile(
    currentUser,
    picture.user.id,
  );

  return (
    <div className="flex flex-col py-3 pl-3">
      <div className="flex items-center">
        <Link className="shrink-0" href={`/${picture.user.username}`}>
          <UserAvatar avatar={picture.user.avatar} width={32} />
        </Link>
        <div className="flex w-full flex-col">
          <div className="flex items-center justify-between pr-5">
            <div>
              <Link
                className="ml-4 text-sm font-semibold text-ig-primary-text"
                href={`/${picture.user.username}`}
              >
                {picture.user.first_name} {picture.user.last_name}
              </Link>
              {currentUser.id !== picture.user?.id && (
                <>
                  {" "}
                  •{" "}
                  <ButtonFollow
                    buttonProps={{
                      padding: "none",
                    }}
                    isFollowing={isFollowingProfile}
                    userProfileId={picture.user.id}
                    userProfileUsername={picture.user.username}
                  />
                </>
              )}
            </div>

            {currentUser.id === picture.user.id && (
              <PostDetailsAction picture={picture} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailsHeader;
