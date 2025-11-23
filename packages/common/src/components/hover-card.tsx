import {
  HoverCard as RadixHoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
  HoverCardContentProps,
  HoverCardProps as RadixHoverCardProps,
  HoverCardTriggerProps,
} from "@radix-ui/react-hover-card";
import React from "react";
import { twMerge } from "tailwind-merge";

export type HoverCardProps = {
  children: React.ReactNode;
  contentContainerProps?: HoverCardContentProps;
  trigger?: React.ReactNode;
  showArrow?: boolean;
  arrowClassName?: string;
  triggerProps?: HoverCardTriggerProps;
} & RadixHoverCardProps;

export default function HoverCard({
  children,
  triggerProps,
  contentContainerProps: {
    className: contentContainerClassName,
    align = "center",
    ...remainingContentContainerProps
  } = { className: "" },
  trigger,
  showArrow = true,
  arrowClassName,
  ...props
}: HoverCardProps) {
  // Arrow positioning based on align prop
  const getArrowClasses = (align: "start" | "center" | "end") => {
    switch (align) {
      case "start":
        return "ml-4"; // Position arrow towards the left
      case "end":
        return "mr-4"; // Position arrow towards the right
      case "center":
      default:
        return ""; // Default center positioning
    }
  };

  return (
    <RadixHoverCard {...props} openDelay={200}>
      <HoverCardTrigger {...triggerProps}>{trigger}</HoverCardTrigger>
      <HoverCardContent
        {...remainingContentContainerProps}
        align={align}
        className={twMerge(
          "bg-white h-fit mt-0 w-[350px] text-zinc-800 p-4 rounded-md shadow-lg shadow-zinc-900/30 border",
          contentContainerClassName
        )}
      >
        {showArrow && (
          <HoverCardArrow
            className={twMerge(
              "fill-white stroke-zinc-00 stroke-2 size-2 w-3",
              getArrowClasses(align),
              arrowClassName
            )}
          />
        )}
        {children}
      </HoverCardContent>
    </RadixHoverCard>
  );
}
