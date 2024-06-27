"use client";

import moment from "moment";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

import UserListItem from "@/components/UserListItem";
import { cn } from "@/lib/utils";
import { useUserInfo } from "@/providers/UserInfoProvider";
import { ThreadMessage, ThreadUser } from "@/types/thread";

type ConversationListProps = {
  threadId?: number;
  lastMessage: ThreadMessage;
  recipientUser: ThreadUser;
};

type Params = {
  slug: string[];
};

const ConversationListItem = ({
  threadId,
  lastMessage,
  recipientUser,
}: ConversationListProps) => {
  const user = useUserInfo();
  const params = useParams() as Params;

  const selectedThreadId = useMemo(() => {
    if (typeof params === "object" && params !== null) {
      const slugValue = params.slug[1];
      return parseInt(slugValue, 10);
    }
    return NaN;
  }, [params]);

  return (
    <Link href={`/direct/inbox/${threadId}`}>
      <div
        className={cn("px-6 py-2", {
          "bg-highlight-background": selectedThreadId === threadId,
          "hover:bg-hover-overlay": selectedThreadId !== threadId,
        })}
      >
        <UserListItem
          avatar={recipientUser?.avatar}
          bottomText={
            <>
              <span>{lastMessage?.user?.id === user.id ? "You: " : ""}</span>
              <span className="max-w-52 truncate">{lastMessage?.content}</span>
              <span> · {moment(lastMessage?.createdAt).fromNow()}</span>
            </>
          }
          topText={recipientUser.firstName}
          width={56}
        />
      </div>
    </Link>
  );
};

export default ConversationListItem;
