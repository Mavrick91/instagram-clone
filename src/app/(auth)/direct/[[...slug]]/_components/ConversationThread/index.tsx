import { getThreadById } from "@/actions/thread";

import ConversationThreadHeader from "./ConversationThreadHeader";
import ConversationThreadMessages from "./ConversationThreadMessages";

export type Props = {
  selectedThreadId: number;
};

const ConversationThread = async ({ selectedThreadId }: Props) => {
  const thread = await getThreadById(selectedThreadId);

  const recipientUser = thread.users[0];

  return (
    <div className="flex w-full flex-col">
      <ConversationThreadHeader recipientUser={recipientUser} />
      <ConversationThreadMessages
        recipientUser={recipientUser}
        messages={thread.messages}
        threadId={selectedThreadId}
      />
    </div>
  );
};
export default ConversationThread;
