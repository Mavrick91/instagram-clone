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

export function ThreadMessageItem({
  message,
  isFirstMessage,
  isLastMessage,
  showTimestamp,
}: ThreadMessageItemParams) {
  const user = useUserInfo();

  const isMessageLeftSide = message.user.id !== user.id;

  return (
    <>
      {showTimestamp && (
        <div className="my-4 mt-auto self-center text-center text-xs text-secondary">
          {formatTimestamp(message.createdAt)}
        </div>
      )}
      <div
        className={cn("my-px px-4", {
          "mr-auto": isMessageLeftSide,
          "ml-auto": !isMessageLeftSide,
        })}
      >
        <div
          className={cn("text-sm text-white max-w-xl px-3 py-2", {
            "bg-secondary-button-background text-primary-text rounded-tr-2xl rounded-br-2xl":
              isMessageLeftSide,
            "bg-[#3797f0] rounded-tl-2xl rounded-bl-2xl": !isMessageLeftSide,
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
}
