import { cn } from "@/lib/utils";

type SeparatorProps = {
  className?: string;
};

const Separator = ({ className }: SeparatorProps) => {
  return <hr className={cn("h-[1px] w-full", className)} />;
};

export default Separator;
