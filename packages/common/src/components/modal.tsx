import Button from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./shadcn-ui/dialog";
import { twMerge } from "tailwind-merge";
import React from "react";
import {
  DialogContentProps,
  DialogProps,
  DialogTriggerProps,
} from "@radix-ui/react-dialog";

export type ModalProps = {
  trigger?: React.ReactElement;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  description?: string;
  children: React.ReactNode;
  contentProps?: DialogContentProps;
  triggerProps?: DialogTriggerProps;
  showConfirmButton?: boolean;
} & DialogProps;

export default function Modal({
  trigger,
  isOpen,
  setIsOpen,
  title = "",
  description = "",
  children,
  contentProps,
  triggerProps,
  showConfirmButton,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && (
        <DialogTrigger
          {...triggerProps}
          className={twMerge("", triggerProps?.className)}
        >
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent
        {...contentProps}
        className={twMerge(
          "p-2 sm:p-3 md:p-4 pt-3 rounded-lg md:max-h-[90vh] max-h-[95vh] overflow-auto",
          contentProps?.className
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>{children}</div>
        {showConfirmButton && (
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
