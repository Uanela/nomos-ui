import { type ReactElement } from "react";
import Modal, { ModalProps } from "../modal";
import Button, { ButtonProps } from "../button";
import { twMerge } from "tailwind-merge";

export type ConfirmModalButtonProps = {
  children?: React.ReactNode;
  className?: string;
  variant?: ButtonProps["variant"];
};

export default function ConfirmModal({
  setIsOpen,
  onConfirm,
  confirmButtonProps,
  contentProps,
  ...props
}: Omit<ModalProps, "children"> &
  Pick<ModalProps, "title"> & {
    onConfirm: () => void;
    confirmButtonProps?: ConfirmModalButtonProps;
  }): ReactElement {
  return (
    <Modal
      {...props}
      contentProps={{
        ...contentProps,
        className: twMerge("top-[30%]", contentProps?.className),
      }}
    >
      <div className="flex gap-2 md:flex-row flex-col items-center justify-center md:justify-end mt-8">
        <Button
          onClick={() => {
            onConfirm();
            setIsOpen?.(false);
          }}
          variant={confirmButtonProps?.variant || "outline"}
          className={confirmButtonProps?.className}
        >
          {confirmButtonProps?.children || "Confirmar"}
        </Button>
      </div>
    </Modal>
  );
}
