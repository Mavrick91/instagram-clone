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
  activeColor = "text-primary-text",
}: IconButtonProps) => {
  return (
    <button type="button" onClick={onClick} className="hover:!text-secondary">
      <Icon
        className={cn("text-primary-text", {
          [activeColor]: isActive,
          "hover:text-secondary": !isActive,
        })}
        fill={isActive ? "currentColor" : "none"}
      />
    </button>
  );
};

export default IconButton;
