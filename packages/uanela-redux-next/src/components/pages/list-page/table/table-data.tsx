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
  let value = getNestedValue(item, field.name);

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

/**
 * Sets a value at a nested path in an object using dot notation
 * @param path - Dot-separated path (e.g., "brand.name")
 * @param value - Value to set at the path
 * @returns Object with nested structure
 */
export function setNestedValue(path: string, value: any): Record<string, any> {
  const keys = path.split(".");

  if (keys.length === 1) return { [path]: value };

  return keys.reduceRight(
    (acc, key, index) => {
      if (index === keys.length - 1) return { [key]: value };

      return { [key]: acc };
    },
    {} as Record<string, any>
  );
}

/**
 * Gets a value from a nested path in an object using dot notation
 * @param obj - The object to get the value from
 * @param path - Dot-separated path (e.g., "brand.name")
 * @returns The value at the path, or undefined if not found
 */
export function getNestedValue(obj: Record<string, any>, path: string): any {
  const keys = path.split(".");
  return keys.reduce((acc, key) => acc?.[key], obj);
}
