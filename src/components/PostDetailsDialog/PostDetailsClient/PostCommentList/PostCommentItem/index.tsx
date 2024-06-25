import moment from "moment";
import Link from "next/link";

import UserAvatar from "@/components/UserAvatar";

type Props = {
  avatar?: string | null;
  firstName: string;
  lastName: string;
  content?: string | null;
  createdAt: Date;
  username: string;
};

const PostCommentItem = ({
  avatar,
  firstName,
  lastName,
  content,
  createdAt,
  username,
}: Props) => {
  if (!content) return null;

  return (
    <div className="flex text-primary-text">
      <div className="mr-4 shrink-0">
        <UserAvatar avatar={avatar} username={username} size="size-8" />
      </div>
      <div className="text-sm">
        <Link
          href={`/${username}`}
          className="mr-1 inline-flex align-middle font-semibold hover:opacity-50"
        >
          {firstName} {lastName}{" "}
        </Link>
        <span className="align-middle">{content}</span>
        <p className="mb-1 mt-2 text-xs text-secondary">
          <time>{moment(createdAt).fromNow()}</time>
        </p>
      </div>
    </div>
  );
};

export default PostCommentItem;
