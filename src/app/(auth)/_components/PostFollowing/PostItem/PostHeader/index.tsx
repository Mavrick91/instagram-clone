"use client";

import { Ellipsis } from "lucide-react";
import moment from "moment";
import Link from "next/link";

import UserAvatar from "@/components/UserAvatar";
import { useModal } from "@/providers/ModalProvider";
import { UserPictureDetails } from "@/types/picture";

type Props = {
  avatar?: string | null;
  username: string;
  picture: UserPictureDetails;
};

const PostHeader = ({ avatar, username, picture }: Props) => {
  const { showModal } = useModal();

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
              </span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            return showModal("PostActionDialog", {
              picture,
            });
          }}
        >
          <Ellipsis />
        </button>
      </div>
    </>
  );
};

export default PostHeader;
