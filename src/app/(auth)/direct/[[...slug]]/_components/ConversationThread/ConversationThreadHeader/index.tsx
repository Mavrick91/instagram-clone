import Link from "next/link";

import UserAvatar from "@/components/UserAvatar";
import { ThreadUser } from "@/types/thread";

interface ConversationThreadHeaderProps {
  recipientUser: ThreadUser;
}

const ConversationThreadHeader = ({
  recipientUser,
}: ConversationThreadHeaderProps) => {
  const { username, avatar, firstName, lastName } = recipientUser;

  return (
    <div className="flex w-full items-center justify-between border-b border-ig-separator p-4 py-3.5">
      <Link href={`/${username}`}>
        <div className="flex items-center">
          <UserAvatar avatar={avatar} width={44} />
          <span className="ml-3 font-bold text-ig-primary-text">{`${firstName} ${lastName}`}</span>
        </div>
      </Link>
    </div>
  );
};

export default ConversationThreadHeader;
