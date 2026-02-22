"use client";

import React, { useCallback } from "react";
import { z } from "zod";
import { twMerge } from "tailwind-merge";
import { Modal, ModalProps } from "@nomos-ui/common/modals";
import CreateDataWrapper from "../data-manipulation/create-data-wrapper";

/**
 * Props for the CreateDataModal component
 * @template DataType The type of data being created
 */
export type CreateDataModalProps<T, FormProps = any> = {
  /** Optional ID for the modal */
  id?: string;
  /** Name identifier for the form/modal - used to generate API mutation name if not provided */
  name: string;
  /** Form component to be rendered inside the modal for data creation */
  Form: (props: any) => React.JSX.Element;
  /**
   * Redux API mutation name (e.g., 'useCreateProductMutation')
   * If not provided, will be generated as `useCreate${pascalCase(name)}Mutation`
   */
  createMutation?: string;
  /** Title displayed in the modal header */
  title: string;
  /** Optional description text for the modal */
  description?: string;
  /**
   * When true, maintains the form button's loading state after submission
   * Useful when additional processing is needed after data creation
   */
  keepIsLoading?: boolean;
  /** Additional data to be passed to the form component */
  requiredData?: Record<string, any>;
  /** Flag to show alert after successful creation */
  showAlertAfterSuccessCreate?: boolean;
  /**
   * Callback function executed after successful data creation
   * Receives the created data and can perform additional operations
   */
  doAfterSuccessCreate?: (x: any) => Promise<any> | void;
  /** Function to transform form data before submission */
  cleanDataBeforeCreate?: (data: any) => void;
  /** CSS class name for the modal */
  className?: string;
  /** Props for the modal dialog content */
  contentProps?: Omit<ModalProps, "children">;
  /** Zod schema for form validation */
  schema: z.ZodObject<any>;
  /** Buttons to be displayed in the top-right corner of the modal, next to the title */
  topButtons?: React.ReactNode;
  /** Props specific to the form component */
  // formProps?: Partial<FormBaseProps<T>> & FormProps;
  formProps?: FormProps;
};

/**
 * A generic modal component for creating data with form validation
 * @template DataType The type of data being created
 * @param props Component props combining CreateDataModalProps and partial ModalProps
 * @returns A Modal component containing a form for data creation
 *
 * @example
 * ```tsx
 * <CreateDataModal<UserData>
 *   name="user"
 *   title="Create New User"
 *   schema={userSchema}
 *   formProps={{ buttonLabel: "Create User" }}
 *   Form={UserForm}
 *   isOpen={isOpen}
 *   setIsOpen={setIsOpen}
 * />
 * ```
 */
export default function CreateDataModal<DataType, FormProps = any>({
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
  doAfterSuccessCreate = () => {},
  contentProps,
  ...props
}: CreateDataModalProps<DataType, FormProps> & Partial<ModalProps>) {
  /**
   * Handles modal closure and executes post-creation callback
   * @param data The created data
   */
  const handleCloseModal = useCallback(
    function handleCloseModal(data: any) {
      setIsOpen!(false);
      doAfterSuccessCreate!(data);
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
      <CreateDataWrapper
        {...props}
        name={name}
        doAfterSuccessCreate={handleCloseModal}
        formProps={{
          ...(formProps as any),
          keepIsLoading: keepIsLoading,
          requiredData: requiredData,
          schema: schema,
        }}
      />
    </Modal>
  );
}
