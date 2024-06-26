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
      <div className="mb-3 ml-1 flex items-center justify-between text-ig-primary-text">
        <div className="flex items-center gap-1 text-system-14">
          <Link href={`/${username}`} className="flex items-center gap-2">
            <UserAvatar avatar={avatar} width={32} />
            <p className="font-semibold">{username}</p>
          </Link>
          <span className="flex items-center gap-1 font-normal text-ig-secondary-text">
            <span> • </span>
            {moment(picture.createdAt).fromNow()}
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            showModal("PostActionDialog", {
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
