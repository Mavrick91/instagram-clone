import { getCurrentUser } from "@/actions/user";

import ConversationList from "./ConversationList";
import { FriendsNote } from "./FriendsNote";
import SidebarConversationHeader from "./SidebarConversationHeader";

const SidebarConversation = async () => {
  const currentUser = await getCurrentUser();
  return (
    <>
      <div className="flex h-full flex-col">
        <SidebarConversationHeader />

        <FriendsNote
          thoughtContent={currentUser.thought?.content}
          userAvatar={currentUser.avatar}
        />

        <div className="px-6 py-4 font-bold text-ig-primary-text">Messages</div>

        <ConversationList />
      </div>
    </>
  );
};

export default SidebarConversation;
