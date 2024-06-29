"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import { useWebSocket } from "@/hooks/useWebSocket";
import { ThreadMessage, ThreadUser } from "@/types/thread";

import { ThreadMessageForm } from "./threadMessageForm";
import { ThreadMessageItem } from "./ThreadMessageItem";

const TIMESTAMP_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

const shouldShowTimestamp = (
  currentMessage: ThreadMessage,
  previousMessage: ThreadMessage | undefined,
): boolean => {
  if (!previousMessage || !currentMessage) {
    return true;
  }

  const currentTimestamp = new Date(currentMessage.createdAt).getTime();
  const previousTimestamp = new Date(previousMessage.createdAt).getTime();
  const timeDifference = currentTimestamp - previousTimestamp;

  return timeDifference >= TIMESTAMP_THRESHOLD;
};

type Props = {
  messages: ThreadMessage[];
  threadId: number;
  recipientUser: ThreadUser;
  senderId: number;
};

const ConversationThreadMessages = ({
  messages,
  threadId,
  recipientUser,
  senderId,
}: Props) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [displayedMessages, setDisplayedMessages] =
    useState<ThreadMessage[]>(messages);
  const { messages: WSMessages } = useWebSocket();

  useEffect(() => {
    if (WSMessages.length > 0) {
      setDisplayedMessages((prevMessages) => [...prevMessages, ...WSMessages]);
    }
  }, [WSMessages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [displayedMessages]);

  return (
    <>
      <div
        ref={messagesEndRef}
        className="flex grow flex-col items-end overflow-y-auto"
      >
        <div className="flex flex-col items-center justify-center self-stretch py-6">
          <UserAvatar avatar={recipientUser.avatar} width={96} />
          <div className="my-4 text-xl font-bold text-ig-primary-text">
            {recipientUser.firstName} {recipientUser.lastName}
          </div>
          <Button variant="gray">
            <Link href={`/${recipientUser.username}`}>View Profile</Link>
          </Button>
        </div>

        {displayedMessages.map((message, index) => {
          const previousMessage = displayedMessages[index - 1];
          const nextMessage = displayedMessages[index + 1];
          const showTimestamp = shouldShowTimestamp(message, previousMessage);
          const willShowTimestamp = shouldShowTimestamp(nextMessage, message);

          const isFirstMessage =
            index === 0 ||
            message.user.id !== previousMessage?.user.id ||
            showTimestamp;

          const isLastMessage =
            index === displayedMessages.length - 1 ||
            message.user.id !== nextMessage?.user.id ||
            willShowTimestamp;

          return (
            <ThreadMessageItem
              key={message.id}
              isFirstMessage={isFirstMessage}
              isLastMessage={isLastMessage}
              message={message}
              showTimestamp={showTimestamp}
            />
          );
        })}
      </div>
      <ThreadMessageForm
        recipientId={recipientUser.id}
        senderId={senderId}
        threadId={threadId}
      />
    </>
  );
};

export default ConversationThreadMessages;
