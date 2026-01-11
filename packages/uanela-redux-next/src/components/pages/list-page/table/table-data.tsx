import React from "react";
import { twMerge } from "tailwind-merge";
import { BaseData } from "./table";
import { TableField } from "./types";

export default function TableData<T extends BaseData>({
  className,
  availableFields,
  field,
  item,
  renderItem = (value) => <>{value}</>,
  selectedOptions,
  index,
}: {
  children?: React.ReactNode;
  availableFields: TableField<T>[];
  field: TableField<T>;
  item: T;
  renderItem?: (value: React.ReactNode) => React.ReactNode;
  selectedOptions: any[];
  index: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  let value = item[field.name];

  if (field.type === "DATE" && value) value = new Date(value).toUTCString();

  if (
    (selectedOptions?.includes(`${field.label}`) &&
      availableFields?.[0]?.label) ||
    index === 0
  )
    return (
      <div
        data-has-transformer={!!field.configs?.transform}
        className={twMerge(
          "text-left w-40 p-2 data-[has-transformer=true]:py-0 truncate flex-shrink-0",
          className
        )}
      >
        {field.configs?.transform
          ? renderItem(field.configs?.transform(item))
          : renderItem(
              value !== null && value !== undefined ? String(value) : "-"
            )}
      </div>
    );
}
