import React from "react";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import CreateDataWrapper from "../../data-manipulation/create-data-wrapper";
import PageTitleAndDescription from "../components/page-title-and-description";
import { usePathname } from "@nomos-ui/core/hooks";

/**
 * Props for the CreateDataPage component
 *
 * @template Input - The shape of the form values / data being submitted
 * @template Response - The shape of the API response returned after successful creation
 * @template FormProps - Additional props accepted by the Form component
 */
type CreateDataPageProps<
  Input,
  Response,
  FormProps extends Record<string, any> = Record<string, any>,
> = {
  /** Form component to render for data creation */
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
  /** Title displayed in the page header */
  title: string;
  /** Description displayed below the page title */
  description: string;
  /**
   * When true, maintains the form button's loading state after submission.
   * Useful when additional processing is needed after data creation.
   */
  keepIsLoading?: boolean;
  /** Additional data to be passed to the form component */
  requiredData?: Record<string, any>;
  /**
   * Callback executed after successful data creation.
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
   */
  cleanDataBeforeCreate?: (data: Input) => Promise<Input>;
  /** Zod schema used for form validation */
  schema: z.ZodObject<any>;
  /** Buttons to be displayed in the top-right corner of the page, next to the title */
  topButtons?: React.ReactNode[];
  /** Props passed directly to the Form component */
  formProps: FormProps & {
    /** Label for the form's submit button */
    buttonLabel: string;
    /** Optional CSS class name for the form */
    className?: string;
  };
};

/**
 * A generic page component for creating data with form validation.
 * Wraps CreateDataWrapper inside a page layout with a title, description, and optional top buttons.
 *
 * @template Input - The shape of the form values / data being submitted
 * @template Response - The shape of the API response returned after successful creation
 * @template FormProps - Additional props accepted by the Form component
 *
 * @example
 * ```tsx
 * <CreateDataPage<CreateProductInput, Product, ProductFormProps>
 *   title="Create Product"
 *   description="Fill in the details to create a new product"
 *   schema={productSchema}
 *   Form={ProductForm}
 *   useMutation={useCreateProductMutation}
 *   formProps={{ buttonLabel: "Create Product" }}
 * />
 * ```
 */
export default function CreateDataPage<
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
  topButtons,
  Form,
  useMutation,
  doAfterSuccessCreate,
  cleanDataBeforeCreate,
}: CreateDataPageProps<Input, Response, FormProps>) {
  const pathname = usePathname();
  const listHref = pathname.split("/");
  listHref.pop();

  return (
    <div className="grid md:gap-4 gap-2">
      <div className="flex justify-between items-center">
        <PageTitleAndDescription title={title} description={description} />
        {/* <div className="md:block hidden"> */}
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
          <CreateDataWrapper<Input, Response, FormProps>
            Form={Form}
            useMutation={useMutation}
            cleanDataBeforeCreate={cleanDataBeforeCreate}
            doAfterSuccessCreate={doAfterSuccessCreate}
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
