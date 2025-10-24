"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderIcon } from "lucide-react";
import { cn } from "../utils/shadcn-ui/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:opacity-80 relative",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 data-[selected=true]:bg-accent dark:data-[selected=true]:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline p-0",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Render as a child component (Radix Slot pattern) */
    asChild?: boolean;
    /** Show loading spinner and disable button */
    isLoading?: boolean;
    /** Render as Next.js Link with href */
    href?: string;
    /** Mark button as selected (adds data-selected attribute) */
    selected?: boolean;
  };

export default function Button({
  className,
  variant,
  size,
  asChild = false,
  isLoading = false,
  href,
  type = "button",
  selected,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const [buttonWidth, setButtonWidth] = React.useState<number | undefined>();
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (isLoading && buttonRef.current && !buttonWidth) {
      setButtonWidth(buttonRef.current.offsetWidth);
    } else if (!isLoading && buttonWidth) {
      setButtonWidth(undefined);
    }
  }, [isLoading, buttonWidth]);

  const commonProps = {
    "data-slot": "button",
    "data-selected": selected,
    className: cn(buttonVariants({ variant, size, className })),
    style: buttonWidth ? { width: buttonWidth } : undefined,
    ref: buttonRef,
  };

  const content = isLoading ? (
    <LoaderIcon className="size-4 animate-spin" />
  ) : (
    children
  );

  if (asChild) {
    return (
      <Slot {...commonProps} {...props}>
        {content}
      </Slot>
    );
  }

  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      {...commonProps}
      {...props}
    >
      {content}
    </button>
  );
}

export { buttonVariants };

export type { ButtonProps };
