"use client";

import { BookmarkIcon, HeartIcon, MessageCircle, SendIcon } from "lucide-react";

import usePostCTA from "@/hooks/usePostCTA";

import IconButton from "./IconButton";
import LikeCounter from "./LikeCounter";

type PostCTAProps = {
  showMessageIcon?: boolean;
  pictureId: number;
  collectionId?: number;
};

const PostCTA = ({ pictureId, showMessageIcon = true }: PostCTAProps) => {
  const {
    isLiked,
    isSaved,
    handleToggleLike,
    handleToggleCollection,
    showPostDetails,
    likeCounterProps,
  } = usePostCTA(pictureId);

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex gap-4 py-2">
          <IconButton
            onClick={handleToggleLike}
            icon={HeartIcon}
            isActive={isLiked}
            activeColor="text-destructive"
          />
          {showMessageIcon && (
            <IconButton onClick={showPostDetails} icon={MessageCircle} />
          )}
          <IconButton icon={SendIcon} />
        </div>
        <IconButton
          onClick={handleToggleCollection}
          icon={BookmarkIcon}
          isActive={isSaved}
        />
      </div>
      <LikeCounter {...likeCounterProps} />
    </>
  );
};

export default PostCTA;
