import { cn } from "@/lib/utils";
import { useUserInfo } from "@/providers/UserInfoProvider";
import { ThreadMessage } from "@/types/thread";
import { formatTimestamp } from "@/utils/date";

interface ThreadMessageItemParams {
  message: ThreadMessage;
  isFirstMessage: boolean;
  isLastMessage: boolean;
  showTimestamp: boolean;
}

export const ThreadMessageItem = ({
  message,
  isFirstMessage,
  isLastMessage,
  showTimestamp,
}: ThreadMessageItemParams) => {
  const user = useUserInfo();

  const isMessageLeftSide = message.user.id !== user.id;

  return (
    <>
      {showTimestamp && (
        <div className="my-4 self-center text-center text-xs text-ig-secondary-text">
          {formatTimestamp(message.createdAt)}
        </div>
      )}
      <div
        className={cn("my-px max-w-[70%] px-4", {
          "mr-auto": isMessageLeftSide,
          "ml-auto": !isMessageLeftSide,
        })}
      >
        <div
          className={cn("text-sm text-white max-w-xl px-3 py-2 break-words", {
            "bg-chat-outgoing-message-bubble-background-color text-ig-primary-text rounded-tr-2xl rounded-br-2xl":
              isMessageLeftSide,
            "bg-chat-incoming-message-bubble-background-color rounded-tl-2xl rounded-bl-2xl":
              !isMessageLeftSide,
            "rounded-tr-2xl": isFirstMessage && !isMessageLeftSide,
            "rounded-tl-2xl": isFirstMessage && isMessageLeftSide,
            "rounded-br-2xl": isLastMessage && !isMessageLeftSide,
            "rounded-bl-2xl": isLastMessage && isMessageLeftSide,
          })}
        >
          {message.content}
        </div>
      </div>
    </>
  );
};
