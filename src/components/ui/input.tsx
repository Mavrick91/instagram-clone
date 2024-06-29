import { forwardRef, InputHTMLAttributes } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="relative flex h-full grow flex-col gap-2">
        {label && <Label htmlFor={props.id}>{label}</Label>}
        <div className="h-full">
          <input
            ref={ref}
            className={cn(
              "flex items-start py-2 text-ig-primary-text w-full rounded-md border border-ig-elevated-separator bg-background px-3 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ig-secondary-text-text focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              error ? "border-red-500 focus-visible:ring-red-500" : "",
              className,
            )}
            type={type}
            {...props}
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
