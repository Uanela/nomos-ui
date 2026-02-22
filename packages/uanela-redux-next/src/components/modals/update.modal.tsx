"use client";

import React, { useCallback } from "react";
import { z } from "zod";
import { twMerge } from "tailwind-merge";
import { Modal, ModalProps } from "@nomos-ui/common/modals";
import UpdateDataWrapper from "../data-manipulation/update-data-wrapper";

/**
 * Props for the UpdateDataModal component
 * @template DataType The type of data being updated
 */
export type UpdateDataModalProps<DataType, FormProps = any> = {
  /** Optional ID for the modal */
  id?: string;
  /** Name identifier for the form/modal - used to generate API mutation name if not provided */
  name: string;
  /** Form component rendered inside the modal */
  Form: (props: any) => React.JSX.Element;
  /**
   * Redux API mutation name (e.g., 'useUpdateProductMutation')
   * If not provided, will be generated as `useUpdate${pascalCase(name)}Mutation`
   */
  updateMutation?: string;
  /** Title displayed in the modal header */
  title: string;
  /** Optional description displayed under the title */
  description?: string;
  /**
   * When true, maintains the form button loading state after submission
   * Useful for extra processing after data update
   */
  keepIsLoading?: boolean;
  /** Additional data passed to the form */
  requiredData?: Record<string, any>;
  /** Whether to show alert after success */
  showAlertAfterSuccessUpdate?: boolean;
  /**
   * Callback executed after successful update
   * Receives updated data
   */
  doAfterSuccessUpdate?: (x: any) => Promise<any> | void;
  /** Transform form data before sending to mutation */
  cleanDataBeforeUpdate?: (data: any) => void;
  /** Custom class applied to the modal container */
  className?: string;
  /** Zod schema for form validation */
  schema: z.ZodObject<any>;
  /** Buttons displayed next to the modal title */
  topButtons?: React.ReactNode;
  /** Additional props forwarded to the form */
  formProps?: FormProps;
  /** Props that apply to Radix Dialog content wrapper */
  contentProps?: Omit<ModalProps, "children">;
};

/**
 * A generic modal component for updating data with form validation.
 *
 * @template DataType The type of data being updated
 * @param props Component props combining UpdateDataModalProps and partial ModalProps
 *
 * @example
 * ```tsx
 * <UpdateDataModal<UserData>
 *   name="user"
 *   title="Edit User"
 *   schema={userSchema}
 *   Form={UserForm}
 *   isOpen={isOpen}
 *   setIsOpen={setIsOpen}
 *   formProps={{ buttonLabel: "Save Changes" }}
 * />
 * ```
 */
export default function UpdateDataModal<DataType, FormProps = any>({
  name,
  title,
  description,
  keepIsLoading,
  requiredData,
  schema,
  formProps,
  topButtons,
  isOpen,
  setIsOpen,
  showConfirmButton,
  doAfterSuccessUpdate = () => {},
  contentProps,
  ...props
}: UpdateDataModalProps<DataType, FormProps> & Partial<ModalProps>) {
  /**
   * Handles modal closure and runs post-success callback.
   * @param data Updated data
   */
  const handleCloseModal = useCallback(
    function handleCloseModal(data: any) {
      setIsOpen!(false);
      doAfterSuccessUpdate!(data);
    },
    [name]
  );

  return (
    <Modal
      title={title}
      description={description}
      setIsOpen={setIsOpen}
      isOpen={isOpen}
      showConfirmButton={showConfirmButton}
      contentProps={{
        ...contentProps,
        className: twMerge(
          contentProps?.className,
          "max-h-[80vh] md:max-h-[90vh] overflow-auto"
        ),
      }}
    >
      <UpdateDataWrapper
        {...props}
        name={name}
        doAfterSuccessUpdate={handleCloseModal}
        formProps={{
          ...(formProps as any),
          keepIsLoading,
          requiredData,
          schema,
        }}
      />
    </Modal>
  );
}
