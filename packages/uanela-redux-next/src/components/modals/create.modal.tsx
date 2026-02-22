import React, { useCallback } from "react";
import { z } from "zod";
import { twMerge } from "tailwind-merge";
import { Modal, ModalProps } from "@nomos-ui/common/modals";
import CreateDataWrapper from "../data-manipulation/create-data-wrapper";
import { UseFormReturn } from "react-hook-form";

/**
 * Props for the CreateDataModal component
 *
 * @template Input - The shape of the form values / data being submitted
 * @template Response - The shape of the API response returned after successful creation
 * @template FormProps - Additional props accepted by the Form component
 */
export type CreateDataModalProps<
  Input,
  Response,
  FormProps extends Record<string, any> = Record<string, any>,
> = {
  /** Form component to be rendered inside the modal for data creation */
  Form: (props: any) => React.JSX.Element;
  /**
   * The mutation hook to call for data creation.
   * Pass the hook itself (e.g. useCreateProductMutation), not its result.
   * The component will call it internally following React's rules of hooks.
   *
   * @example
   * useMutation={useCreateProductMutation}
   */
  useMutation: () => any;
  /** Title displayed in the modal header */
  title: string;
  /** Optional description text for the modal */
  description?: string;
  /**
   * When true, maintains the form button's loading state after submission.
   * Useful when additional processing is needed after data creation.
   */
  keepIsLoading?: boolean;
  /** Additional data to be passed to the form component */
  requiredData?: Record<string, any>;
  /**
   * Callback executed after successful data creation and modal close.
   * Receives the API response, the cleaned submitted data, and the form instance.
   *
   * @param x.response - The raw API response
   * @param x.data - The cleaned data that was submitted
   * @param x.form - The react-hook-form instance typed to Input
   */
  doAfterSuccessCreate?: (x: {
    response: Response;
    data: Input;
    form: UseFormReturn<Input extends Record<string, any> ? Input : any>;
  }) => Promise<any> | void;
  /** Function to transform form data before submission */
  cleanDataBeforeCreate?: (data: Input) => Promise<Input>;
  /** Props for the modal dialog content */
  contentProps?: Omit<ModalProps, "children">;
  /** Zod schema for form validation */
  schema: z.ZodObject<any>;
  /** Props specific to the form component */
  formProps?: FormProps;
};

/**
 * A generic modal component for creating data with form validation.
 * Wraps CreateDataWrapper inside a Modal, handling modal close after successful creation.
 *
 * @template Input - The shape of the form values / data being submitted
 * @template Response - The shape of the API response returned after successful creation
 * @template FormProps - Additional props accepted by the Form component
 *
 * @example
 * ```tsx
 * <CreateDataModal<CreateProductInput, Product, ProductFormProps>
 *   title="Create New Product"
 *   schema={productSchema}
 *   Form={ProductForm}
 *   useMutation={useCreateProductMutation}
 *   formProps={{ buttonLabel: "Create Product" }}
 *   isOpen={isOpen}
 *   setIsOpen={setIsOpen}
 * />
 * ```
 */
export default function CreateDataModal<
  Input,
  Response,
  FormProps extends Record<string, any> = Record<string, any>,
>({
  title,
  description,
  keepIsLoading,
  requiredData,
  schema,
  formProps,
  isOpen,
  setIsOpen,
  showConfirmButton,
  doAfterSuccessCreate,
  cleanDataBeforeCreate,
  contentProps,
  Form,
  useMutation,
}: CreateDataModalProps<Input, Response, FormProps> & Partial<ModalProps>) {
  /**
   * Closes the modal then fires the post-creation callback if provided.
   *
   * @param x - The object received from CreateDataWrapper's doAfterSuccessCreate
   */
  const handleCloseModal = useCallback(
    async function handleCloseModal(x: {
      response: Response;
      data: Input;
      form: UseFormReturn<Input extends Record<string, any> ? Input : any>;
    }) {
      setIsOpen!(false);
      await doAfterSuccessCreate?.(x);
    },
    [doAfterSuccessCreate, setIsOpen]
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
      <CreateDataWrapper<Input, Response, FormProps>
        Form={Form}
        useMutation={useMutation}
        cleanDataBeforeCreate={cleanDataBeforeCreate}
        doAfterSuccessCreate={handleCloseModal}
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
