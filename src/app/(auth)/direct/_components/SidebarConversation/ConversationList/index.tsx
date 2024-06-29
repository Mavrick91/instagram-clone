"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { getThreads } from "@/actions/thread";
import { useUserInfo } from "@/providers/UserInfoProvider";

import ConversationListItem from "../ConversationListItem";

export const dynamic = "force-dynamic";

const ConversationList = () => {
  const currentUser = useUserInfo();
  const { data: threads } = useSuspenseQuery({
    queryKey: ["threads", "currentUser"],
    queryFn: () => getThreads(),
    staleTime: 0,
  });

  return (
    <div>
      {threads.map((thread) => {
        const recipientUser = thread.users.find((u) => {
          return u.id !== currentUser.id;
        });

        if (!recipientUser) return null;

        const lastMessage = thread.messages[thread.messages.length - 1];
        return (
          <ConversationListItem
            key={thread.id}
            lastMessageLoaded={lastMessage}
            recipientUser={recipientUser}
            threadId={thread.id}
          />
        );
      })}
    </div>
  );
};

export default ConversationList;
