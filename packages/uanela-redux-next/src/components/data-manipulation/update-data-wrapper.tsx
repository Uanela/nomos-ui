import { camelCase, pascalCase } from "change-case-all";
import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useApi } from "../api-provider";
import QueryBoundary from "../query-boundary";

/**
 * Props for the form component rendered by UpdateDataWrapper
 */
type FormComponentProps = {
  /** Initial values for the form fields */
  defaultValues?: any;
  /** Form submission handler */
  onSubmit: (data: any, form: UseFormReturn) => void;
  /** Label for the submit button */
  buttonLabel: string;
  /** Optional CSS class name */
  className?: string;
  /** Loading state for the form */
  isLoading?: boolean;
  /** Zod schema for form validation */
  schema: z.ZodObject<any>
};

/**
 * Props for the UpdateDataWrapper
 */
type UpdateDataWrapperProps = {
  /** ID of the record to update */
  id?: string | number;
  /** Name identifier used to generate API mutation name if not provided */
  name: string;
  /** Form component to render for data updating */
  Form: (props: FormComponentProps) => React.JSX.Element;
  /**
   * Redux API mutation name (e.g., 'useUpdateProductMutation')
   * If not provided, will be generated as `useUpdate${pascalCase(name)}Mutation`
   */
  updateMutation?: string;
  /** Flag to show alert after successful update */
  showAlertAfterSuccessUpdate?: boolean;
  /** Callback function executed after successful data update */
  doAfterSuccessUpdate?: (x: {
    response: any;
    data: any;
    form: UseFormReturn;
  }) => Promise<any> | void;
  /** Function to transform form data before submission */
  cleanDataBeforeUpdate?: (data: any) => void;
  /** CSS class name for the component */
  className?: string;
  /** Buttons to be displayed in the top-right corner */
  topButtons?: React.ReactNode;
  /** Props specific to the form component */
  formProps: {
    /** Label for the form's submit button */
    buttonLabel: string;
    /** Optional CSS class name for the form */
    className?: string;
    /** Flag to maintain loading state after submission */
    keepIsLoading?: boolean;
    /** Additional data to be passed to the form */
    requiredData?: Record<string, any>;
    /** Zod schema for form validation */
    schema: z.ZodObject<any>
  };
  /** Additional parameters passed to QueryBaseComponent for data fetching */
  params?: Record<string, any>;
};

/**
 * A generic component for updating data with form validation and optimized API updates
 *
 * Features:
 * - Integrates with QueryBaseComponent for initial data fetching
 * - Only sends changed form values to the API
 * - Supports custom mutation names and callbacks
 * - Handles form validation with Zod
 * - Ignores timestamp fields (createdAt, updatedAt, deletedAt) in change detection
 *
 * @example
 * ```tsx
 * <UpdateDataWrapper
 *   id="648339adsf043c8ed"
 *   name="product"
 *   Form={ProductForm}
 *   formProps={{
 *     buttonLabel: "Update Product",
 *     schema: productSchema
 *   }}
 * />
 * ```
 */
export default function UpdateDataWrapper({
  id,
  name,
  Form,
  updateMutation,
  doAfterSuccessUpdate,
  cleanDataBeforeUpdate = (data) => data,
  formProps,
  params,
}: UpdateDataWrapperProps) {
  const api = useApi();
  const [updateData, state] = (api as any)[
    updateMutation || `useUpdate${pascalCase(name)}Mutation`
  ]();
  const [fetchedData, setFetchedData] = useState<Record<string, any>>();
  const [dataForm, setDataForm] = useState<UseFormReturn>();

  useEffect(() => {
    dataForm?.reset(fetchedData);
  }, [fetchedData]);

  /**
   * Handles form submission and data update
   * Only sends changed fields to the API by comparing with initial values
   *
   * @param data Current form data
   * @param form React Hook Form instance
   */
  function handleUpdateData(
    data: z.infer<typeof formProps.schema>,
    form: UseFormReturn
  ) {
    const cleanedData = cleanDataBeforeUpdate(
      data
      // getFormChangedValues(
      //   formProps.schema.optional().safeParse(form?.formState?.defaultValues)
      //     .data,
      //   data
      // )
    );

    // Submit update with ID in path and changed data in body
    updateData({ id, body: cleanedData })
      .unwrap()
      .then(async (response: any) => {
        doAfterSuccessUpdate &&
          (await doAfterSuccessUpdate({ response, data: cleanedData, form }));

        form.reset({ ...data, ...fetchedData });
        setDataForm(form);
      })
      .catch(() => {});
  }

  return (
    <QueryBoundary
      name={camelCase(name)}
      successComponentProps={{
        formProps: { ...state, ...formProps, onSubmit: handleUpdateData },
        Form: Form,
        fetchedData,
        setFetchedData,
      }}
      SuccessComponent={SuccessComponent}
      query={"useGetOne"}
      params={{ id, ...params }}
      showReloadAgainButton={false}
    />
  );
}

/**
 * Renders the form with fetched data
 */
function SuccessComponent({
  data,
  Form,
  formProps,
  setFetchedData,
}: {
  data: any;
  Form: (props: FormComponentProps) => React.JSX.Element;
  formProps: any;
  fetchedData: any;
  setFetchedData: React.SetStateAction<React.Dispatch<Record<string, any>>>;
}) {
  useEffect(() => {
    setFetchedData(data.data);
  }, [data]);

  return <Form {...formProps} defaultValues={data.data} source={data.data} />;
}
