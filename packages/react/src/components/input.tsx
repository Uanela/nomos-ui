"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { AsteriskIcon, EyeIcon, EyeOffIcon, SearchIcon } from "lucide-react";
import { cn } from "../utils/shadcn-ui/utils";

/**
 * Props for the enhanced Input component
 */
export type InputProps = {
  /** Additional class name for the input element */
  inputClassName?: string;
  /** Additional class name for the container */
  className?: string;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Label text for the input */
  label?: string;
  /** Additional class name for the label */
  labelClassName?: string;
  /** Additional class name for the input container/wrapper */
  inputContainerClassName?: string;
  /** Input type (e.g., text, number, password) */
  type?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether to trim input value before calling onChange */
  trim?: boolean;
  /** Current value of the input */
  value?: string | number;
  /** Callback fired when input value changes */
  onChange?: (
    value: string | number | null,
    e?: React.ChangeEvent<HTMLInputElement>
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
  /** Ref for the input element */
  inputRef?: any;
  /** Whether to show search icon (overrides type="search" icon display) */
  showSearchIcon?: boolean;
};

/**
 * An enhanced input component combining the best of both worlds:
 * - Semantic color tokens from design system (foreground, muted-foreground, etc.)
 * - Label support with required indicators
 * - Password visibility toggle
 * - Search icon support
 * - Focus state management
 * - Error state with validation
 * - Value trimming and type coercion
 * - Datetime/date value formatting
 *
 * @component
 * @example
 * ```tsx
 * <Input
 *   label="Username"
 *   placeholder="Enter username"
 *   type="text"
 *   required
 *   showRequiredSign
 *   error="Username is required"
 *   onChange={(value) => console.log(value)}
 * />
 * ```
 */
export default function Input({
  inputClassName,
  className,
  placeholder,
  label,
  labelClassName,
  type = "text",
  disabled = false,
  trim = false,
  value = "",
  onChange,
  required = false,
  showRequiredSign = false,
  tip,
  error,
  inputContainerClassName,
  ref,
  inputRef,
  showSearchIcon,
  ...props
}: InputProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof InputProps>) {
  const isPassword = type.includes("password");
  const [showPassword, setShowPassword] = useState<boolean>(!isPassword);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  function handleOnChange(text: string) {
    if (disabled || !onChange) return;
    const processedValue = trim ? text.trim() : text;
    onChange(
      type === "number" && processedValue
        ? Number(processedValue)
        : processedValue
    );
  }

  const currentValue = useMemo(() => {
    if (type === "datetime-local") {
      let newValue = value.toString().split(".");
      if (newValue.length === 2) return newValue[0]?.slice?.(0, -3);
      else return value;
    }
    if (type === "date") return value.toString().split("T")[0];

    return value;
  }, [value, type]);

  return (
    <div ref={ref} className={cn("gap-1 grid", className)}>
      {/* Label with required indicator */}
      {label && (
        <div className="flex flex-row items-center gap-1">
          <label
            htmlFor={props.id}
            className={cn(
              "text-sm font-medium text-foreground",
              labelClassName
            )}
          >
            {label}
          </label>
          {required && showRequiredSign && (
            <AsteriskIcon size={12} className="text-destructive" />
          )}
        </div>
      )}

      {/* Input container with focus state */}
      <div
        data-focus={isFocused}
        className={cn(
          // Base styles with semantic colors
          "flex w-full min-w-0 rounded-md border bg-transparent shadow-xs transition-[color,box-shadow,border-color]",
          "border-input file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",

          // Focus styles
          "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
          "data-[focus=true]:border-ring data-[focus=true]:ring-ring/50 data-[focus=true]:ring-[3px]",

          // Error/Invalid styles
          error &&
            "border-destructive ring-destructive/20 dark:ring-destructive/40",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",

          // Disabled styles
          "disabled:cursor-not-allowed disabled:opacity-50",

          // Dark mode
          "dark:bg-input/30",

          // Layout
          "flex-row items-center",

          inputContainerClassName
        )}
      >
        {/* Search Icon */}
        {(type === "search" || showSearchIcon) && (
          <SearchIcon
            size={18}
            className="text-muted-foreground ml-3 flex-shrink-0"
          />
        )}

        {/* Input Element */}
        <input
          type={isPassword && showPassword ? "text" : type}
          disabled={disabled}
          required={required}
          aria-invalid={error ? "true" : "false"}
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
              handleOnChange(value);
              onChange(value, e);
            }
          }}
          value={currentValue}
          placeholder={placeholder}
          className={cn(
            "h-9 w-full flex-1 bg-transparent px-3 py-1 text-base outline-none",
            "file:inline-flex file:h-7",
            "disabled:cursor-not-allowed disabled:bg-transparent",
            "md:text-sm",
            inputClassName
          )}
          step="any"
          ref={inputRef}
          {...props}
        />

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => !disabled && setShowPassword((prev) => !prev)}
            disabled={disabled}
            className="mr-3 flex-shrink-0 cursor-pointer text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            tabIndex={-1}
          >
            {showPassword ? <EyeIcon size={16} /> : <EyeOffIcon size={16} />}
          </button>
        )}
      </div>

      {/* Tip text */}
      {tip && !error && (
        <p className="text-xs text-muted-foreground tip-message">{tip}</p>
      )}

      {/* Error message */}
      {error && (
        <p className="text-xs text-destructive error-message">*{error}</p>
      )}
    </div>
  );
}
