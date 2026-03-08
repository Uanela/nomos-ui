import { type ReactElement } from "react";
import { Button } from "@nomos-ui/common";
import { Modal, ModalProps } from "@nomos-ui/common/modals";

export default function ConfirmDeleteModal({
  setIsOpen,
  onChoose,
  ...props
}: Omit<ModalProps, "children"> & {
  onChoose: (choice: boolean) => void;
}): ReactElement {
  return (
    <Modal
      title={"Tem Certeza?"}
      description="Tem Certeza Que Pretende Deletar?"
      {...props}
      contentProps={{ className: "top-[30%]" }}
    >
      <div className="flex gap-2 md:flex-row flex-col items-center justify-center md:justify-end mt-8">
        <Button
          onClick={() => {
            onChoose(false);
            setIsOpen?.(false);
          }}
          variant="outline"
        >
          Cancelar
        </Button>
        <Button
          onClick={() => {
            onChoose(true);
            setIsOpen?.(false);
          }}
          variant="destructive"
        >
          Confirmar
        </Button>
      </div>
    </Modal>
  );
}
