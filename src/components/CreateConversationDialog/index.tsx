import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { createThread } from "@/actions/thread";
import { getUserByUsername } from "@/actions/user";
import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/separator";
import UserListItem from "@/components/UserListItem";
import { useModal } from "@/providers/ModalProvider";
import { useUserInfo } from "@/providers/UserInfoProvider";

const CreateConversationDialog = () => {
  const user = useUserInfo();
  const { closeModal } = useModal();

  const [inputValue, setInputValue] = useState("");
  const [debouncedInputValue, setDebouncedInputValue] = useState("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const { data: users } = useQuery({
    queryKey: ["usersByUsername"],
    queryFn: async () => {
      return getUserByUsername(debouncedInputValue);
    },
    enabled: !!debouncedInputValue,
  });

  useEffect(() => {
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedInputValue(inputValue);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputValue]);

  const handleStartConversation = async (recipientId: number) => {
    try {
      const newThread = await createThread([user.id, recipientId]);
      setDebouncedInputValue("");
      router.push(`/direct/inbox/${newThread.id}`);
      closeModal();
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
            type="text"
            placeholder="Search..."
            className="grow bg-transparent focus:outline-none"
            value={inputValue}
            onChange={(e) => {
              return setInputValue(e.target.value);
            }}
          />
        </div>
      </div>
      <Separator />
      <div className="h-96 overflow-y-auto py-3">
        {!users ? (
          <div className="px-6 text-sm text-secondary">No account found.</div>
        ) : (
          users.map((user) => {
            return (
              <button
                key={user.id}
                className="w-full hover:bg-hover-overlay"
                onClick={() => {
                  return handleStartConversation(user.id);
                }}
              >
                <div className="px-4 py-2">
                  <UserListItem
                    subText={user.username}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    avatar={user.avatar}
                    subTextSize="sm"
                  />
                </div>
              </button>
            );
          })
        )}
      </div>
      <div className="p-6">
        <Button className="w-full">Chat</Button>
      </div>
    </div>
  );
};

export default CreateConversationDialog;
