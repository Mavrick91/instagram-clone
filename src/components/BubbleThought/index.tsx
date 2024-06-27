import { ChangeEvent, RefObject } from "react";
import { UseFormRegister } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";

import { cn } from "@/lib/utils";

type BubbleThoughtProps = {
  bubbleText?: string;
  size?: "small" | "medium" | "big";
  canEdit: boolean;
  register?: UseFormRegister<{ thought: string }>;
  thoughtWatch?: string;
  uniqueRef?: RefObject<HTMLDivElement>;
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

  const handleChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange && (thoughtWatch?.length ?? 0) <= 60) {
      onChange(e);
    }
  };

  const containerClasses = cn(
    "mb-[-80px] z-[60] relative",
    size === "small" && "mb-[-34px]",
  );

  const innerContainerClasses = cn(
    "min-h-[107px]",
    size === "small" && "min-h-[55px]",
  );

  const bubbleContainerClasses = cn(
    "relative min-w-[160px] max-w-[192px]",
    size === "small" && "min-w-[72px] max-w-[96px] w-max",
  );

  const bubbleClasses = cn(
    "shadow-custom text-xl flex min-h-[70px] w-fit min-w-5 break-words rounded-2xl bg-ig-bubble-background p-4",
    "after:absolute after:bottom-[-8px] after:filter-big-bubble after:left-6 after:flex after:size-5 after:rounded-full after:bg-ig-bubble-background after:shadow-custom-bubble after:content-['']",
    size === "small" &&
      "after:!filter-bubble min-h-[12px] p-2 rounded-[14px] after:bottom-[-4px] after:left-3.5 after:size-2 after:shadow-custom-bubble-small",
  );

  const textClasses = cn(
    "relative overflow-hidden text-ig-primary-text",
    size === "small" && "text-sm text-[11px] leading-[16px]",
  );

  return (
    <div ref={uniqueRef} className={containerClasses}>
      <div className={innerContainerClasses}>
        <div className={bubbleContainerClasses}>
          <div className={bubbleClasses}>
            <div className="w-fill flex min-w-[25px] items-center overflow-auto">
              <div className="flex-center w-full text-center">
                <span className={textClasses}>
                  {bubbleText && canEdit ? (
                    <TextareaAutosize
                      className="block max-w-[162px] resize-none bg-transparent placeholder:text-center placeholder:text-ig-secondary-text focus:outline-none"
                      placeholder="Share a thought..."
                      {...restRegister}
                      autoFocus
                      maxLength={60}
                      maxRows={4}
                      onChange={handleChangeInput}
                    />
                  ) : (
                    <span
                      className={cn("line-clamp-3", {
                        "text-ig-secondary-text": !bubbleText,
                        "max-w-[80px]": size === "small",
                        "max-w-[198px]": size === "medium",
                      })}
                    >
                      {bubbleText || `Note...`}
                    </span>
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
