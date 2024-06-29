import { redirect } from "next/navigation";

import { getThreadById } from "@/actions/thread";
import { getCurrentUser } from "@/actions/user";

import ConversationThreadHeader from "./ConversationThreadHeader";
import ConversationThreadMessages from "./ConversationThreadMessages";

export type Props = {
  selectedThreadId: number;
};

const ConversationThread = async ({ selectedThreadId }: Props) => {
  const currentUser = await getCurrentUser();
  const thread = await getThreadById(selectedThreadId);

  const recipientUser = thread.users.find((user) => user.id !== currentUser.id);

  if (!recipientUser) {
    redirect("/direct/inbox");
  }
  return (
    <div className="flex w-full min-w-0 flex-col">
      <ConversationThreadHeader recipientUser={recipientUser} />
      <ConversationThreadMessages
        messages={thread.messages}
        recipientUser={recipientUser}
        senderId={currentUser.id}
        threadId={selectedThreadId}
      />
    </div>
  );
};
export default ConversationThread;
