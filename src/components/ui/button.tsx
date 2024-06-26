import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring focus-visible:ring-offset-2 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "text-ig-primary-button ring-ig-primary-button disabled:text-blue-2",
      },
      hover: {
        default: "hover:text-ig-link",
        none: "",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
      text: {
        default: "md:text-base text-sm",
        xs: "md:text-sm text-xs",
        sm: "text-sm",
        lg: "md:text-lg text-base",
        xl: "md:text-xl text-lg",
      },
      padding: {
        default: "md:px-5 md:py-2.5 px-4 py-2 lg:px-6 lg:py-3",
        xs: "md:px-3 md:py-1.5 px-2 py-1",
        sm: "md:px-4 md:py-2 px-3 py-1.5",
        lg: "md:px-7 md:py-3.5 px-6 py-3 lg:px-8 lg:py-4",
        xl: "md:px-10 md:py-5 px-8 py-4 lg:px-12 lg:py-6",
        none: "p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      hover: "default",
      text: "default",
      padding: "default",
      rounded: "sm",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, padding, text, rounded, loading = false, ...props },
    ref,
  ) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, rounded, text, className, padding }),
        )}
        ref={ref}
        disabled={loading}
        type="button"
        {...props}
      >
        {props.children}
        {loading ? (
          <LoadingSpinner className="ml-2 size-4 animate-spin" />
        ) : null}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
