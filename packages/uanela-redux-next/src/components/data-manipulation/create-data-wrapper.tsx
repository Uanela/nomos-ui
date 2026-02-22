import { useProvider } from "@nomos-ui/core";
import { extractMutation } from "@nomos-ui/core/utils";
import React, { useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

/**
 * Props for the CreateDataWrapper component
 *
 * @template Input - The shape of the form values / data being submitted
 * @template Response - The shape of the API response returned after successful creation
 * @template FormProps - Additional props accepted by the Form component
 */
type CreateDataWrapperProps<
  Input,
  Response,
  FormProps extends Record<string, any> = Record<string, any>,
> = {
  /**
   * The form component to render.
   * Receives all mutation state from the library (e.g. isLoading, isPending, error),
   * formProps, and the onSubmit handler.
   */
  Form: (
    props: FormProps & { onSubmit: any } & Record<string, any>
  ) => React.JSX.Element;
  /**
   * The mutation hook to call for data creation.
   * Pass the hook itself (e.g. useCreateProductMutation), not its result.
   * The component will call it internally following React's rules of hooks.
   *
   * @example
   * useMutation={useCreateProductMutation}
   */
  useMutation: () => any;
  /**
   * Callback executed after a successful creation.
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
  /**
   * Optional function to transform or clean the form data before submission.
   * Defaults to an identity function (returns data as-is).
   *
   * @param data - Raw form data
   * @returns Cleaned data to be submitted
   */
  cleanDataBeforeCreate?: (data: Input) => Promise<Input>;
  /**
   * Props passed directly to the Form component.
   */
  formProps: FormProps & {
    /** Label for the form's submit button */
    buttonLabel: string;
    /** Optional CSS class name for the form */
    className?: string;
    /** If true, keeps the loading state active after submission */
    keepIsLoading?: boolean;
    /** Additional data required by the form (e.g. select options, related records) */
    requiredData?: Record<string, any>;
    /** Zod schema used for form validation */
    schema: z.ZodObject<any>;
  };
};

/**
 * A generic wrapper that handles data creation logic independently of the query library.
 * Supports both RTK Query and TanStack Query via the provider config.
 *
 * Responsibilities:
 * - Calls the provided mutation hook
 * - Extracts and normalizes the trigger function based on the query library
 * - Passes all raw mutation state directly to the Form (no normalization)
 * - Handles submit orchestration: cleaning data, triggering mutation, running callbacks, resetting form
 *
 * The Form component receives everything the mutation hook provides plus `onSubmit`.
 *
 * @template Input - The shape of the form values / data being submitted
 * @template Response - The shape of the API response returned after successful creation
 * @template FormProps - Additional props accepted by the Form component
 *
 * @example
 * ```tsx
 * <CreateDataWrapper<CreateProductInput, Product, ProductFormProps>
 *   Form={ProductForm}
 *   useMutation={useCreateProductMutation}
 *   doAfterSuccessCreate={({ response }) => router.push(`/products/${response.id}`)}
 *   formProps={{
 *     buttonLabel: "Create Product",
 *     schema: productSchema,
 *   }}
 * />
 * ```
 */
export default function CreateDataWrapper<
  Input,
  Response,
  FormProps extends Record<string, any> = Record<string, any>,
>({
  Form,
  useMutation,
  doAfterSuccessCreate,
  cleanDataBeforeCreate = async (data) => data,
  formProps,
}: CreateDataWrapperProps<Input, Response, FormProps>) {
  const { config } = useProvider();
  const mutationResult = useMutation();

  const { trigger, state } = extractMutation<Input, Response>(
    mutationResult,
    config.queryLibrary
  );

  /**
   * Handles form submission.
   * Cleans the data, triggers the mutation, runs the success callback, and resets the form.
   * Calls onError if provided and the mutation fails.
   *
   * @param data - The validated form data
   * @param form - The react-hook-form instance typed to Input
   * @param onError - Optional callback invoked with the original data and error on failure
   */
  const handleCreateData = useCallback(
    async function (
      data: Input,
      form: UseFormReturn<Input extends Record<string, any> ? Input : any>,
      onError?: (data: Input, error: any) => void
    ) {
      const cleanedData = await cleanDataBeforeCreate(data);
      try {
        const response = await trigger(cleanedData);
        await doAfterSuccessCreate?.({ response, data: cleanedData, form });
        form.reset();
        return response;
      } catch (err) {
        onError?.(data, err);
        return err;
      }
    },
    [trigger]
  );

  return <Form {...state} {...formProps} onSubmit={handleCreateData} />;
}
