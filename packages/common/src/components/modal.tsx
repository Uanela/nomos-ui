import { Button } from "@nomos-ui/form";
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

export type ModalProps = {
  trigger?: React.ReactElement;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  description?: string;
  children: React.ReactNode;
  dialogContentClassName?: string;
  dialogTriggerClassName?: string;
  showConfirmButton?: boolean;
};

export default function Modal({
  trigger,
  isOpen,
  setIsOpen,
  title = "",
  description = "",
  children,
  dialogContentClassName,
  dialogTriggerClassName,
  showConfirmButton,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && (
        <DialogTrigger asChild className={twMerge("", dialogTriggerClassName)}>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent
        className={twMerge(
          "sm:max-w-[425px] p-2 sm:p-4 md:p-6 pt-6 max-w-[95%] rounded-md md:max-h-[90vh] max-h-[95vh] overflow-auto",
          dialogContentClassName
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">{children}</div>
        {showConfirmButton && (
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
