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
  ...props
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
  const { transform, ...fieldPropsWithoutTransform } = field?.props || {};
  const { transform: ts, ...headPropsWithoutTransform } =
    field?.headProps || {};

  if (field.type === "DATE" && value) value = new Date(value).toUTCString();

  if (
    (selectedOptions?.includes(field.name) && availableFields?.[0]?.label) ||
    index === 0
  )
    return (
      <div
        data-has-transformer={!!field.props?.transform}
        {...headPropsWithoutTransform}
        {...fieldPropsWithoutTransform}
        onClick={(e) =>
          (field.dataProps?.onClick || field.props?.onClick)?.(item, field, e)
        }
        onMouseEnter={(e) =>
          (field.dataProps?.onMouseEnter || field.props?.onMouseEnter)?.(
            item,
            field,
            e
          )
        }
        onMouseLeave={(e) =>
          (field.dataProps?.onMouseLeave || field.props?.onMouseLeave)?.(
            item,
            field,
            e
          )
        }
        className={twMerge(
          "text-left w-40 p-2 data-[has-transformer=true]:py-0 truncate flex-shrink-0",
          className
        )}
      >
        {field.props?.transform
          ? renderItem(field?.props?.transform(item))
          : renderItem(
              value !== null && value !== undefined ? String(value) : "-"
            )}
      </div>
    );
}

/**
 * Sets a value at a nested path in an object using dot or bracket notation
 * @param path - Path with dots or brackets (e.g., "brand.name" or "brand[name]")
 * @param value - Value to set at the path
 * @returns Object with nested structure
 */
export function setNestedValue(path: string, value: any): Record<string, any> {
  const keys = parsePath(path);
  if (keys.length === 1) return { [keys[0] as string]: value };
  return keys.reduceRight(
    (acc, key, index) => {
      if (index === keys.length - 1) return { [key]: value };
      return { [key]: acc };
    },
    {} as Record<string, any>
  );
}

/**
 * Gets a value from a nested path in an object using dot or bracket notation
 * @param obj - The object to get the value from
 * @param path - Path with dots or brackets (e.g., "brand.name" or "brand[name]")
 * @returns The value at the path, or undefined if not found
 */
export function getNestedValue(obj: Record<string, any>, path: string): any {
  const keys = parsePath(path);
  return keys.reduce((acc, key) => acc?.[key], obj);
}

/**
 * Parses a path string into an array of keys
 * Handles both dot notation (brand.name) and bracket notation (brand[name])
 * @param path - Path string to parse
 * @returns Array of keys
 */
function parsePath(path: string): string[] {
  // Replace brackets with dots and remove the brackets
  // e.g., "brand[name]" -> "brand.name", "brand[0]" -> "brand.0"
  const normalized = path.replace(/\[([^\]]+)\]/g, ".$1");

  // Split by dots and filter out empty strings
  return normalized.split(".").filter((key) => key.length > 0);
}
