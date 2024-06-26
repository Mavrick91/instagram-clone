import { cn } from "@/lib/utils";

type SeparatorProps = {
  className?: string;
  ig?: boolean;
  post?: boolean;
};

const Separator = ({ className, ig, post }: SeparatorProps) => {
  return (
    <hr
      className={cn(
        "h-[1px] w-full",
        {
          "border-ig-separator": ig,
          "border-post-separator": post,
        },
        className,
      )}
    />
  );
};

export default Separator;
