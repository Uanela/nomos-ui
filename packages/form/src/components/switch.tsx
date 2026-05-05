import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { twMerge } from "tailwind-merge";
import { AsteriskIcon } from "lucide-react";
import { Switch as ShadcnSwitch } from "./shadcn-ui/switch";

export type SwitchProps = {
  className?: string;
  label?: string;
  required?: boolean;
  showRequiredSign?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: "sm" | "default";
  labelProps?: React.ComponentProps<"label">;
  switchProps?: Omit<
    React.ComponentProps<typeof SwitchPrimitive.Root>,
    "checked" | "onCheckedChange"
  >;
  /** Place the label before ("start") or after ("end") the switch. Defaults to "end". */
  labelPosition?: "start" | "end";
  error?: string;
  tip?: string;
  disabled?: boolean;
};

/**
 * Switch with an optional label, tip, and error message.
 * Mirrors the Select component's label + error + tip pattern.
 */
export default function Switch({
  className,
  label,
  required = false,
  showRequiredSign = false,
  checked,
  onCheckedChange,
  size = "default",
  labelProps,
  switchProps,
  labelPosition = "end",
  error,
  tip,
  disabled,
}: SwitchProps) {
  const switchId =
    switchProps?.id ??
    (label ? `switch-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

  const switchEl = (
    <ShadcnSwitch
      {...switchProps}
      id={switchId}
      size={size}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      aria-invalid={!!error}
    />
  );

  const labelEl = label ? (
    <div className="flex flex-row items-center gap-1">
      <label
        {...labelProps}
        htmlFor={labelProps?.htmlFor ?? switchId}
        className={twMerge(
          "font-bold cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed",
          labelProps?.className
        )}
      >
        {label}
      </label>
      {required && showRequiredSign && <AsteriskIcon size={12} color="red" />}
    </div>
  ) : null;

  return (
    <div className={twMerge("gap-1 grid w-full", className)}>
      <div className="flex flex-row items-center gap-2">
        {labelPosition === "start" && labelEl}
        {switchEl}
        {labelPosition === "end" && labelEl}
      </div>

      {tip && !error && (
        <p className="text-xs text-muted-foreground tip-message">{tip}</p>
      )}
      {error && (
        <p className="text-xs text-destructive error-message">*{error}</p>
      )}
    </div>
  );
}
