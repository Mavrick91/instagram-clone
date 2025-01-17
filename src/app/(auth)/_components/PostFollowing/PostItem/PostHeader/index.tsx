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
  const { openModal } = useModal();

  return (
    <>
      <div className="mb-3 ml-1 flex items-center justify-between text-ig-primary-text">
        <div className="flex items-center gap-1 text-system-14">
          <Link className="flex items-center gap-2" href={`/${username}`}>
            <UserAvatar avatar={avatar} width={32} />
            <p className="font-semibold">{username}</p>
          </Link>
          <span className="flex items-center gap-1 font-normal text-ig-secondary-text">
            <span> • </span>
            {moment(picture.created_at).fromNow()}
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            openModal("postActionDialog", {
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
