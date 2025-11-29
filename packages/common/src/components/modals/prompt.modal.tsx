import { type ReactElement } from "react";
import Modal, { ModalProps } from "../modal";
import Button, { ButtonProps } from "../button";
import { twMerge } from "tailwind-merge";

export type PromptModalButtonProps = {
  children?: React.ReactNode;
  className?: string;
  variant?: ButtonProps["variant"];
};

export default function PromptModal({
  setIsOpen,
  onChoose,
  cancelButtonProps,
  confirmButtonProps,
  contentProps,
  ...props
}: Omit<ModalProps, "children"> &
  Pick<ModalProps, "title"> & {
    onChoose: (choice: boolean) => void;
    cancelButtonProps?: PromptModalButtonProps;
    confirmButtonProps?: PromptModalButtonProps;
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
            onChoose(false);
            setIsOpen?.(false);
          }}
          variant={cancelButtonProps?.variant || "outline"}
          className={cancelButtonProps?.className}
        >
          {cancelButtonProps?.children || "Cancelar"}
        </Button>
        <Button
          onClick={() => {
            onChoose(true);
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
