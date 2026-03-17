import React from "react";
import { z } from "zod";
import { FieldValues, UseFormReturn } from "react-hook-form";
import UpdateDataWrapper from "../../data-manipulation/update-data-wrapper";
import PageTitleAndDescription from "../components/page-title-and-description";
import { useParams } from "@nomos-ui/core/hooks";

/**
 * Props for the UpdateDataPage component
 *
 * @template Input - The shape of the form values / data being submitted
 * @template Response - The shape of the API response returned after successful update
 * @template FormProps - Additional props accepted by the Form component
 */
type UpdateDataPageProps<
  Input extends FieldValues,
  Response,
  FormProps extends Record<string, any> = Record<string, any>,
> = {
  /** Form component to render for data update */
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
  /** Title displayed in the page header */
  title: string;
  /** Description displayed below the page title */
  description: string;
  /**
   * When true, maintains the form button's loading state after submission.
   * Useful when additional processing is needed after data update.
   */
  keepIsLoading?: boolean;
  /** Additional data to be passed to the form component */
  requiredData?: Record<string, any>;
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
   */
  cleanDataBeforeUpdate?: (data: Input) => Input;
  /** Zod schema used for form validation */
  schema: z.ZodObject<any>;
  /** Buttons to be displayed in the top-right corner of the page, next to the title */
  topButtons?: React.ReactNode[];
  /** Additional parameters passed to the query hook for data fetching */
  params?: Record<string, any>;
  /** Props passed directly to the Form component */
  formProps: FormProps & {
    /** Label for the form's submit button */
    buttonLabel: string;
    /** Optional CSS class name for the form */
    className?: string;
  };
};

/**
 * A generic page component for updating data with form validation.
 * Wraps UpdateDataWrapper inside a page layout with a title, description, and optional top buttons.
 * Reads the record ID from the router adapter automatically via useParams.
 *
 * @template Input - The shape of the form values / data being submitted
 * @template Response - The shape of the API response returned after successful update
 * @template FormProps - Additional props accepted by the Form component
 *
 * @example
 * ```tsx
 * <UpdateDataPage<UpdateProductInput, Product, ProductFormProps>
 *   title="Edit Product"
 *   description="Update the product details"
 *   schema={productSchema}
 *   Form={ProductForm}
 *   useMutation={useUpdateProductMutation}
 *   useQuery={useGetProductQuery}
 *   formProps={{ buttonLabel: "Save Changes" }}
 * />
 * ```
 */
export default function UpdateDataPage<
  Input extends FieldValues,
  Response,
  FormProps extends Record<string, any> = Record<string, any>,
>({
  title,
  description,
  keepIsLoading,
  requiredData,
  schema,
  formProps,
  topButtons,
  Form,
  useMutation,
  useQuery,
  doAfterSuccessUpdate,
  cleanDataBeforeUpdate,
  params,
}: UpdateDataPageProps<Input, Response, FormProps>) {
  const routeParams = useParams();
  const id = routeParams.get("id");

  return (
    <div className="grid md:gap-4 gap-2">
      <div className="flex justify-between items-center">
        <PageTitleAndDescription title={title} description={description} />
        {/* <div> */}
        {/*   {!topButtons ? ( */}
        {/*     <Button href={`${listHref.join("/")}`}> */}
        {/*       <ListIcon size={18} /> */}
        {/*       <span>Listar {plural(kebabCase(name))}</span> */}
        {/*     </Button> */}
        {/*   ) : ( */}
        {/*     topButtons.map((button: React.ReactNode, i: number) => ( */}
        {/*       <div key={i}>{button}</div> */}
        {/*     )) */}
        {/*   )} */}
        {/* </div> */}
      </div>
      <div className="bg-background rounded-lg lg:h-[calc(100vh-154px)] h-[calc(100vh-140px)] md:p-4 p-2 border-input border overflow-auto">
        <div className="main-container-content">
          <UpdateDataWrapper<Input, Response, FormProps>
            id={id as string}
            Form={Form}
            useMutation={useMutation}
            useQuery={useQuery}
            cleanDataBeforeUpdate={cleanDataBeforeUpdate}
            doAfterSuccessUpdate={doAfterSuccessUpdate}
            params={params}
            formProps={{
              ...formProps,
              keepIsLoading,
              requiredData,
              schema,
            }}
          />
        </div>
      </div>
    </div>
  );
}
