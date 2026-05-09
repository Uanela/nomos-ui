import * as React from "react";
import { twMerge } from "tailwind-merge";
import { AsteriskIcon } from "lucide-react";
import {
  Slider as ShadcnSlider,
  SliderProps as ShadcnSliderProps,
} from "./shadcn-ui/slider";

export type SliderProps = {
  className?: string;
  label?: string;
  required?: boolean;
  showRequiredSign?: boolean;
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  labelProps?: React.ComponentProps<"label">;
  sliderProps?: Omit<
    ShadcnSliderProps,
    "value" | "defaultValue" | "onValueChange"
  >;
  labelPosition?: "start" | "end";
  error?: string;
  tip?: string;
  disabled?: boolean;
};

export default function Slider({
  className,
  label,
  required = false,
  showRequiredSign = false,
  value,
  defaultValue,
  onValueChange,
  labelProps,
  sliderProps,
  labelPosition = "start",
  error,
  tip,
  disabled,
}: SliderProps) {
  const sliderId =
    sliderProps?.id ??
    (label ? `slider-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

  const sliderEl = (
    <ShadcnSlider
      {...sliderProps}
      id={sliderId}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      aria-invalid={!!error}
    />
  );

  const labelEl = label ? (
    <div className="flex flex-row items-center gap-1">
      <label
        {...labelProps}
        htmlFor={labelProps?.htmlFor ?? sliderId}
        className={twMerge(
          "font-bold",
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
    <div className={twMerge("grid gap-1 w-full", className)}>
      {labelPosition === "start" && labelEl}

      {sliderEl}

      {labelPosition === "end" && labelEl}

      {tip && !error && (
        <p className="text-xs text-muted-foreground tip-message">{tip}</p>
      )}

      {error && (
        <p className="text-xs text-destructive error-message">*{error}</p>
      )}
    </div>
  );
}
