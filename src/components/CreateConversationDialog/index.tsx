import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  useCreateThreadMutation,
  useGetUsersByUsernameQuery,
} from "@/__generated__/graphql";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator.tsx";
import UserListItem from "@/components/UserListItem";
import { useUserInfo } from "@/providers/UserInfoProvider";

import UserAvatar from "../UserAvatar";

type Props = {
  onClose: () => void;
};

export default function CreateConversationDialog({ onClose }: Props) {
  const user = useUserInfo();
  const [isOpen, setIsOpen] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [debouncedInputValue, setDebouncedInputValue] = useState("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [createThread] = useCreateThreadMutation();
  const navigate = useNavigate();

  const { data } = useGetUsersByUsernameQuery({
    variables: {
      username: debouncedInputValue,
    },
    skip: !debouncedInputValue,
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

  const handleCloseModal = () => {
    onClose();
    setIsOpen(false);
  };

  const handleStartConversation = async (recipientId: number) => {
    const response = await createThread({
      variables: {
        createThreadInput: {
          userIds: [user.id, recipientId],
        },
      },
    });

    if (response.data?.createThread) {
      handleCloseModal();
      navigate(`/direct/t/${response.data.createThread.id}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="flex flex-col gap-0 p-0">
        <div className="flex justify-center px-4 py-3.5">
          <h3 className="font-bold">New message</h3>
        </div>
        <Separator elevated />
        <div className="flex h-9 items-center px-4">
          <span className="font-bold">To:</span>
          <div className="px-4 py-1">
            <input
              type="text"
              placeholder="Search..."
              className="grow bg-transparent focus:outline-none"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        </div>
        <Separator elevated />
        <div className="h-96 overflow-y-auto py-3">
          {!data ? (
            <div className="px-6 text-sm text-secondary">No account found.</div>
          ) : (
            data.usersByUsername.map((user) => (
              <button
                key={user.id}
                className="w-full hover:bg-hover-overlay"
                onClick={() => handleStartConversation(user.id)}
              >
                <UserListItem
                  subText={user.username}
                  firstName={user.firstName}
                  lastName={user.lastName}
                  avatar={user.avatar}
                  subTextSize="sm"
                />
              </button>
            ))
          )}
        </div>
        <div className="p-6">
          <Button className="w-full">Chat</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
