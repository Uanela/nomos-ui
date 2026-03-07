import * as React from "react";
import { useState, useMemo } from "react";
import { AsteriskIcon } from "lucide-react";
import { cn } from "../utils/shadcn-ui/utils";
import { twMerge } from "tailwind-merge";

/**
 * Props for the enhanced Textarea component
 */
export type TextareaProps<TValue extends string | null | undefined> = {
  /** Additional class name for the textarea element */
  textareaClassName?: string;
  /** Additional class name for the container */
  className?: string;
  /** Placeholder text for the textarea */
  placeholder?: string;
  /** Label text for the textarea */
  label?: string;
  /** Additional props name for the label */
  labelProps?: React.ComponentProps<"label">;
  /** Additional class name for the textarea container/wrapper */
  textareaContainerClassName?: string;
  /** Whether the textarea is disabled */
  disabled?: boolean;
  /** Whether to trim textarea value before calling onChange */
  trim?: boolean;
  /** Current value of the textarea */
  value?: TValue;
  /** Callback fired when textarea value changes */
  onChange?: (
    value: TValue,
    e?: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  /** Whether the field is required */
  required?: boolean;
  /** Whether to show an asterisk for required fields */
  showRequiredSign?: boolean;
  /** Tooltip text providing additional information */
  tip?: string;
  /** Error message to display */
  error?: string;
  /** Ref for the container div */
  ref?: any;
  /** Ref for the textarea element */
  textareaRef?: any;
  /** Number of visible text rows */
  rows?: number;
  /** Maximum character length */
  maxLength?: number;
  /** Whether to show character counter */
  showCharCount?: boolean;
};

/**
 * An enhanced textarea component with:
 * - Label support with required indicators
 * - Focus state management
 * - Error state with validation
 * - Character counter
 * - Value trimming
 * - Semantic color tokens from design system
 *
 * @component
 * @example
 * ```tsx
 * <Textarea
 *   label="Description"
 *   required
 *   showRequiredSign
 *   maxLength={500}
 *   showCharCount
 *   value={description}
 *   onChange={(value) => setDescription(value)}
 * />
 * ```
 */
export default function Textarea<TValue extends string | null | undefined>({
  textareaClassName,
  className,
  placeholder,
  label,
  labelProps,
  disabled = false,
  trim = false,
  value,
  onChange,
  required = false,
  showRequiredSign = false,
  tip,
  error,
  textareaContainerClassName,
  ref,
  textareaRef,
  rows = 4,
  maxLength,
  showCharCount = false,
  ...props
}: TextareaProps<TValue> &
  Omit<React.ComponentProps<"textarea">, keyof TextareaProps<TValue>>) {
  const [isFocused, setIsFocused] = useState(false);

  function handleOnChange(
    val: string,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    if (disabled || !onChange) return;
    onChange((trim ? val.trim() : val) as TValue, e);
  }

  const currentValue = useMemo(() => value || "", [value]);
  const charCount = currentValue.toString().length;

  return (
    <div className={cn("w-full space-y-1.5", className)} ref={ref}>
      {label && (
        <div className={cn("flex items-center gap-1")}>
          <label
            {...((labelProps?.htmlFor || props?.id) && {
              htmlFor: labelProps?.htmlFor || props?.id,
            })}
            className={twMerge(
              "text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              labelProps?.className
            )}
          >
            {label}
          </label>
          {required && showRequiredSign && (
            <AsteriskIcon className="h-3 w-3 text-destructive" />
          )}
        </div>
      )}

      <div
        className={cn(
          "relative flex w-full rounded-md border bg-transparent shadow-xs transition-[color,box-shadow]",
          isFocused && !error && "border-ring ring-[3px] ring-ring/50",
          error &&
            "border-destructive ring-[3px] ring-destructive/20 dark:ring-destructive/40",
          !isFocused && !error && "border-textarea",
          disabled && "cursor-not-allowed opacity-50",
          textareaContainerClassName
        )}
      >
        <textarea
          disabled={disabled}
          required={required}
          onBlur={(e) => {
            props?.onBlur?.(e);
            setIsFocused(false);
          }}
          onFocus={(e) => {
            props?.onFocus?.(e);
            setIsFocused(true);
          }}
          onChange={(e) => {
            const value = e.currentTarget.value;
            if (onChange) {
              handleOnChange(value, e);
            }
          }}
          value={currentValue}
          placeholder={placeholder !== undefined ? placeholder : `${label}...`}
          rows={rows}
          maxLength={maxLength}
          className={cn(
            "w-full flex-1 bg-transparent px-3 py-2 text-base outline-none resize-y min-h-16",
            "disabled:cursor-not-allowed disabled:bg-transparent",
            "md:text-sm",
            "placeholder:text-muted-foreground",
            textareaClassName
          )}
          ref={textareaRef}
          {...props}
        />
      </div>

      {(tip || showCharCount || error) && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            {tip && !error && (
              <p className="text-xs text-muted-foreground">{tip}</p>
            )}
            {error && <p className="text-xs text-destructive">*{error}</p>}
          </div>
          {showCharCount && maxLength && (
            <p
              className={cn(
                "text-xs tabular-nums",
                charCount > maxLength
                  ? "text-destructive"
                  : "text-muted-foreground"
              )}
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
