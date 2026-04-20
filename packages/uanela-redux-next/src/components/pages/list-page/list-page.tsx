import React from "react";
import ListPageTemplate, { ListPageTemplateProps } from "./template";
import { TableField } from "./table/types";
import PageTitleAndDescription from "../components/page-title-and-description";
import { twMerge } from "tailwind-merge";
import { BaseData } from "./table/table";

/**
 * Props for the ListPage component
 *
 * @template T - The type of data being listed
 */
export type ListPageProps<T extends BaseData> = {
  /** Title displayed in the page header */
  title: string;
  /** Description displayed below the page title */
  description: string;
  /** Table field definitions */
  fields: TableField<T>[];
  /** Additional query parameters */
  params?: Record<string, any>;
  /** Additional props for the template and table container */
  templateProps?: {
    tableContainerProps?: React.ComponentProps<"div">;
  } & React.ComponentProps<"div">;
} & React.ComponentProps<"div">;

/**
 * A generic list page component that renders a title, description, and a ListPageTemplate.
 * Handles layout and passes through all data fetching and CRUD props to the template.
 *
 * @template T - The type of data being listed
 *
 * @example
 * ```tsx
 * <ListPage<Product>
 *   title="Products"
 *   description="Manage your products"
 *   fields={productFields}
 *   useQuery={useGetProductsQuery}
 *   useDeleteMutation={useDeleteProductMutation}
 * />
 * ```
 */
export default function ListPage<T extends { id: string }>({
  title,
  description,
  CreateDataModal,
  UpdateDataModal,
  fields,
  onDeleteSuccess = () => {},
  cleanDataForTemplate,
  params = {},
  className,
  templateProps,
  useQuery,
  useDeleteMutation,
  ...props
}: ListPageProps<T> & ListPageTemplateProps<T>) {
  return (
    <div className={twMerge("flex flex-col gap-4", className)} {...props}>
      {(title || description) && (
        <PageTitleAndDescription title={title} description={description} />
      )}
      <ListPageTemplate
        useQuery={useQuery}
        useDeleteMutation={useDeleteMutation}
        fields={fields}
        onDeleteSuccess={onDeleteSuccess}
        cleanDataForTemplate={cleanDataForTemplate}
        CreateDataModal={CreateDataModal}
        UpdateDataModal={UpdateDataModal}
        params={params}
        {...templateProps}
        {...props}
        className={twMerge(
          "h-[calc(100%-68px)] bg-background border border-input p-2 sm:p-4 rounded-lg overflow-auto",
          templateProps?.className
        )}
        tableContainerProps={{
          ...templateProps?.tableContainerProps,
          className: twMerge(
            "flex flex-col overflow-y-auto rounded-md md:h-[calc(100%-82px)] h-full overflow-auto md:overflow-x-auto",
            templateProps?.tableContainerProps?.className
          ),
        }}
      />
    </div>
  );
}
