import Link from "next/link";

import { getPictureDetails } from "@/actions/picture";
import PictureCommentList from "@/components/PostDetailsDialog/PostCommentList";
import {
  revalidateAuth,
  revalidateUserProfilePage,
} from "@/constants/revalidate";
import { getIsCurrentUserFollowingProfile } from "@/utils/user";

import ButtonFollow from "../ButtonFollow";
import ImageClient from "../ImageClient";
import Separator from "../ui/separator";
import UserAvatar from "../UserAvatar";

export type PostDetailsDialogProps = {
  pictureId: number;
};

async function PostDetailsDialog({ pictureId }: PostDetailsDialogProps) {
  const picture = await getPictureDetails(pictureId);

  const isFollowingProfile = getIsCurrentUserFollowingProfile(
    picture.currentUser,
    picture.user.id,
  );

  return (
    <div className="flex">
      <div className="flex min-h-[500px] items-center justify-center">
        <div
          className="relative aspect-[1440/1607] max-h-[665px] max-w-[596px] basis-[595.893px]"
          style={{
            width: "calc(100dvw - 460px)",
            height: "calc(100vh - 40px)",
          }}
        >
          <ImageClient
            fill
            src={picture.sizes.original}
            alt={picture.altText || "Post image"}
          />
        </div>
      </div>
      <div className="flex min-w-[405px] max-w-[500px] shrink-0 flex-col border-l border-separator bg-primary-background">
        <div className="flex flex-col pl-3 pt-3">
          <div className="flex items-center">
            <Link className="shrink-0" href={`/${picture.user.username}`}>
              <UserAvatar
                avatar={picture.user.avatar}
                username={picture.user.username}
                size="size-8"
              />
            </Link>
            <div className="flex w-full flex-col">
              <div className="flex items-center justify-between pr-5">
                <div>
                  <Link
                    href={`/${picture.user.username}`}
                    className="ml-4 text-sm font-semibold text-primary-text"
                  >
                    {picture.user.firstName} {picture.user.lastName}
                  </Link>
                  {picture.currentUser.id !== picture.user?.id && (
                    <>
                      {" "}
                      •{" "}
                      <ButtonFollow
                        revalidateOptions={revalidateAuth}
                        isFollowing={isFollowingProfile}
                        targetUserId={picture.user.id}
                        buttonProps={{
                          variant: "ghost",
                        }}
                      />
                    </>
                  )}
                </div>
                {picture.currentUser.id &&
                  picture.currentUser.id === picture.user?.id && (
                    <PostAction picture={picture}>
                      <Ellipsis className="text-primary-text" />
                    </PostAction>
                  )}
              </div>
            </div>
          </div>
        </div>
        <Separator className="mt-4" />

        <PictureCommentList picture={picture} />
      </div>
    </div>
  );
}

export default PostDetailsDialog;
