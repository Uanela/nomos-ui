import React, { useCallback, useEffect, useState } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useProvider } from "@nomos-ui/core";
import { extractMutation } from "@nomos-ui/core/utils";
import QueryBoundary from "../query-boundary";

/**
 * Props for the UpdateDataWrapper component
 *
 * @template Input - The shape of the form values / data being submitted
 * @template Response - The shape of the API response returned after successful update
 * @template FormProps - Additional props accepted by the Form component
 */
type UpdateDataWrapperProps<
  Input extends FieldValues,
  Response,
  FormProps extends Record<string, any> = Record<string, any>,
> = {
  /** ID of the record to update */
  id?: string | number;
  /** Form component to render for data updating */
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
  useQuery: (params: any) => any;
  /**
   * Callback executed after successful data update.
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
   *
   * @param data - Raw form data
   * @returns Cleaned data to be submitted
   */
  cleanDataBeforeUpdate?: (data: Input) => Input;
  /** Additional parameters passed to the query hook for data fetching */
  params?: Record<string, any>;
  /** Props passed directly to the Form component */
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
 * A generic wrapper that handles data update logic independently of the query library.
 * Supports both RTK Query and TanStack Query via the provider config.
 *
 * Responsibilities:
 * - Fetches existing record via useQuery and populates form default values
 * - Calls the provided mutation hook
 * - Extracts and normalizes the trigger function based on the query library
 * - Passes all raw mutation state directly to the Form (no normalization)
 * - Handles submit orchestration: cleaning data, triggering mutation, running callbacks, resetting form
 *
 * @template Input - The shape of the form values / data being submitted
 * @template Response - The shape of the API response returned after successful update
 * @template FormProps - Additional props accepted by the Form component
 *
 * @example
 * ```tsx
 * <UpdateDataWrapper<UpdateProductInput, Product, ProductFormProps>
 *   id={productId}
 *   Form={ProductForm}
 *   useMutation={useUpdateProductMutation}
 *   useQuery={useGetProductQuery}
 *   doAfterSuccessUpdate={({ response }) => router.push(`/products`)}
 *   formProps={{
 *     buttonLabel: "Update Product",
 *     schema: productSchema,
 *   }}
 * />
 * ```
 */
export default function UpdateDataWrapper<
  Input extends FieldValues,
  Response,
  FormProps extends Record<string, any> = Record<string, any>,
>({
  id,
  Form,
  useMutation,
  useQuery,
  doAfterSuccessUpdate,
  cleanDataBeforeUpdate = (data) => data,
  formProps,
  params,
}: UpdateDataWrapperProps<Input, Response, FormProps>) {
  const { config } = useProvider();
  const mutationResult = useMutation();
  const { trigger, state } = extractMutation<Input, Response>(
    mutationResult,
    config.queryLibrary
  );

  const [fetchedData, setFetchedData] = useState<Record<string, any>>();
  const [dataForm, setDataForm] = useState<UseFormReturn>();

  useEffect(() => {
    dataForm?.reset(fetchedData);
  }, [fetchedData]);

  /**
   * Handles form submission and data update.
   * Cleans the data, triggers the mutation with id + body, runs the success callback, and resets the form.
   *
   * @param data - The validated form data
   * @param form - The react-hook-form instance
   * @param onError - Optional callback invoked with the original data and error on failure
   */
  const handleUpdateData = useCallback(
    async function (
      data: Input,
      form: UseFormReturn<Input>,
      onError?: (data: Input, error: any) => void
    ) {
      const cleanedData = cleanDataBeforeUpdate(data);
      try {
        const response = await trigger({ id, body: cleanedData } as any);
        await doAfterSuccessUpdate?.({ response, data: cleanedData, form });
        form.reset({ ...data, ...fetchedData });
        setDataForm(form as any);
        return response;
      } catch (err) {
        onError?.(data, err);
        return err;
      }
    },
    [trigger, id, fetchedData]
  );

  return (
    <QueryBoundary
      useQuery={useQuery}
      successComponentProps={{
        formProps: { ...state, ...formProps, onSubmit: handleUpdateData },
        Form,
        fetchedData,
        setFetchedData,
      }}
      SuccessComponent={SuccessComponent}
      params={{ id, ...params }}
      showReloadAgainButton={false}
    />
  );
}

/**
 * Internal component that renders the form with fetched data.
 * Sets the fetched data on mount so the form can populate default values.
 */
function SuccessComponent({
  data,
  Form,
  formProps,
  setFetchedData,
}: {
  data: any;
  Form: (props: any) => React.JSX.Element;
  formProps: any;
  fetchedData: any;
  setFetchedData: React.Dispatch<
    React.SetStateAction<Record<string, any> | undefined>
  >;
}) {
  useEffect(() => {
    setFetchedData(data.data);
  }, [data]);

  return <Form {...formProps} defaultValues={data.data} source={data.data} />;
}
