import {
  Select as ShadcnSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./shadcn-ui/select";
import { twMerge } from "tailwind-merge";
import { AsteriskIcon, X } from "lucide-react";
import React from "react";

export type SelectOption<T = string> = {
  value: T;
  label: React.ReactNode;
};

export type SelectProps<T = string> = {
  className?: string;
  label?: string;
  required?: boolean;
  showRequiredSign?: boolean;
  options: SelectOption<T>[];
  value?: T | T[];
  onChange?: (value: T | T[]) => void;
  placeholder?: string;
  multiple?: boolean;
  labelProps?: {
    className?: string;
  };
  triggerProps?: {
    className?: string;
  };
  contentProps?: {
    className?: string;
  };
  valueProps?: {
    className?: string;
  };
  groupProps?: {
    className?: string;
  };
  itemProps?: {
    className?: string;
  };
  error?: string;
  tip?: string;
};

/**
 * Customizable select dropdown with smart positioning and flexible styling
 * Supports both single and multiple selection
 */
export default function Select<T extends string = string>({
  className,
  label,
  required = false,
  showRequiredSign = false,
  options,
  value,
  onChange,
  placeholder,
  multiple = false,
  labelProps,
  triggerProps,
  contentProps,
  valueProps,
  groupProps,
  itemProps,
  error,
  tip,
}: SelectProps<T>) {
  const handleValueChange = (newValue: T) => {
    if (!multiple) {
      onChange?.(newValue);
      return;
    }

    const currentValues = Array.isArray(value) ? value : [];
    const isSelected = currentValues.includes(newValue);

    if (isSelected) {
      const filtered = currentValues.filter((v) => v !== newValue);
      onChange?.(filtered);
    } else {
      onChange?.([...currentValues, newValue]);
    }
  };

  const handleRemoveTag = (valueToRemove: T) => {
    if (!multiple || !Array.isArray(value)) return;

    const filtered = value.filter((v) => v !== valueToRemove);
    onChange?.(filtered);
  };

  const getSelectedLabels = () => {
    if (!multiple || !Array.isArray(value)) return null;

    return value
      .map((v) => options.find((opt) => opt.value === v))
      .filter(Boolean)
      .map((opt) => ({
        value: opt!.value,
        label: opt!.label,
      }));
  };

  if (multiple) {
    const selectedLabels = getSelectedLabels();

    return (
      <div className={twMerge("gap-1 grid", className)}>
        {label && (
          <div className="flex flex-row items-center gap-1">
            <label className={twMerge("font-bold", labelProps?.className)}>
              {label}
            </label>
            {required && showRequiredSign && (
              <AsteriskIcon size={12} color="red" />
            )}
          </div>
        )}
        <ShadcnSelect value="" onValueChange={handleValueChange}>
          <SelectTrigger
            className={twMerge("min-h-10", triggerProps?.className)}
          >
            <div className="flex flex-wrap gap-2 flex-1">
              {selectedLabels && selectedLabels.length > 0 ? (
                selectedLabels.map((item) => (
                  <div
                    key={String(item.value)}
                    className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.label}
                    <X
                      size={14}
                      className="cursor-pointer hover:text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTag(item.value);
                      }}
                    />
                  </div>
                ))
              ) : (
                <span
                  className={twMerge(
                    "text-muted-foreground",
                    valueProps?.className
                  )}
                >
                  {placeholder}
                </span>
              )}
            </div>
          </SelectTrigger>
          <SelectContent className={contentProps?.className}>
            <SelectGroup className={groupProps?.className}>
              {options.map((option) => {
                const isSelected =
                  Array.isArray(value) && value.includes(option.value);
                return (
                  <SelectItem
                    key={String(option.value)}
                    value={option.value}
                    className={twMerge(
                      isSelected && "bg-blue-50",
                      itemProps?.className
                    )}
                  >
                    {option.label}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </ShadcnSelect>
        {tip && !error && (
          <p className="text-xs text-muted-foreground tip-message">{tip}</p>
        )}

        {error && (
          <p className="text-xs text-destructive error-message">*{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className={twMerge("gap-1 grid", className)}>
      {label && (
        <div className="flex flex-row items-center gap-1">
          <label className={twMerge("font-bold", labelProps?.className)}>
            {label}
          </label>
          {required && showRequiredSign && (
            <AsteriskIcon size={12} color="red" />
          )}
        </div>
      )}
      <ShadcnSelect
        value={value as T}
        onValueChange={onChange as (value: T) => void}
      >
        <SelectTrigger className={triggerProps?.className}>
          <SelectValue
            placeholder={placeholder}
            className={valueProps?.className}
          />
        </SelectTrigger>
        <SelectContent className={contentProps?.className}>
          <SelectGroup className={groupProps?.className}>
            {options.map((option) => (
              <SelectItem
                key={String(option.value)}
                value={option.value}
                className={itemProps?.className}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </ShadcnSelect>
      {tip && !error && (
        <p className="text-xs text-muted-foreground tip-message">{tip}</p>
      )}

      {error && (
        <p className="text-xs text-destructive error-message">*{error}</p>
      )}
    </div>
  );
}
