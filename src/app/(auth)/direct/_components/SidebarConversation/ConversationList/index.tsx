import { getThreads } from "@/actions/thread";
import { getCurrentUser } from "@/actions/user";

import ConversationListItem from "../ConversationListItem";

const ConversationList = async () => {
  const [threads, currentUser] = await Promise.all([
    getThreads(),
    getCurrentUser(),
  ]);

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
            threadId={thread.id}
            lastMessage={lastMessage}
            recipientUser={recipientUser}
          />
        );
      })}
    </div>
  );
};

export default ConversationList;
