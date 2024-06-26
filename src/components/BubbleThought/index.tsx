import { UseFormRegister } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";

import { cn } from "@/lib/utils";

type BubbleThoughtProps = {
  bubbleText?: string;
  size?: "small" | "medium" | "big";
  canEdit: boolean;
  register?: UseFormRegister<{ thought: string }>;
  thoughtWatch?: string;
  uniqueRef?: React.RefObject<HTMLDivElement>;
};

const BubbleThought = ({
  size = "medium",
  bubbleText,
  canEdit,
  register,
  thoughtWatch,
  uniqueRef,
}: BubbleThoughtProps) => {
  const { onChange, ...restRegister } = register?.("thought") ?? {};

  const handleChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange && (thoughtWatch?.length ?? 0) <= 60) {
      onChange(e);
    }
  };

  const containerClasses = cn(
    "mb-[-80px] z-50 relative",
    size === "small" && "mb-[-34px]",
    size === "big" && "-left-6",
  );

  const innerContainerClasses = cn(
    "min-h-[107px]",
    size === "small" && "min-h-[55px]",
  );

  const bubbleContainerClasses = cn(
    "relative min-w-[160px] max-w-[230px]",
    size === "small" && "min-w-[72px] max-w-[96px] w-max",
  );

  const bubbleClasses = cn(
    "filter-shadow flex min-h-[70px] w-fit min-w-5 break-words rounded-2xl bg-ig-bubble-background p-4",
    "after:absolute after:bottom-[-8px] after:left-6 after:flex after:size-5 after:rounded-full after:bg-ig-bubble-background after:shadow-custom-bubble after:content-['']",
    size === "small" &&
      "min-h-[12px] p-1 px-1.5 rounded-[14px] after:bottom-[-4px] after:left-3.5 after:size-2 after:shadow-custom-bubble-small",
  );

  const textClasses = cn(
    "relative overflow-hidden text-primary-text",
    size === "small" && "text-[11px] leading-[20px]",
  );

  return (
    <div className={containerClasses} ref={uniqueRef}>
      <div className={innerContainerClasses}>
        <div className={bubbleContainerClasses}>
          <div className={bubbleClasses}>
            <div className="flex min-w-[32px] items-center overflow-auto">
              <div className="w-full">
                <span className={textClasses}>
                  {bubbleText && canEdit ? (
                    <TextareaAutosize
                      className="block min-w-max resize-none bg-transparent placeholder:text-secondary focus:outline-none"
                      placeholder="Share a thought..."
                      {...restRegister}
                      onChange={handleChangeInput}
                      autoFocus
                      maxRows={4}
                      maxLength={60}
                    />
                  ) : bubbleText ? (
                    bubbleText
                  ) : (
                    <span className="text-secondary-text">Note...</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BubbleThought;
