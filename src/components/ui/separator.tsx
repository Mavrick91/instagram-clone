import { cn } from "@/lib/utils";

type SeparatorProps = {
  className?: string;
  ig?: boolean;
  post?: boolean;
  elevated?: boolean;
};

const Separator = ({ className, ig, post, elevated }: SeparatorProps) => {
  return (
    <hr
      className={cn(
        "h-[1px] w-full",
        {
          "border-ig-separator": ig,
          "border-post-separator": post,
          "border-ig-elevated-separator": elevated,
        },
        className,
      )}
    />
  );
};

export default Separator;
