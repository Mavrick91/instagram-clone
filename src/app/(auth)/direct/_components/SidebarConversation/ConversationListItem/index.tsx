"use client";

import { useQuery } from "@tanstack/react-query";
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
  lastMessageLoaded: ThreadMessage;
  recipientUser: ThreadUser;
};

type Params = {
  slug: string[];
};

const ConversationListItem = ({
  threadId,
  lastMessageLoaded,
  recipientUser,
}: ConversationListProps) => {
  const user = useUserInfo();
  const params = useParams() as Params;
  const { data: lastMessage } = useQuery({
    queryKey: ["thread", user.username, threadId, "lastMessage"],
    initialData: lastMessageLoaded,
  });

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
          "bg-ig-highlight-background": selectedThreadId === threadId,
          "hover:bg-ig-hover-overlay": selectedThreadId !== threadId,
        })}
      >
        <UserListItem
          avatar={recipientUser?.avatar}
          bottomText={
            <div className="flex gap-1">
              <span>{lastMessage?.user?.id === user.id ? "You: " : ""}</span>
              <span className="truncate">{lastMessage?.content}</span>
              <span> · {moment(lastMessage?.created_at).fromNow()}</span>
            </div>
          }
          topText={recipientUser.first_name}
          width={56}
        />
      </div>
    </Link>
  );
};

export default ConversationListItem;
