import { useDebouncedValue } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { getOrCreateThread } from "@/actions/thread";
import { getUserByUsername } from "@/actions/user";
import Separator from "@/components/ui/separator";
import UserListItem from "@/components/UserListItem";
import { useModal } from "@/providers/ModalProvider";
import { useUserInfo } from "@/providers/UserInfoProvider";

const CreateConversationDialog = () => {
  const user = useUserInfo();
  const { closeModal } = useModal();

  const [inputValue, setInputValue] = useState("");
  const [debounced] = useDebouncedValue(inputValue, 400);
  const router = useRouter();

  const { data: users } = useQuery({
    queryKey: ["usersByUsername", debounced],
    queryFn: async () => {
      return getUserByUsername(debounced);
    },
    enabled: !!debounced,
  });

  const handleStartConversation = async (recipientId: number) => {
    try {
      const thread = await getOrCreateThread([user.id, recipientId]);
      router.push(`/direct/inbox/${thread.id}`);
      closeModal("createConversationDialog");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex w-screen max-w-xl flex-col gap-0 p-0">
      <div className="flex justify-center px-4 py-3.5">
        <h3 className="font-bold">New message</h3>
      </div>
      <Separator />
      <div className="flex h-9 items-center px-4">
        <span className="font-bold">To:</span>
        <div className="px-4 py-1">
          <input
            className="grow bg-transparent focus:outline-none"
            placeholder="Search..."
            type="text"
            value={inputValue}
            onChange={(e) => {
              return setInputValue(e.target.value);
            }}
          />
        </div>
      </div>
      <Separator />
      <div className="h-96 overflow-y-auto py-3">
        {!users || !users.length ? (
          <div className="px-6 text-sm text-ig-secondary-text">
            No account found.
          </div>
        ) : (
          users.map((user) => {
            return (
              <button
                key={user.id}
                className="w-full hover:bg-ig-hover-overlay"
                onClick={() => {
                  return handleStartConversation(user.id);
                }}
              >
                <div className="px-4 py-2">
                  <UserListItem
                    avatar={user.avatar}
                    bottomText={user.username}
                    topText={user.firstName}
                    width={44}
                  />
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CreateConversationDialog;
