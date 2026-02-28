"use client";
import React, { useCallback } from "react";
import { z } from "zod";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { Modal, ModalProps } from "@nomos-ui/common/modals";
import UpdateDataWrapper from "../data-manipulation/update-data-wrapper";

/**
 * Props for the UpdateDataModal component
 *
 * @template Input - The shape of the form values / data being submitted
 * @template Response - The shape of the API response returned after successful update
 * @template FormProps - Additional props accepted by the Form component
 */
export type UpdateDataModalProps<
  Input extends FieldValues,
  Response,
  FormProps extends Record<string, any> = Record<string, any>,
> = {
  /** ID of the record to update */
  id?: string | number;
  /** Form component rendered inside the modal */
  Form: (props: any) => React.JSX.Element;
  /**
   * The mutation hook to call for data update.
   * Pass the hook itself (e.g. useUpdateProductMutation), not its result.
   * The component will call it internally following React's rules of hooks.
   *
   * @example
   * useMutation={useUpdateProductMutation}
   */
  useMutation: () => any;
  /**
   * The query hook to fetch the existing record.
   * Pass the hook itself (e.g. useGetProductQuery), not its result.
   *
   * @example
   * useQuery={useGetProductQuery}
   */
  useQuery: (params: any, options?: any) => any;
  /** Title displayed in the modal header */
  title: string;
  /** Optional description displayed under the title */
  description?: string;
  /**
   * When true, maintains the form button loading state after submission.
   * Useful for extra processing after data update.
   */
  keepIsLoading?: boolean;
  /** Additional data passed to the form */
  requiredData?: Record<string, any>;
  /**
   * Callback executed after successful update and modal close.
   * Receives the API response, the cleaned submitted data, and the form instance.
   *
   * @param x.response - The raw API response
   * @param x.data - The cleaned data that was submitted
   * @param x.form - The react-hook-form instance typed to Input
   */
  doAfterSuccessUpdate?: (x: {
    response: Response;
    data: Input;
    form: UseFormReturn<Input>;
  }) => Promise<any> | void;
  /**
   * Optional function to transform or clean the form data before submission.
   * Defaults to an identity function (returns data as-is).
   */
  cleanDataBeforeUpdate?: (data: Input) => Input;
  /** Props that apply to Radix Dialog content wrapper */
  contentProps?: Omit<ModalProps, "children">;
  /** Zod schema for form validation */
  schema: z.ZodObject<any>;
  /** Additional props forwarded to the form */
  formProps?: FormProps;
  /** Additional parameters passed to the query hook for data fetching */
  params?: Record<string, any>;
};

/**
 * A generic modal component for updating data with form validation.
 * Wraps UpdateDataWrapper inside a Modal, handling modal close after successful update.
 *
 * @template Input - The shape of the form values / data being submitted
 * @template Response - The shape of the API response returned after successful update
 * @template FormProps - Additional props accepted by the Form component
 *
 * @example
 * ```tsx
 * <UpdateDataModal<UpdateProductInput, Product, ProductFormProps>
 *   id={productId}
 *   title="Edit Product"
 *   schema={productSchema}
 *   Form={ProductForm}
 *   useMutation={useUpdateProductMutation}
 *   useQuery={useGetProductQuery}
 *   formProps={{ buttonLabel: "Save Changes" }}
 *   isOpen={isOpen}
 *   setIsOpen={setIsOpen}
 * />
 * ```
 */
export default function UpdateDataModal<
  Input extends FieldValues,
  Response,
  FormProps extends Record<string, any> = Record<string, any>,
>({
  id,
  title,
  description,
  keepIsLoading,
  requiredData,
  schema,
  formProps,
  isOpen,
  setIsOpen,
  showConfirmButton,
  doAfterSuccessUpdate,
  cleanDataBeforeUpdate,
  contentProps,
  Form,
  useMutation,
  useQuery,
  params,
}: UpdateDataModalProps<Input, Response, FormProps> & Partial<ModalProps>) {
  /**
   * Closes the modal then fires the post-update callback if provided.
   *
   * @param x - The object received from UpdateDataWrapper's doAfterSuccessUpdate
   */
  const handleCloseModal = useCallback(
    async function handleCloseModal(x: {
      response: Response;
      data: Input;
      form: UseFormReturn<Input>;
    }) {
      setIsOpen!(false);
      await doAfterSuccessUpdate?.(x);
    },
    [doAfterSuccessUpdate, setIsOpen]
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
      <UpdateDataWrapper<Input, Response, FormProps>
        id={id}
        Form={Form}
        useMutation={useMutation}
        useQuery={useQuery}
        cleanDataBeforeUpdate={cleanDataBeforeUpdate}
        doAfterSuccessUpdate={handleCloseModal}
        params={params}
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
