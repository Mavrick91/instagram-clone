import { forwardRef, TextareaHTMLAttributes } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="relative flex flex-col gap-2">
        {label && <Label htmlFor={props.id}>{label}</Label>}

        <textarea
          ref={ref}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-[#323539] outline-none bg-ig-primary-background px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
