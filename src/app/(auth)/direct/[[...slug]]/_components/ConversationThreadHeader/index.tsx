import Link from "next/link";

import UserAvatar from "@/components/UserAvatar";

interface ConversationThreadHeaderProps {
  recipientUser: any;
}

export default function ConversationThreadHeader({
  recipientUser,
}: ConversationThreadHeaderProps) {
  const { username, avatar, firstName, lastName } = recipientUser;

  return (
    <div className="flex w-full items-center justify-between border-b border-separator p-4 py-3.5">
      <Link href={`/${username}`}>
        <div className="flex items-center">
          <UserAvatar avatar={avatar} size="size-11" />
          <span className="ml-3 font-bold text-primary-text">{`${firstName} ${lastName}`}</span>
        </div>
      </Link>
    </div>
  );
}
