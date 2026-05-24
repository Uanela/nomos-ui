import * as PopoverPrimitive from "@radix-ui/react-popover";
import type {
  PopoverContentProps,
  PopoverProps as RadixPopoverProps,
  PopoverTriggerProps,
  PopoverAnchorProps,
} from "@radix-ui/react-popover";
import React from "react";
import { twMerge } from "tailwind-merge";

export type PopoverProps = {
  children: React.ReactNode;
  contentProps?: PopoverContentProps;
  trigger?: React.ReactNode;
  triggerProps?: PopoverTriggerProps;
  anchor?: React.ReactNode;
  anchorProps?: PopoverAnchorProps;
  showArrow?: boolean;
  arrowClassName?: string;
} & RadixPopoverProps;

export default function Popover({
  children,
  triggerProps,
  contentProps: {
    className: contentClassName,
    align = "center",
    sideOffset = 4,
    side = "bottom",
    ...remainingContentProps
  } = {},
  trigger,
  anchor,
  anchorProps,
  showArrow = false,
  arrowClassName,
  ...props
}: PopoverProps) {
  return (
    <PopoverPrimitive.Root {...props}>
      {anchor && (
        <PopoverPrimitive.Anchor {...anchorProps}>
          {anchor}
        </PopoverPrimitive.Anchor>
      )}
      <PopoverPrimitive.Trigger asChild {...triggerProps}>
        {trigger ?? <span />}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          {...remainingContentProps}
          className={twMerge(
            "z-50 w-fit bg-popover text-popover-foreground p-2 rounded-lg shadow-md border border-border",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            contentClassName
          )}
        >
          {showArrow && (
            <PopoverPrimitive.Arrow
              className={twMerge(
                "fill-popover stroke-border stroke-2 w-3 h-2",
                arrowClassName
              )}
            />
          )}
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
