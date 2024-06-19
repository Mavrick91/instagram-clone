"use client";

import { Ellipsis } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";

import ButtonFollow from "@/components/ButtonFollow";
import Modal from "@/components/Modal";
import PostAction from "@/components/PostDetailsDialog/PostAction";
import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import { UserPictureDetails } from "@/types/picture";

type Props = {
  avatar?: string | null;
  username: string;
  picture: UserPictureDetails;
  isFollowingCurrentProfile: boolean;
};

export default function PostHeader({
  avatar,
  username,
  picture,
  isFollowingCurrentProfile,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <div className="mb-3 ml-1 flex items-center justify-between text-primary-text">
        <div className="flex items-center">
          <UserAvatar avatar={avatar} username={username} size="size-8" />
          <div className="ml-3">
            <p className="text-sm font-semibold">
              <Link href={`/${username}`} className="shrink-0">
                <span>{username}</span>
              </Link>{" "}
              •{" "}
              <span className="text-sm font-medium text-zinc-500">
                {moment(picture.createdAt).fromNow()}
                {!isFollowingCurrentProfile && (
                  <>
                    {" "}
                    •{" "}
                    <ButtonFollow
                      isFollowing={isFollowingCurrentProfile}
                      targetUserId={picture.user.id}
                      className={cn(
                        "bg-transparent p-0 hover:bg-transparent text-blue-400 hover:text-blue-600",
                      )}
                    />
                  </>
                )}
              </span>
            </p>
          </div>
        </div>
        <button type="button" onClick={toggleModal}>
          <Ellipsis />
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={toggleModal}>
        <PostAction picture={picture} onClose={toggleModal} />
      </Modal>
    </>
  );
}
