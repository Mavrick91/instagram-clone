import { ElementType } from "react";

import { cn } from "@/lib/utils";

interface IconButtonProps {
  onClick?: () => void;
  icon: ElementType;
  isActive?: boolean;
  activeColor?: string;
}

const IconButton = ({
  onClick,
  icon: Icon,
  isActive = false,
  activeColor = "text-ig-primary-text",
}: IconButtonProps) => {
  return (
    <button
      className={cn({
        "hover:!text-ig-secondary-text": !isActive,
      })}
      type="button"
      onClick={onClick}
    >
      <Icon
        className={cn("text-ig-primary-text", {
          [activeColor]: isActive,
          "hover:text-ig-secondary-text": !isActive,
        })}
        fill={isActive ? "currentColor" : "none"}
      />
    </button>
  );
};

export default IconButton;
