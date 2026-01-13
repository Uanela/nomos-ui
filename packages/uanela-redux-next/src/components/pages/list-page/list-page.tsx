import React from "react";
import ListPageTemplate, { ListPageTemplateProps } from "./template";
import { TableField } from "./table/types";
import PageTitleAndDescription from "../components/page-title-and-description";
import { twMerge } from "tailwind-merge";

export type ListPageProps<T> = {
  /** Name of the tag the queried in camelCase and singular. */
  name: string;
  title: string;
  description: string;
  fields: TableField<T>[];
  params?: Record<string, any>;
  templateProps?: {
    tableContainerProps: React.ComponentProps<"div">;
  } & React.ComponentProps<"div">;
} & React.ComponentProps<"div">;

export default function ListPage<T extends { id: string }>({
  name,
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
  ...props
}: ListPageProps<T> & ListPageTemplateProps<T>) {
  return (
    <>
      <div className={twMerge("flex flex-col gap-4", className)} {...props}>
        {(title || description) && (
          <PageTitleAndDescription title={title} description={description} />
        )}
        <ListPageTemplate
          name={name}
          fields={fields}
          onDeleteSuccess={onDeleteSuccess}
          cleanDataForTemplate={cleanDataForTemplate}
          CreateDataModal={CreateDataModal}
          UpdateDataModal={UpdateDataModal}
          params={params}
          {...templateProps}
          className={twMerge(
            "h-[calc(100%-68px)] bg-background border border-input p-2 sm:p-4 rounded-lg",
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
    </>
  );
}
